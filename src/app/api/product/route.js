import { NextResponse } from 'next/server';
import {
  createProduct,
  getProducts,
  getFeaturedProducts,
  getSalesProducts,
  getLowStockProducts,
} from '@/app/server/controllers/productController.js';

/**
 * POST /api/product
 * Create a new product
 */
export async function POST(req) {
  try {
    const res = await createProduct(req);
    return res;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/product
 * Get all products with filters and pagination
 */
export async function GET(req) {
  try {
    const response = await getProducts(req);
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/product?type=featured
 * Get featured products
 */
export async function getFeatured(req) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get('limit') || 10;

    const mockReq = {
      query: { limit },
    };

    const response = await getFeaturedProducts(mockReq, {});
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch featured products' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/product?type=sales
 * Get sale/discount products
 */
export async function getSales(req) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get('limit') || 20;

    const mockReq = {
      query: { limit },
    };

    const response = await getSalesProducts(mockReq, {});
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch sale products' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/product/admin/low-stock
 * Get products with low stock (Admin only)
 */
export async function getLowStock(req) {
  try {
    const mockReq = {
      user: req.user,
    };

    const response = await getLowStockProducts(mockReq, {});
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch low stock products' },
      { status: 500 }
    );
  }
}
