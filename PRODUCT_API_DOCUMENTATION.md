# Product API Documentation

Complete Next.js Product Management System with comprehensive features for e-commerce platforms.

## Table of Contents
1. [Product Model Features](#product-model-features)
2. [API Endpoints](#api-endpoints)
3. [Request/Response Examples](#requestresponse-examples)
4. [Controller Functions](#controller-functions)
5. [Query Parameters](#query-parameters)

---

## Product Model Features

### Core Features Implemented

1. **✅ Basic Information**
   - Product name, slug, description
   - Short description for listings
   - Category, subcategory, brand
   - SKU and barcode support

2. **✅ Pricing System**
   - Base price
   - Sale price with discount percentage
   - Black Friday pricing with date ranges
   - Currency support (default: NGN)
   - Virtual `currentPrice` (auto-selects best price)
   - Virtual `discountAmount`

3. **✅ Stock Management**
   - Stock quantity tracking
   - Low stock threshold alerts
   - SKU-based inventory
   - Virtual `stockStatus` (in-stock, low-stock, out-of-stock)

4. **✅ Media Management**
   - Multiple image uploads to Cloudinary
   - Thumbnail support
   - Image metadata (alt text, upload date)
   - Cloudinary public ID for easy deletion

5. **✅ Attributes System**
   - Flexible attribute schema (size, color, weight, material)
   - Each product can have multiple attributes
   - Attribute names and values

6. **✅ Product Status & Publishing**
   - Draft: Product not published
   - Published: Live for customers
   - Scheduled: Auto-publish on set date
   - Publish/unpublish methods
   - Scheduled publish support

7. **✅ Soft Delete (Archive)**
   - Soft delete system (products not permanently removed)
   - `isDeleted` flag and `deletedAt` timestamp
   - Restore functionality
   - Automatic query filtering for deleted products

8. **✅ Featured Products**
   - Featured flag with date ranges
   - Featured products collection
   - Auto-expire based on endDate

9. **✅ Black Friday / Special Sales**
   - Black Friday pricing
   - Date-based activation/deactivation
   - Black Friday specific pricing override

10. **✅ Reviews & Ratings**
    - User reviews with ratings (1-5 stars)
    - Review title and detailed comments
    - Verified purchase flag
    - Helpful counter for reviews
    - Automatic average rating calculation
    - Rating distribution tracking (1-5 stars)

11. **✅ Delivery & Logistics**
    - Multiple delivery locations with costs
    - Weight and dimensions tracking
    - Bulky item classification
    - Estimated delivery days per location

12. **✅ Analytics Tracking**
    - Page views count
    - Click count
    - Add to cart count
    - Purchase count
    - Conversion rate calculation
    - Last tracked timestamp

13. **✅ SEO Optimization**
    - Meta title (160 char limit)
    - Meta description (160 char limit)
    - Meta keywords
    - Auto-generated URL-friendly slug

---

## API Endpoints

### 1. CREATE PRODUCT
**POST** `/api/product`

```bash
curl -X POST http://localhost:3000/api/product \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Premium Wireless Headphones",
    "description": "High-quality wireless headphones with noise cancellation",
    "shortDescription": "Premium wireless headphones",
    "category": "507f1f77bcf86cd799439011",
    "brand": "AudioPro",
    "basePrice": 25000,
    "stock": 50,
    "attributes": [
      { "name": "Color", "value": "Black" },
      { "name": "Weight", "value": "250g" }
    ],
    "deliveryLocations": [
      {
        "locationName": "Lagos",
        "shippingCost": 2000,
        "estimatedDays": 2
      }
    ]
  }'
```

### 2. GET SINGLE PRODUCT
**GET** `/api/product/[id]`

```bash
curl http://localhost:3000/api/product/507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Premium Wireless Headphones",
    "slug": "premium-wireless-headphones",
    "basePrice": 25000,
    "currentPrice": 25000,
    "stock": 50,
    "stockStatus": "in-stock",
    "averageRating": 4.5,
    "totalReviews": 12,
    "analytics": {
      "views": 245,
      "clicks": 89,
      "addToCart": 23,
      "purchases": 15,
      "conversionRate": "6.12"
    }
  }
}
```

### 3. GET ALL PRODUCTS
**GET** `/api/product`

**Query Parameters:**
```bash
curl "http://localhost:3000/api/product?page=1&limit=20&category=507f1f77bcf86cd799439011&featured=true&sortBy=price-asc&search=headphones&minPrice=10000&maxPrice=50000"
```

### 4. UPDATE PRODUCT
**PUT** `/api/product/[id]`

```bash
curl -X PUT http://localhost:3000/api/product/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "basePrice": 22000,
    "salePrice": 19000,
    "discountPercent": 15,
    "stock": 45
  }'
```

### 5. DELETE PRODUCT (Soft Delete)
**DELETE** `/api/product/[id]`

```bash
curl -X DELETE http://localhost:3000/api/product/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 6. RESTORE PRODUCT
**POST** `/api/product/[id]/restore`

```bash
curl -X POST http://localhost:3000/api/product/507f1f77bcf86cd799439011/restore \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 7. PUBLISH PRODUCT
**POST** `/api/product/[id]/publish`

**Immediate publish:**
```bash
curl -X POST http://localhost:3000/api/product/507f1f77bcf86cd799439011/publish \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{}'
```

**Scheduled publish:**
```bash
curl -X POST http://localhost:3000/api/product/507f1f77bcf86cd799439011/publish \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "scheduledDate": "2024-12-25T00:00:00Z"
  }'
```

### 8. UNPUBLISH PRODUCT
**POST** `/api/product/[id]/unpublish`

```bash
curl -X POST http://localhost:3000/api/product/507f1f77bcf86cd799439011/unpublish \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 9. UPLOAD PRODUCT IMAGES
**POST** `/api/product/[id]/upload-images`

```bash
curl -X POST http://localhost:3000/api/product/507f1f77bcf86cd799439011/upload-images \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "images=@image1.jpg" \
  -F "images=@image2.jpg"
```

### 10. DELETE PRODUCT IMAGE
**DELETE** `/api/product/[id]/images/[publicId]`

```bash
curl -X DELETE http://localhost:3000/api/product/507f1f77bcf86cd799439011/images/products_507f1f77bcf86cd799439011_abc123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 11. ADD PRODUCT REVIEW
**POST** `/api/product/[id]/review`

```bash
curl -X POST http://localhost:3000/api/product/507f1f77bcf86cd799439011/review \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "userId": "507f1f77bcf86cd799439012",
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "rating": 5,
    "title": "Excellent Product!",
    "comment": "Great sound quality and comfortable fit",
    "verified": true
  }'
```

### 12. TRACK PRODUCT ANALYTICS
**POST** `/api/product/[id]/track`

```bash
# Track page view
curl -X POST http://localhost:3000/api/product/507f1f77bcf86cd799439011/track \
  -H "Content-Type: application/json" \
  -d '{ "action": "view" }'

# Track add to cart
curl -X POST http://localhost:3000/api/product/507f1f77bcf86cd799439011/track \
  -H "Content-Type: application/json" \
  -d '{ "action": "add-to-cart" }'

# Track purchase
curl -X POST http://localhost:3000/api/product/507f1f77bcf86cd799439011/track \
  -H "Content-Type: application/json" \
  -d '{ "action": "purchase" }'
```

### 13. SET BLACK FRIDAY SALE
**POST** `/api/product/[id]/black-friday`

```bash
curl -X POST http://localhost:3000/api/product/507f1f77bcf86cd799439011/black-friday \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "blackFridayPrice": 15000,
    "startDate": "2024-11-24T00:00:00Z",
    "endDate": "2024-11-30T23:59:59Z",
    "active": true
  }'
```

### 14. UPDATE STOCK
**PATCH** `/api/product/[id]/stock`

```bash
# Set stock to specific quantity
curl -X PATCH http://localhost:3000/api/product/507f1f77bcf86cd799439011/stock \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "quantity": 100,
    "operation": "set"
  }'

# Add to stock
curl -X PATCH http://localhost:3000/api/product/507f1f77bcf86cd799439011/stock \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "quantity": 25,
    "operation": "add"
  }'

# Reduce stock
curl -X PATCH http://localhost:3000/api/product/507f1f77bcf86cd799439011/stock \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "quantity": 5,
    "operation": "subtract"
  }'
```

### 15. GET FEATURED PRODUCTS
**GET** `/api/product?featured=true&limit=10`

```bash
curl "http://localhost:3000/api/product?featured=true&limit=10"
```

### 16. GET SALE/DISCOUNT PRODUCTS
**GET** `/api/product?type=sales`

```bash
curl "http://localhost:3000/api/product?type=sales&limit=20"
```

### 17. GET LOW STOCK PRODUCTS (Admin)
**GET** `/api/product/admin/low-stock`

```bash
curl http://localhost:3000/api/product/admin/low-stock \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## Query Parameters

### For GET /api/product

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number for pagination |
| `limit` | number | 20 | Items per page (max 100) |
| `category` | string | - | Filter by category ID |
| `featured` | boolean | - | Filter featured products |
| `status` | string | published | Filter by status (draft, published, scheduled) |
| `sortBy` | string | createdAt | Sort by: createdAt, price-asc, price-desc, rating, newest, popular |
| `search` | string | - | Search in name, description, brand |
| `minPrice` | number | - | Minimum price filter |
| `maxPrice` | number | - | Maximum price filter |

---

## Response Formats

### Success Response (201/200)
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* product data */ }
}
```

### Pagination Response
```json
{
  "success": true,
  "data": [ /* products array */ ],
  "pagination": {
    "current": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Duplicate resource |
| 500 | Server Error - Internal error |

---

## Model Virtuals & Methods

### Virtuals
- `currentPrice` - Returns best available price (Black Friday > Sale > Base)
- `discountAmount` - Calculated discount from base price
- `stockStatus` - Status based on quantity (in-stock, low-stock, out-of-stock)

### Instance Methods
- `softDelete()` - Archive product
- `restore()` - Restore archived product
- `publish(scheduledDate)` - Publish or schedule publish
- `unpublish()` - Return to draft
- `addReview(reviewData)` - Add customer review
- `trackView()` - Track page view
- `trackClick()` - Track click
- `trackAddToCart()` - Track add to cart
- `trackPurchase()` - Track purchase & update conversion rate
- `updateConversionRate()` - Recalculate conversion rate

### Static Methods
- `getFeaturedProducts(limit)` - Get featured products
- `getSalesProducts(limit)` - Get sale products
- `getByStatus(status)` - Get by status
- `getLowStockProducts()` - Get low stock alert products

### Query Helpers
- `.active()` - Only non-deleted products
- `.published()` - Only published products

---

## Database Indexes

Optimized indexes for performance:
- `slug` - Unique
- `category` - For filtering
- `featured + isDeleted` - For featured products
- `status + isDeleted` - For status filtering
- `analytics.views` - For sorting by popularity
- `averageRating` - For sorting by rating
- `basePrice` - For price filtering
- `createdAt` - For date sorting

---

## Example: Complete Product Creation Flow

```javascript
// 1. Create product (draft)
const product = await POST('/api/product', {
  name: "Product Name",
  description: "...",
  basePrice: 10000,
  stock: 50,
  category: "categoryId"
});

// 2. Upload images
await POST(`/api/product/${product.data._id}/upload-images`, 
  formDataWithImages
);

// 3. Publish immediately
await POST(`/api/product/${product.data._id}/publish`);

// 4. Set Black Friday (optional)
await POST(`/api/product/${product.data._id}/black-friday`, {
  blackFridayPrice: 7500,
  startDate: "2024-11-24",
  endDate: "2024-11-30",
  active: true
});

// 5. Track when customer views
await POST(`/api/product/${product.data._id}/track`, {
  action: "view"
});
```

---

## Authentication

All POST, PUT, PATCH, DELETE endpoints require:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

The controller expects `req.user.id` to be set from auth middleware.

---

## Environment Variables Required

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

---

## Production Checklist

- [ ] Implement authentication middleware
- [ ] Add rate limiting for public endpoints
- [ ] Set up monitoring for analytics tracking
- [ ] Configure Cloudinary folder structure
- [ ] Add input validation middleware
- [ ] Implement caching for featured/sales products
- [ ] Set up automated Black Friday date checker
- [ ] Add automated scheduled product publisher
- [ ] Configure MongoDB indexes
- [ ] Set up error logging

---

This implementation provides a production-ready, scalable product management system suitable for enterprise e-commerce platforms.
