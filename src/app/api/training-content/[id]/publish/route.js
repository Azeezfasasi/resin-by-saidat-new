import { connectDB } from '@/utils/db';
import { NextResponse } from 'next/server';
import { publishTrainingContent } from '@/app/server/controllers/trainingContentController';

/**
 * PATCH /api/training-content/[id]/publish
 * Publish or unpublish training content
 */
export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const { publish } = body;

    if (publish === undefined) {
      return NextResponse.json(
        { success: false, error: 'publish field is required' },
        { status: 400 }
      );
    }

    const result = await publishTrainingContent(id, publish);

    return NextResponse.json(result, {
      status: result.statusCode || (result.success ? 200 : 404)
    });
  } catch (error) {
    console.error('Error in PATCH /api/training-content/[id]/publish:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
