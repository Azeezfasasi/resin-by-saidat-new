import { connectDB } from '@/utils/db';
import {
  getRegistrationById,
  updateRegistration,
  deleteRegistration,
  updateRegistrationStatus,
  updatePaymentStatus,
  confirmRegistration,
} from '@/app/server/controllers/trainingController';

// GET: Fetch single registration
export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const result = await getRegistrationById(id);

    if (!result.success) {
      return Response.json(
        { message: result.error },
        { status: result.statusCode || 500 }
      );
    }

    return Response.json(result, { status: 200 });
  } catch (error) {
    console.error('Error fetching registration:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT: Update registration
export async function PUT(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const { action, ...updateData } = await req.json();

    let result;

    // Handle different action types
    if (action === 'status') {
      result = await updateRegistrationStatus(id, updateData.status);
    } else if (action === 'payment') {
      result = await updatePaymentStatus(
        id,
        updateData.paymentStatus,
        updateData.paymentAmount
      );
    } else if (action === 'confirm') {
      result = await confirmRegistration(id);
    } else {
      // Default: update registration details
      result = await updateRegistration(id, updateData);
    }

    if (!result.success) {
      return Response.json(
        { message: result.error },
        { status: result.statusCode || 500 }
      );
    }

    return Response.json(result, { status: 200 });
  } catch (error) {
    console.error('Error updating registration:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: Delete registration (soft delete)
export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const result = await deleteRegistration(id);

    if (!result.success) {
      return Response.json(
        { message: result.error },
        { status: result.statusCode || 500 }
      );
    }

    return Response.json(result, { status: 200 });
  } catch (error) {
    console.error('Error deleting registration:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
