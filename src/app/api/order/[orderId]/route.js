import { NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import Order from '@/app/server/models/Order';

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { orderId } = await params;

    const order = await Order.findById(orderId).lean();

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
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order', details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { orderId } = await params;
    const body = await request.json();

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        status: body.status || undefined,
        paymentStatus: body.paymentStatus || undefined,
        trackingInfo: body.trackingInfo || undefined,
        $push: {
          adminNotes: body.adminNote ? {
            text: body.adminNote,
            createdBy: 'Admin',
            createdAt: new Date()
          } : undefined
        }
      },
      { new: true }
    ).lean();

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
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order', details: error.message },
      { status: 500 }
    );
  }
}
