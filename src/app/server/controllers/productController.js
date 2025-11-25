import Product from '../models/Product.js';
import { v2 as cloudinary } from 'cloudinary';
import { connectDB } from '../../server/db/connect.js';
import { NextResponse } from 'next/server';
import { Buffer } from 'buffer';
import mongoose from 'mongoose';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * CREATE PRODUCT
 * POST /api/product
 */
export const createProduct = async (req) => {
  try {
    await connectDB();

    // Parse FormData
    const formData = await req.formData();
    
    // Extract fields from FormData
    const name = formData.get('name');
    const description = formData.get('description');
    const shortDescription = formData.get('shortDescription');
    const category = formData.get('category');
    const subcategory = formData.get('subcategory');
    const brand = formData.get('brand');
    const basePrice = formData.get('basePrice');
    const salePrice = formData.get('salePrice');
    const discountPercent = formData.get('discountPercent');
    const stock = formData.get('stock');
    const lowStockThreshold = formData.get('lowStockThreshold');
    const sku = formData.get('sku');
    const barcode = formData.get('barcode');
    const slug = formData.get('slug');
    const metaTitle = formData.get('metaTitle');
    const metaDescription = formData.get('metaDescription');
    const featured = formData.get('featured') === 'true';
    const status = formData.get('status') || 'draft';
    
    // Parse JSON fields
    const attributes = formData.get('attributes') ? JSON.parse(formData.get('attributes')) : [];
    let deliveryLocations = formData.get('deliveryLocations') ? JSON.parse(formData.get('deliveryLocations')) : [];
    const weight = formData.get('weight') ? JSON.parse(formData.get('weight')) : {};
    const dimensions = formData.get('dimensions') ? JSON.parse(formData.get('dimensions')) : {};
    const metaKeywords = formData.get('metaKeywords') ? JSON.parse(formData.get('metaKeywords')) : [];

    // Validate required fields
    if (!name || !description || !category || !basePrice || stock === undefined) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: name, description, category, basePrice, and stock are required',
      }, { status: 400 });
    }

    // Check if product with same name exists
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return NextResponse.json({
        success: false,
        message: 'Product with this name already exists',
      }, { status: 409 });
    }

    // Handle image uploads
    let images = [];
    const imageFiles = formData.getAll('images');
    
    if (imageFiles && imageFiles.length > 0) {
      for (const file of imageFiles) {
        if (file instanceof File && file.size > 0) {
          try {
            const buffer = await file.arrayBuffer();
            const result = await cloudinary.uploader.upload(
              `data:${file.type};base64,${Buffer.from(buffer).toString('base64')}`,
              {
                folder: 'products',
                resource_type: 'auto',
              }
            );
            images.push({
              url: result.secure_url,
              publicId: result.public_id,
              alt: name,
            });
          } catch (uploadError) {
            console.error('Image upload error:', uploadError);
          }
        }
      }
    }

    // Clean up delivery locations - remove empty ones and ensure numeric fields
    deliveryLocations = deliveryLocations.filter(loc => {
      return loc.locationName && loc.locationName.trim();
    }).map(loc => ({
      ...loc,
      // Ensure numeric fields are numbers, not strings
      shippingCost: typeof loc.shippingCost === 'string' ? parseFloat(loc.shippingCost) : loc.shippingCost,
      estimatedDays: typeof loc.estimatedDays === 'string' ? parseInt(loc.estimatedDays, 10) : loc.estimatedDays,
    }));

    // Build product object with only valid fields
    const productData = {
      name,
      slug,
      description,
      shortDescription,
      category: category ? category.trim() : null,
      subcategory: subcategory ? subcategory.trim() : undefined,
      brand,
      basePrice: parseFloat(basePrice),
      stock: parseInt(stock),
      lowStockThreshold: lowStockThreshold ? parseInt(lowStockThreshold) : 10,
      sku: sku ? sku.trim() : undefined,
      barcode: barcode ? barcode.trim() : undefined,
      attributes,
      deliveryLocations,
      weight,
      dimensions,
      images,
      featured,
      metaTitle: metaTitle || undefined,
      metaDescription: metaDescription || undefined,
      metaKeywords,
      status,
      // createdBy is optional - only set if user is authenticated
      ...(req.user?.id && { createdBy: req.user.id }),
    };

    // Only add salePrice if provided
    if (salePrice) {
      productData.salePrice = parseFloat(salePrice);
    }

    // Only add discountPercent if provided
    if (discountPercent) {
      productData.discountPercent = parseInt(discountPercent);
    }

    const newProduct = new Product(productData);

    await newProduct.save();

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product: newProduct,
    }, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create product',
      error: error.message,
    }, { status: 500 });
  }
};

