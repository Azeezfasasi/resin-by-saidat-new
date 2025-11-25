import { connectDB } from '@/utils/db';
import Order from '@/app/server/models/Order';
import {
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
  sendOrderShippedEmail
} from '@/lib/emailService';
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const { templateType } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const order = await Order.findById(id)
      .populate('userId', 'firstName lastName email')
      .lean();

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const customerEmail = order.customerInfo?.email || order.userId?.email;

    if (!customerEmail) {
      return NextResponse.json(
        { error: 'Customer email not found' },
        { status: 400 }
      );
    }

    let result;

    switch (templateType) {
      case 'confirmation':
        result = await sendOrderConfirmationEmail(order, customerEmail);
        break;

      case 'statusUpdate':
        result = await sendOrderStatusUpdateEmail(order, customerEmail, order.status);
        break;

      case 'shipped':
        result = await sendOrderShippedEmail(order, customerEmail, {
          carrier: order.trackingInfo?.carrier || 'Standard Shipping',
          trackingNumber: order.trackingInfo?.number || 'N/A',
          trackingUrl: order.trackingInfo?.url || '#',
          expectedDelivery: order.trackingInfo?.expectedDelivery || 'Coming soon'
        });
        break;

      case 'delivered':
        result = await sendOrderStatusUpdateEmail(order, customerEmail, 'delivered');
        break;

      case 'cancelled':
        result = await sendOrderStatusUpdateEmail(order, customerEmail, 'cancelled');
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid template type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `${templateType} email sent successfully`,
      ...result
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: error.message },
      { status: 500 }
    );
  }
}
