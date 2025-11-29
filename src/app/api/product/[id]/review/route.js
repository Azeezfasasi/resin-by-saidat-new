import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Product from '@/app/server/models/Product.js';
import { connectDB } from '@/utils/db';

/**
 * POST /api/product/[id]/review
 * Add a review to a product
 */
export async function POST(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await req.json();

    // Validate required fields
    if (!body.userName || !body.userEmail || !body.title || !body.comment || !body.rating) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Please provide all required fields: userName, userEmail, title, comment, rating' 
        },
        { status: 400 }
      );
    }

    // Validate rating is between 1 and 5
    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Rating must be between 1 and 5' 
        },
        { status: 400 }
      );
    }

    // Find product and add review
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    // Create review object
    const review = {
      userId: body.userId ? new mongoose.Types.ObjectId(body.userId) : new mongoose.Types.ObjectId(), // Generate new ObjectId if not provided
      userName: body.userName,
      userEmail: body.userEmail,
      title: body.title,
      comment: body.comment,
      rating: body.rating,
      verified: body.verified || false,
      createdAt: new Date(),
    };

    // Add review to product
    if (!product.reviews) {
      product.reviews = [];
    }

    product.reviews.push(review);
    await product.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Review added successfully',
        review: review,
        product: product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding review:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to add review', 
        error: error.message 
      },
      { status: 500 }
    );
  }
}
