import { connectDB } from '@/utils/db';
import Category from '@/app/server/models/Category';
import Product from '@/app/server/models/Product';
import { NextResponse } from 'next/server';
import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * GET /api/category
 * Get all categories with filtering and pagination
 */
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const parentId = searchParams.get('parentId');
    const isActive = searchParams.get('isActive');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { isDeleted: false };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (parentId && parentId !== 'null') {
      filter.parentId = parentId;
    }

    if (isActive !== null && isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    // Fetch categories
    const categories = await Category.find(filter)
      .populate('parentId', 'name slug')
      .sort({ displayOrder: 1, name: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const total = await Category.countDocuments(filter);

    // Get product count for each category
    const categoriesWithProductCount = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({
          category: category.name,
          isDeleted: false
        });
        return { ...category, productCount };
      })
    );

    return NextResponse.json({
      categories: categoriesWithProductCount,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/category
 * Create a new category
 */
export async function POST(request) {
  try {
    await connectDB();

    const formData = await request.formData();
    const name = formData.get('name');
    const description = formData.get('description');
    const parentId = formData.get('parentId') || null;
    const displayOrder = formData.get('displayOrder') || 0;
    const metaTitle = formData.get('metaTitle');
    const metaDescription = formData.get('metaDescription');
    const metaKeywords = formData.get('metaKeywords')
      ? JSON.parse(formData.get('metaKeywords'))
      : [];

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name, isDeleted: false });
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 409 }
      );
    }

    // Handle image upload
    let image = null;
    const imageFile = formData.get('image');

    if (imageFile && imageFile.size > 0) {
      try {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.v2.uploader.upload_stream(
            {
              folder: 'rayob/categories',
              resource_type: 'auto',
              allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp']
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(buffer);
        });

        image = {
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id
        };
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload category image', details: uploadError.message },
          { status: 400 }
        );
      }
    }

    // Create category
    const category = await Category.create({
      name,
      description,
      parentId: parentId === 'null' || !parentId ? null : parentId,
      displayOrder: parseInt(displayOrder),
      image,
      metaTitle,
      metaDescription,
      metaKeywords,
      isActive: true
    });

    const populatedCategory = await category.populate('parentId', 'name slug');

    return NextResponse.json({ category: populatedCategory }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category', details: error.message },
      { status: 500 }
    );
  }
}
