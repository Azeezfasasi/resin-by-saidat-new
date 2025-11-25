import { connectDB } from '@/utils/db';
import Order from '@/app/server/models/Order';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const order = await Order.findById(id).select('adminNotes customerNotes');

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Combine both types of notes and sort by date
    const allNotes = [
      ...(order.adminNotes || []).map(n => ({ ...n.toObject(), type: 'internal' })),
      ...(order.customerNotes || []).map(n => ({ ...n.toObject(), type: 'customer' }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json({ notes: allNotes });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const { text, type } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: 'Note text is required' },
        { status: 400 }
      );
    }

    const noteData = {
      text: text.trim(),
      createdBy: 'Admin', // In production, get from authenticated user
      createdAt: new Date()
    };

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Add to appropriate notes array
    if (type === 'customer') {
      order.customerNotes = order.customerNotes || [];
      order.customerNotes.push(noteData);
    } else {
      order.adminNotes = order.adminNotes || [];
      order.adminNotes.push(noteData);
    }

    await order.save();

    return NextResponse.json({
      note: {
        ...noteData,
        type
      }
    });
  } catch (error) {
    console.error('Error adding note:', error);
    return NextResponse.json(
      { error: 'Failed to add note' },
      { status: 500 }
    );
  }
}
