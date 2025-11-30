import { connectDB } from '@/utils/db';
import Order from '@/app/server/models/Order';
import Coupon from '@/app/server/models/Coupon';
import { NextResponse } from 'next/server';
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from '@/app/server/utils/orderEmailService';

// Get list of orders with filtering, sorting, and pagination
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    // Build filter
    const filter = {};

    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customerInfo.firstName': { $regex: search, $options: 'i' } },
        { 'customerInfo.lastName': { $regex: search, $options: 'i' } },
        { 'customerInfo.email': { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      filter.status = status;
    }

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) {
        filter.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = toDate;
      }
    }

    // Build sort
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch orders
    const orders = await Order.find(filter)
      .populate('userId', 'firstName lastName email')
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const total = await Order.countDocuments(filter);

    return NextResponse.json({
      orders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders', details: error.message },
      { status: 500 }
    );
  }
}

// Create a new order
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    // Generate unique order number using the model's static method
    const orderNumber = await Order.generateOrderNumber();

    const order = await Order.create({
      ...body,
      orderNumber,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // If coupon code is used, increment its usage count
    if (body.couponCode) {
      try {
        await Coupon.findOneAndUpdate(
          { code: body.couponCode.toUpperCase() },
          { $inc: { currentUsage: 1 } },
          { new: true }
        );
      } catch (couponError) {
        console.error('Error updating coupon usage:', couponError);
        // Don't fail the order creation if coupon update fails
      }
    }

    // Convert to plain object to ensure serialization
    const orderData = order.toObject ? order.toObject() : order;

    // Send confirmation emails asynchronously (don't wait for them)
    try {
      // Send customer confirmation email
      sendOrderConfirmationEmail(orderData).catch((error) => {
        console.error('Failed to send customer confirmation email:', error);
      });

      // Send admin notification email
      sendAdminOrderNotification(orderData).catch((error) => {
        console.error('Failed to send admin notification email:', error);
      });
    } catch (emailError) {
      // Don't fail the order if email sending fails
      console.error('Error sending order emails:', emailError);
    }

    return NextResponse.json({ 
      success: true,
      order: orderData,
      orderNumber: orderData.orderNumber,
      message: 'Order created successfully. Confirmation email sent.'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order', details: error.message },
      { status: 500 }
    );
  }
}
