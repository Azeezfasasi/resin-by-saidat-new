import { connectDB } from '@/utils/db';
import Coupon from '@/app/server/models/Coupon';
import Order from '@/app/server/models/Order';
import Category from '@/app/server/models/Category';
import Product from '@/app/server/models/Product';
import { NextResponse } from 'next/server';

/**
 * GET /api/coupon
 * Get all coupons with filtering
 */
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const isActive = searchParams.get('isActive');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { isDeleted: false };

    if (search) {
      filter.$or = [
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (isActive !== null && isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    // Fetch coupons
    const coupons = await Coupon.find(filter)
      .populate('applicableCategories', 'name')
      .populate('excludeCategories', 'name')
      .populate('applicableProducts', 'name')
      .populate('excludeProducts', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const total = await Coupon.countDocuments(filter);

    return NextResponse.json({
      coupons,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coupons', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/coupon
 * Create a new coupon
 */
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate required fields
    if (!body.code || !body.code.trim()) {
      return NextResponse.json(
        { error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    if (!body.discountType || !body.discountValue) {
      return NextResponse.json(
        { error: 'Discount type and value are required' },
        { status: 400 }
      );
    }

    if (!body.startDate || !body.endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    // Check if end date is after start date
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);

    if (endDate <= startDate) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    // Check if coupon code already exists (including deleted ones to prevent reuse)
    const existingCoupon = await Coupon.findOne({ code: body.code.toUpperCase() });
    if (existingCoupon) {
      if (existingCoupon.isDeleted) {
        return NextResponse.json(
          { error: 'Coupon code was previously deleted. Please use a different code.' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: `Coupon code "${body.code.toUpperCase()}" already exists` },
        { status: 409 }
      );
    }

    // Create coupon
    const coupon = await Coupon.create({
      code: body.code.toUpperCase(),
      description: body.description,
      discountType: body.discountType,
      discountValue: body.discountValue,
      maxDiscountAmount: body.maxDiscountAmount,
      minOrderAmount: body.minOrderAmount || 0,
      usageLimit: body.usageLimit,
      usagePerCustomer: body.usagePerCustomer || 1,
      startDate,
      endDate,
      isActive: body.isActive !== false,
      applicableCategories: body.applicableCategories || [],
      excludeCategories: body.excludeCategories || [],
      applicableProducts: body.applicableProducts || [],
      excludeProducts: body.excludeProducts || [],
      restrictToNewCustomers: body.restrictToNewCustomers || false,
      applicableCustomers: body.applicableCustomers || []
    });

    // Fetch and populate the created coupon
    const populatedCoupon = await Coupon.findById(coupon._id)
      .populate('applicableCategories', 'name')
      .populate('excludeCategories', 'name')
      .populate('applicableProducts', 'name')
      .populate('excludeProducts', 'name')
      .exec();

    return NextResponse.json({ coupon: populatedCoupon }, { status: 201 });
  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json(
      { error: 'Failed to create coupon', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/coupon/validate
 * Validate a coupon for an order
 */
export async function validateCoupon(code, orderData) {
  try {
    await connectDB();

    const coupon = await Coupon.findByCouponCode(code);

    if (!coupon) {
      return { valid: false, error: 'Coupon not found' };
    }

    // Check if coupon is valid for this order
    if (!coupon.isValidForOrder(orderData)) {
      return { valid: false, error: 'Coupon is not applicable to this order' };
    }

    // Calculate discount
    const discount = coupon.calculateDiscount(orderData.subtotal);

    return {
      valid: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discount,
        description: coupon.description
      }
    };
  } catch (error) {
    console.error('Error validating coupon:', error);
    return { valid: false, error: 'Error validating coupon' };
  }
}
