import { NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import Order from '@/app/server/models/Order';

// Track order by order number and email
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get('orderNumber');
    const email = searchParams.get('email');

    if (!orderNumber || !email) {
      return NextResponse.json(
        { error: 'Order number and email are required' },
        { status: 400 }
      );
    }

    // Find order by order number and email
    const order = await Order.findOne({
      orderNumber: orderNumber.toUpperCase(),
      'customerInfo.email': email.toLowerCase()
    }).lean();

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order
    }, { status: 200 });
  } catch (error) {
    console.error('Error tracking order:', error);
    return NextResponse.json(
      { error: 'Failed to track order', details: error.message },
      { status: 500 }
    );
  }
}
