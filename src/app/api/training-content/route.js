import { connectDB } from '@/utils/db';
import { NextResponse } from 'next/server';
import {
  getAllTrainingContent,
  getTrainingContentById,
  createTrainingContent,
  updateTrainingContent,
  deleteTrainingContent,
  publishTrainingContent
} from '@/app/server/controllers/trainingContentController';

/**
 * GET /api/training-content
 * Get all training content (admin) or active content (public)
 */
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'admin'; // 'admin' or 'public'
    const id = searchParams.get('id');

    if (id) {
      const result = await getTrainingContentById(id);
      return NextResponse.json(result, {
        status: result.statusCode || (result.success ? 200 : 404)
      });
    }

    const result = await getAllTrainingContent();

    return NextResponse.json(result, {
      status: result.success ? 200 : 500
    });
  } catch (error) {
    console.error('Error in GET /api/training-content:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/training-content
 * Create new training content
 */
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const userId = request.headers.get('x-user-id'); // Should come from auth middleware

    // Validate required fields
    if (!body.duration || !body.classSize || !body.nextSession || !body.pricing) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await createTrainingContent(body, userId);

    return NextResponse.json(result, {
      status: result.statusCode || (result.success ? 201 : 400)
    });
  } catch (error) {
    console.error('Error in POST /api/training-content:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/training-content
 * Update training content
 */
export async function PUT(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { id } = body;
    const userId = request.headers.get('x-user-id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Training content ID is required' },
        { status: 400 }
      );
    }

    const result = await updateTrainingContent(id, body, userId);

    return NextResponse.json(result, {
      status: result.statusCode || (result.success ? 200 : 404)
    });
  } catch (error) {
    console.error('Error in PUT /api/training-content:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/training-content
 * Delete training content
 */
export async function DELETE(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Training content ID is required' },
        { status: 400 }
      );
    }

    const result = await deleteTrainingContent(id);

    return NextResponse.json(result, {
      status: result.statusCode || (result.success ? 200 : 404)
    });
  } catch (error) {
    console.error('Error in DELETE /api/training-content:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
