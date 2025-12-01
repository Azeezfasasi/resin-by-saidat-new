import { NextResponse } from 'next/server';
import { restoreProduct } from '@/app/server/controllers/productController.js';

/**
 * POST /api/product/[id]/restore
 * Restore a soft-deleted product
 */
export async function POST(req, { params }) {
  try {
    const awaitedParams = await params;
    const response = await restoreProduct(req, awaitedParams);
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