/**
 * GET SINGLE PRODUCT
 * GET /api/product/[id]
 */
/**
 * GET SINGLE PRODUCT
 * GET /api/product/[id]
 */
export const getProduct = async (req) => {
  try {
    await connectDB();

    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const id = pathSegments[pathSegments.length - 1];

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Product ID is required',
      }, { status: 400 });
    }

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({
        success: false,
        message: 'Product not found',
      }, { status: 404 });
    }

    // Check if product is deleted (only show if requester is admin or it's published)
    if (product.isDeleted) {
      return NextResponse.json({
        success: false,
        message: 'Product not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      product: product,
    }, { status: 200 });
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message,
    }, { status: 500 });
  }
};

/**
 * GET ALL PRODUCTS
 * GET /api/product
 * Query params: page, limit, category, featured, status, sortBy
 */
export const getProducts = async (req) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    
    const page = searchParams.get('page') || 1;
    const limit = searchParams.get('limit') || 20;
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const status = searchParams.get('status') || 'published';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter = { isDeleted: false };

    // Only show published products for non-admin users
    if (status) {
      filter.status = status;
    }

    if (category) {
      filter.category = category;
    }

    if (featured === 'true') {
      filter.featured = true;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
      ];
    }

    if (minPrice || maxPrice) {
      filter.basePrice = {};
      if (minPrice) filter.basePrice.$gte = parseFloat(minPrice);
      if (maxPrice) filter.basePrice.$lte = parseFloat(maxPrice);
    }

    // Build sort
    let sortObj = {};
    if (sortBy === 'price-asc') {
      sortObj = { basePrice: 1 };
    } else if (sortBy === 'price-desc') {
      sortObj = { basePrice: -1 };
    } else if (sortBy === 'rating') {
      sortObj = { averageRating: -1 };
    } else if (sortBy === 'newest') {
      sortObj = { createdAt: -1 };
    } else if (sortBy === 'popular') {
      sortObj = { 'analytics.views': -1 };
    } else {
      sortObj = { [sortBy]: -1 };
    }

    const totalProducts = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .select('-reviews'); // Exclude reviews for list view to reduce payload

    return NextResponse.json({
      success: true,
      products: products,
      pagination: {
        current: pageNum,
        limit: limitNum,
        total: totalProducts,
        pages: Math.ceil(totalProducts / limitNum),
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message,
    }, { status: 500 });
  }
};

/**
 * UPDATE PRODUCT
 * PUT /api/product/[id]
 */
export const updateProduct = async (req) => {
  try {
    await connectDB();

    // Extract ID from URL - /api/product/[id]
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/').filter(Boolean); // filter out empty strings
    const id = pathSegments[pathSegments.length - 1]; // Get the last segment (the ID)

    const formData = await req.formData();

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Product ID is required',
      }, { status: 400 });
    }

    // Parse form data
    const updates = {};
    for (const [key, value] of formData) {
      if (key === 'images' || key === 'attributes' || key === 'deliveryLocations' || key === 'weight' || key === 'dimensions') {
        try {
          if (value instanceof File) continue; // Skip file objects
          updates[key] = JSON.parse(value);
        } catch {
          updates[key] = value;
        }
      } else if (value instanceof File) {
        continue; // Skip file uploads for now
      } else {
        updates[key] = value;
      }
    }

    // Ensure attributes and deliveryLocations have IDs for React keys
    if (updates.attributes && Array.isArray(updates.attributes)) {
      updates.attributes = updates.attributes.map((attr, idx) => ({
        ...attr,
        id: attr.id || `attr-${Date.now()}-${idx}`,
      }));
    }
    if (updates.deliveryLocations && Array.isArray(updates.deliveryLocations)) {
      updates.deliveryLocations = updates.deliveryLocations.map((loc, idx) => ({
        ...loc,
        id: loc.id || `loc-${Date.now()}-${idx}`,
        // Ensure numeric fields are numbers, not strings
        shippingCost: typeof loc.shippingCost === 'string' ? parseFloat(loc.shippingCost) : loc.shippingCost,
        estimatedDays: typeof loc.estimatedDays === 'string' ? parseInt(loc.estimatedDays, 10) : loc.estimatedDays,
      }));
    }

    // Prevent updating certain fields
    delete updates.createdBy;
    delete updates.createdAt;
    delete updates.slug;

    // Add updatedBy
    if (req.user?.id) {
      updates.updatedBy = req.user.id;
    }

    const product = await Product.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!product) {
      return NextResponse.json({
        success: false,
        message: 'Product not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: product,
    }, { status: 200 });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update product',
      error: error.message,
    }, { status: 500 });
  }
};

