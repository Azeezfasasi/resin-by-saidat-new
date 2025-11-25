import { NextResponse } from 'next/server';
import {
  getProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
  publishProduct,
  unpublishProduct,
  uploadProductImages,
  deleteProductImage,
  addProductReview,
  trackProductAnalytics,
  setBlackFridaySale,
  updateStock,
} from '@/app/server/controllers/productController.js';

/**
 * GET /api/product/[id]
 * Get a single product by ID
 */
export async function GET(req) {
  try {
    const response = await getProduct(req);
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/product/[id]
 * Update a product
 */
export async function PUT(req) {
  try {
    const response = await updateProduct(req);
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/product/[id]
 * Delete (soft delete) a product
 */
export async function DELETE(req) {
  try {
    const response = await deleteProduct(req);
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/product/[id]/restore
 * Restore a soft-deleted product
 */
export async function restoreProductRoute(req, { params }) {
  try {
    const mockReq = {
      params: { id: params.id },
      user: req.user,
    };

    const response = await restoreProduct(mockReq, NextResponse);
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/product/[id]/publish
 * Publish or schedule publish a product
 */
export async function publishProductRoute(req, { params }) {
  try {
    const body = await req.json();

    const mockReq = {
      params: { id: params.id },
      body,
      user: req.user,
    };

    const response = await publishProduct(mockReq, NextResponse);
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/product/[id]/unpublish
 * Unpublish a product
 */
export async function unpublishProductRoute(req, { params }) {
  try {
    const mockReq = {
      params: { id: params.id },
      user: req.user,
    };

    const response = await unpublishProduct(mockReq, NextResponse);
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/product/[id]/upload-images
 * Upload multiple product images
 */
export async function uploadImagesRoute(req, { params }) {
  try {
    // Note: This requires multer middleware configured for file uploads
    const mockReq = {
      params: { id: params.id },
      files: req.files, // From multer middleware
      user: req.user,
    };

    const response = await uploadProductImages(mockReq, NextResponse);
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/product/[id]/images/[publicId]
 * Delete a product image
 */
export async function deleteImageRoute(req, { params }) {
  try {
    const mockReq = {
      params: { id: params.id, imageId: params.imageId },
      user: req.user,
    };

    const response = await deleteProductImage(mockReq, NextResponse);
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/product/[id]/review
 * Add a review to a product
 */
export async function addReviewRoute(req, { params }) {
  try {
    const body = await req.json();

    const mockReq = {
      params: { id: params.id },
      body,
      user: req.user,
    };

    const response = await addProductReview(mockReq, NextResponse);
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/product/[id]/track
 * Track product analytics
 */
export async function trackAnalyticsRoute(req, { params }) {
  try {
    const body = await req.json();

    const mockReq = {
      params: { id: params.id },
      body,
      user: req.user,
    };

    const response = await trackProductAnalytics(mockReq, NextResponse);
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/product/[id]/black-friday
 * Set Black Friday sale
 */
export async function setBlackFridayRoute(req, { params }) {
  try {
    const body = await req.json();

    const mockReq = {
      params: { id: params.id },
      body,
      user: req.user,
    };

    const response = await setBlackFridaySale(mockReq, NextResponse);
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/product/[id]/stock
 * Update product stock
 */
export async function updateStockRoute(req, { params }) {
  try {
    const body = await req.json();

    const mockReq = {
      params: { id: params.id },
      body,
      user: req.user,
    };

    const response = await updateStock(mockReq, NextResponse);
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
