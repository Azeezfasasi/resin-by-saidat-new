import { NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import Order from '@/app/server/models/Order';
import { sendOrderStatusUpdateEmail, sendAdminStatusUpdateNotification } from '@/app/server/utils/orderEmailService';

// Get a specific order by ID
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

// Update order status, payment status, tracking info, and add admin notes
export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { orderId } = await params;
    const body = await request.json();

    // Fetch the current order to track what changed
    const currentOrder = await Order.findById(orderId).lean();
    if (!currentOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Prepare update object
    const updateData = {};
    const changeDetails = {
      orderStatusChanged: false,
      paymentStatusChanged: false,
      trackingInfoAdded: false,
      adminNoteAdded: false,
      previousOrderStatus: currentOrder.status,
      previousPaymentStatus: currentOrder.paymentStatus,
    };

    // Check what's being updated
    if (body.status && body.status !== currentOrder.status) {
      updateData.status = body.status;
      changeDetails.orderStatusChanged = true;
    }

    if (body.paymentStatus && body.paymentStatus !== currentOrder.paymentStatus) {
      updateData.paymentStatus = body.paymentStatus;
      changeDetails.paymentStatusChanged = true;
    }

    if (body.trackingInfo && !currentOrder.trackingInfo?.number) {
      updateData.trackingInfo = body.trackingInfo;
      changeDetails.trackingInfoAdded = true;
    } else if (body.trackingInfo) {
      updateData.trackingInfo = { ...currentOrder.trackingInfo, ...body.trackingInfo };
    }

    // Add admin note if provided
    if (body.adminNote) {
      updateData.$push = {
        adminNotes: {
          text: body.adminNote,
          createdBy: 'Admin',
          createdAt: new Date()
        }
      };
      changeDetails.adminNoteAdded = true;
    }

    // Update the order
    const order = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    ).lean();

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Send emails asynchronously (don't wait for them)
    try {
      // Check if any significant changes were made
      if (
        changeDetails.orderStatusChanged ||
        changeDetails.paymentStatusChanged ||
        changeDetails.trackingInfoAdded ||
        changeDetails.adminNoteAdded
      ) {
        // Send customer status update email only if order status or tracking info changed
        if (changeDetails.orderStatusChanged || changeDetails.trackingInfoAdded) {
          sendOrderStatusUpdateEmail(order, changeDetails.previousOrderStatus).catch((error) => {
            console.error('Failed to send customer status update email:', error);
          });
        }

        // Send admin notification email
        sendAdminStatusUpdateNotification(order, changeDetails).catch((error) => {
          console.error('Failed to send admin status update notification:', error);
        });
      }
    } catch (emailError) {
      // Don't fail the order update if email sending fails
      console.error('Error sending order update emails:', emailError);
    }

    return NextResponse.json({
      success: true,
      order,
      message: 'Order updated successfully. Notification emails sent.'
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order', details: error.message },
      { status: 500 }
    );
  }
}
