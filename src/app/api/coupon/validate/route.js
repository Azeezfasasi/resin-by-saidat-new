import { connectDB } from '@/utils/db';
import Coupon from '@/app/server/models/Coupon';
import { NextResponse } from 'next/server';

/**
 * POST /api/coupon/validate
 * Validate a coupon for an order
 */
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { code, orderSubtotal } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    // Find coupon by code
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(), 
      isDeleted: false 
    });

    if (!coupon) {
      return NextResponse.json(
        { valid: false, error: 'Coupon not found' },
        { status: 404 }
      );
    }

    // Check if coupon is active and within validity period
    const now = new Date();
    if (!coupon.isActive) {
      return NextResponse.json(
        { valid: false, error: 'Coupon is inactive' },
        { status: 400 }
      );
    }

    if (coupon.startDate > now) {
      return NextResponse.json(
        { valid: false, error: 'Coupon is not yet valid' },
        { status: 400 }
      );
    }

    if (coupon.endDate < now) {
      return NextResponse.json(
        { valid: false, error: 'Coupon has expired' },
        { status: 400 }
      );
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.currentUsage >= coupon.usageLimit) {
      return NextResponse.json(
        { valid: false, error: 'Coupon usage limit reached' },
        { status: 400 }
      );
    }

    // Check minimum order amount
    if (orderSubtotal < coupon.minOrderAmount) {
      return NextResponse.json(
        { 
          valid: false, 
          error: `Minimum order amount ₦${coupon.minOrderAmount} required` 
        },
        { status: 400 }
      );
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (orderSubtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount) {
        discount = Math.min(discount, coupon.maxDiscountAmount);
      }
    } else {
      discount = Math.min(coupon.discountValue, orderSubtotal);
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon._id,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discount: Math.round(discount * 100) / 100
      }
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json(
      { valid: false, error: 'Error validating coupon', details: error.message },
      { status: 500 }
    );
  }
}