/**
 * DELETE/ARCHIVE PRODUCT (Soft Delete)
 * DELETE /api/product/[id]
 */
export const deleteProduct = async (req) => {
  try {
    await connectDB();

    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const id = pathSegments[pathSegments.length - 1];

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Product ID is required',
      }, { status: 400 });
    }

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({
        success: false,
        message: 'Product not found',
      }, { status: 404 });
    }

    // Soft delete
    product.isDeleted = true;
    product.deletedAt = new Date();
    await product.save();

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
      product: product,
    }, { status: 200 });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete product',
      error: error.message,
    }, { status: 500 });
  }
};

/**
 * RESTORE PRODUCT (Undo Soft Delete)
 * POST /api/product/[id]/restore
 */
export const restoreProduct = async (req) => {
  try {
    await connectDB();

    const url = new URL(req.url);
    const id = url.pathname.split('/')[4]; // /api/product/[id]/restore

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Product ID is required',
      }, { status: 400 });
    }

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({
        success: false,
        message: 'Product not found',
      }, { status: 404 });
    }

    // Restore
    product.isDeleted = false;
    product.deletedAt = null;
    await product.save();

    return NextResponse.json({
      success: true,
      message: 'Product restored successfully',
      product: product,
    }, { status: 200 });
  } catch (error) {
    console.error('Restore product error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to restore product',
      error: error.message,
    }, { status: 500 });
  }
};

/**
 * PUBLISH PRODUCT
 * POST /api/product/[id]/publish
 */
export const publishProduct = async (req, res) => {
  try {
    await connectDB();

    const { id } = req.params;
    const { scheduledDate } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await product.publish(scheduledDate ? new Date(scheduledDate) : null);

    return res.status(200).json({
      success: true,
      message: `Product ${scheduledDate ? 'scheduled' : 'published'} successfully`,
      data: product,
    });
  } catch (error) {
    console.error('Publish product error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to publish product',
      error: error.message,
    });
  }
};

/**
 * UNPUBLISH PRODUCT
 * POST /api/product/[id]/unpublish
 */
export const unpublishProduct = async (req, res) => {
  try {
    await connectDB();

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await product.unpublish();

    return res.status(200).json({
      success: true,
      message: 'Product unpublished successfully',
      data: product,
    });
  } catch (error) {
    console.error('Unpublish product error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to unpublish product',
      error: error.message,
    });
  }
};

/**
 * UPLOAD PRODUCT IMAGES
 * POST /api/product/[id]/upload-images
 */
export const uploadProductImages = async (req, res) => {
  try {
    await connectDB();

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files provided',
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const uploadedImages = [];

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: `products/${id}`,
        resource_type: 'auto',
      });

      const imageData = {
        url: result.secure_url,
        publicId: result.public_id,
        alt: `${product.name} - Image`,
      };

      product.images.push(imageData);
      uploadedImages.push(imageData);

      // Set first image as thumbnail
      if (!product.thumbnail) {
        product.thumbnail = result.secure_url;
      }
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      data: {
        product,
        uploadedImages,
      },
    });
  } catch (error) {
    console.error('Upload images error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: error.message,
    });
  }
};

/**
 * DELETE PRODUCT IMAGE
 * DELETE /api/product/[id]/images/[publicId]
 */
