import { connectDB } from '@/utils/db';
import Coupon from '@/app/server/models/Coupon';
import Category from '@/app/server/models/Category';
import Product from '@/app/server/models/Product';
import { NextResponse } from 'next/server';

/**
 * GET /api/coupon/[id]
 * Get a single coupon by ID
 */
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const coupon = await Coupon.findById(id)
      .populate('applicableCategories', 'name')
      .populate('excludeCategories', 'name')
      .populate('applicableProducts', 'name')
      .populate('excludeProducts', 'name');

    if (!coupon || coupon.isDeleted) {
      return NextResponse.json(
        { error: 'Coupon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ coupon });
  } catch (error) {
    console.error('Error fetching coupon:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coupon', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/coupon/[id]
 * Update a coupon
 */
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const body = await request.json();

    // Find coupon
    const coupon = await Coupon.findById(id);
    if (!coupon || coupon.isDeleted) {
      return NextResponse.json(
        { error: 'Coupon not found' },
        { status: 404 }
      );
    }

    // Check if code is being changed
    if (body.code && body.code !== coupon.code) {
      const existingCoupon = await Coupon.findOne({
        code: body.code.toUpperCase(),
        isDeleted: false,
        _id: { $ne: id }
      });
      if (existingCoupon) {
        return NextResponse.json(
          { error: 'Coupon code already exists' },
          { status: 409 }
        );
      }
      coupon.code = body.code.toUpperCase();
    }

    // Validate dates if they're being changed
    if (body.startDate || body.endDate) {
      const startDate = new Date(body.startDate || coupon.startDate);
      const endDate = new Date(body.endDate || coupon.endDate);

      if (endDate <= startDate) {
        return NextResponse.json(
          { error: 'End date must be after start date' },
          { status: 400 }
        );
      }

      coupon.startDate = startDate;
      coupon.endDate = endDate;
    }

    // Update fields
    if (body.description !== undefined) coupon.description = body.description;
    if (body.discountType) coupon.discountType = body.discountType;
    if (body.discountValue !== undefined) coupon.discountValue = body.discountValue;
    if (body.maxDiscountAmount !== undefined) coupon.maxDiscountAmount = body.maxDiscountAmount;
    if (body.minOrderAmount !== undefined) coupon.minOrderAmount = body.minOrderAmount;
    if (body.usageLimit !== undefined) coupon.usageLimit = body.usageLimit;
    if (body.usagePerCustomer !== undefined) coupon.usagePerCustomer = body.usagePerCustomer;
    if (body.isActive !== undefined) coupon.isActive = body.isActive;
    if (body.restrictToNewCustomers !== undefined) coupon.restrictToNewCustomers = body.restrictToNewCustomers;

    // Update restrictions
    if (body.applicableCategories) coupon.applicableCategories = body.applicableCategories;
    if (body.excludeCategories) coupon.excludeCategories = body.excludeCategories;
    if (body.applicableProducts) coupon.applicableProducts = body.applicableProducts;
    if (body.excludeProducts) coupon.excludeProducts = body.excludeProducts;
    if (body.applicableCustomers) coupon.applicableCustomers = body.applicableCustomers;

    await coupon.save();
    
    // Fetch and populate the updated coupon
    const populatedCoupon = await Coupon.findById(coupon._id)
      .populate('applicableCategories', 'name')
      .populate('excludeCategories', 'name')
      .populate('applicableProducts', 'name')
      .populate('excludeProducts', 'name')
      .exec();

    return NextResponse.json({ coupon: populatedCoupon });
  } catch (error) {
    console.error('Error updating coupon:', error);
    return NextResponse.json(
      { error: 'Failed to update coupon', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/coupon/[id]
 * Soft delete a coupon
 */
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const coupon = await Coupon.findById(id);
    if (!coupon || coupon.isDeleted) {
      return NextResponse.json(
        { error: 'Coupon not found' },
        { status: 404 }
      );
    }

    // Soft delete
    coupon.isDeleted = true;
    coupon.deletedAt = new Date();
    await coupon.save();

    return NextResponse.json({
      message: 'Coupon deleted successfully',
      coupon
    });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json(
      { error: 'Failed to delete coupon', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/coupon/[id]/restore
 * Restore a deleted coupon
 */
export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return NextResponse.json(
        { error: 'Coupon not found' },
        { status: 404 }
      );
    }

    // Restore
    coupon.isDeleted = false;
    coupon.deletedAt = null;
    await coupon.save();

    return NextResponse.json({
      message: 'Coupon restored successfully',
      coupon
    });
  } catch (error) {
    console.error('Error restoring coupon:', error);
    return NextResponse.json(
      { error: 'Failed to restore coupon', details: error.message },
      { status: 500 }
    );
  }
}
