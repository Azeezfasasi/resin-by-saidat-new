import { connectDB } from '@/utils/db';
import Category from '@/app/server/models/Category';
import { NextResponse } from 'next/server';
import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * GET /api/category/[id]
 * Get a single category by ID
 */
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const category = await Category.findById(id)
      .populate('parentId', 'name slug')
      .populate('subcategories');

    if (!category || category.isDeleted) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ category });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/category/[id]
 * Update a category
 */
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const formData = await request.formData();
    const name = formData.get('name');
    const description = formData.get('description');
    const parentId = formData.get('parentId');
    const displayOrder = formData.get('displayOrder');
    const isActive = formData.get('isActive');
    const metaTitle = formData.get('metaTitle');
    const metaDescription = formData.get('metaDescription');
    const metaKeywords = formData.get('metaKeywords')
      ? JSON.parse(formData.get('metaKeywords'))
      : [];

    // Find category
    const category = await Category.findById(id);
    if (!category || category.isDeleted) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if name is being changed and if it already exists
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ name, isDeleted: false, _id: { $ne: id } });
      if (existingCategory) {
        return NextResponse.json(
          { error: 'Category with this name already exists' },
          { status: 409 }
        );
      }
      category.name = name;
    }

    // Update fields
    if (description !== undefined && description !== null) category.description = description;
    if (displayOrder !== undefined && displayOrder !== null) category.displayOrder = parseInt(displayOrder);
    if (isActive !== undefined && isActive !== null) category.isActive = isActive === 'true';
    if (metaTitle) category.metaTitle = metaTitle;
    if (metaDescription) category.metaDescription = metaDescription;
    if (metaKeywords) category.metaKeywords = metaKeywords;

    // Handle parent change
    if (parentId !== undefined) {
      if (parentId === 'null' || !parentId) {
        category.parentId = null;
      } else {
        // Check if parent exists
        const parentCategory = await Category.findById(parentId);
        if (!parentCategory || parentCategory.isDeleted) {
          return NextResponse.json(
            { error: 'Parent category not found' },
            { status: 404 }
          );
        }
        category.parentId = parentId;
      }
    }

    // Handle image upload
    const imageFile = formData.get('image');
    if (imageFile && imageFile.size > 0) {
      // Delete old image if exists
      if (category.image?.publicId) {
        try {
          await cloudinary.v2.uploader.destroy(category.image.publicId);
        } catch (deleteError) {
          console.warn('Failed to delete old image:', deleteError);
        }
      }

      // Upload new image
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

        category.image = {
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

    await category.save();
    const populatedCategory = await category.populate('parentId', 'name slug');

    return NextResponse.json({ category: populatedCategory });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/category/[id]
 * Soft delete a category
 */
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const category = await Category.findById(id);
    if (!category || category.isDeleted) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Soft delete
    category.isDeleted = true;
    category.deletedAt = new Date();
    await category.save();

    return NextResponse.json({
      message: 'Category deleted successfully',
      category
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/category/[id]/restore
 * Restore a deleted category
 */
export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Restore
    category.isDeleted = false;
    category.deletedAt = null;
    await category.save();

    return NextResponse.json({
      message: 'Category restored successfully',
      category
    });
  } catch (error) {
    console.error('Error restoring category:', error);
    return NextResponse.json(
      { error: 'Failed to restore category', details: error.message },
      { status: 500 }
    );
  }
}