export const deleteProductImage = async (req, res) => {
  try {
    await connectDB();

    const { id, imageId } = req.params;

    if (!id || !imageId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and Image ID are required',
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const imageIndex = product.images.findIndex(img => img.publicId === imageId);

    if (imageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Image not found',
      });
    }

    const image = product.images[imageIndex];

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(image.publicId);

    // Remove from product
    product.images.splice(imageIndex, 1);

    // Update thumbnail if deleted image was thumbnail
    if (product.thumbnail === image.url) {
      product.thumbnail = product.images.length > 0 ? product.images[0].url : null;
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      data: product,
    });
  } catch (error) {
    console.error('Delete image error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message,
    });
  }
};

/**
 * ADD PRODUCT REVIEW
 * POST /api/product/[id]/review
 */
export const addProductReview = async (req, res) => {
  try {
    await connectDB();

    const { id } = req.params;
    const { userId, userName, userEmail, rating, title, comment, verified } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    if (!rating || !title || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Rating, title, and comment are required',
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await product.addReview({
      userId,
      userName,
      userEmail,
      rating: parseInt(rating),
      title,
      comment,
      verified: verified || false,
    });

    return res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: product,
    });
  } catch (error) {
    console.error('Add review error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add review',
      error: error.message,
    });
  }
};

/**
 * GET FEATURED PRODUCTS
 * GET /api/product/featured
 */
export const getFeaturedProducts = async (req, res) => {
  try {
    await connectDB();

    const limit = parseInt(req.query.limit) || 10;

    const products = await Product.getFeaturedProducts(limit);

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch featured products',
      error: error.message,
    });
  }
};

/**
 * GET SALE/DISCOUNT PRODUCTS
 * GET /api/product/sales
 */
export const getSalesProducts = async (req, res) => {
  try {
    await connectDB();

    const limit = parseInt(req.query.limit) || 20;

    const products = await Product.getSalesProducts(limit);

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Get sales products error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch sales products',
      error: error.message,
    });
  }
};

/**
 * GET LOW STOCK PRODUCTS (Admin only)
 * GET /api/product/admin/low-stock
 */
export const getLowStockProducts = async (req, res) => {
  try {
    await connectDB();

    const products = await Product.getLowStockProducts();

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Get low stock products error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch low stock products',
      error: error.message,
    });
  }
};

/**
 * TRACK PRODUCT ANALYTICS
 * POST /api/product/[id]/track
 */
export const trackProductAnalytics = async (req, res) => {
  try {
    await connectDB();

    const { id } = req.params;
    const { action } = req.body; // 'view', 'click', 'add-to-cart', 'purchase'

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    switch (action) {
      case 'view':
        await product.trackView();
        break;
      case 'click':
        await product.trackClick();
        break;
      case 'add-to-cart':
        await product.trackAddToCart();
        break;
      case 'purchase':
        await product.trackPurchase();
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action',
        });
    }

    return res.status(200).json({
      success: true,
      message: 'Analytics tracked successfully',
      data: product.analytics,
    });
  } catch (error) {
    console.error('Track analytics error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to track analytics',
      error: error.message,
    });
  }
};

/**
 * SET BLACK FRIDAY SALE
 * POST /api/product/[id]/black-friday
 */
export const setBlackFridaySale = async (req, res) => {
  try {
    await connectDB();

    const { id } = req.params;
    const { blackFridayPrice, startDate, endDate, active } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    product.blackFridayPrice = blackFridayPrice;
    product.blackFridayStartDate = new Date(startDate);
    product.blackFridayEndDate = new Date(endDate);
    product.blackFridayActive = active || false;

    await product.save();

    return res.status(200).json({
      success: true,
      message: 'Black Friday sale configured successfully',
      data: product,
    });
  } catch (error) {
    console.error('Set Black Friday error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to set Black Friday sale',
      error: error.message,
    });
  }
};

/**
 * UPDATE STOCK
 * PATCH /api/product/[id]/stock
 */
export const updateStock = async (req, res) => {
  try {
    await connectDB();

    const { id } = req.params;
    const { quantity, operation = 'set' } = req.body; // set, add, subtract

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    if (quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Quantity is required',
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (operation === 'set') {
      product.stock = quantity;
    } else if (operation === 'add') {
      product.stock += quantity;
    } else if (operation === 'subtract') {
      product.stock = Math.max(0, product.stock - quantity);
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      data: {
        productId: product._id,
        stock: product.stock,
        stockStatus: product.stockStatus,
      },
    });
  } catch (error) {
    console.error('Update stock error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update stock',
      error: error.message,
    });
  }
};
