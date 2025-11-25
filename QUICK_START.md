# Product System - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install mongoose cloudinary multer
```

### Step 2: Add Environment Variables

Create/update `.env.local`:
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret
```

### Step 3: Database Connection

Ensure `src/app/server/db/index.js` exists:
```javascript
import mongoose from 'mongoose';

export const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI);
};
```

### Step 4: Files Ready to Use

✅ All files are created and ready:
- `src/app/server/models/Product.js`
- `src/app/server/controllers/productController.js`
- `src/app/api/product/route.js`
- `src/app/api/product/[id]/route.js`
- `src/app/server/utils/productUtils.js`

## 🧪 Quick Test

### Create a Product

```bash
curl -X POST http://localhost:3000/api/product \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Test Product",
    "description": "Test description",
    "basePrice": 10000,
    "stock": 50,
    "category": "507f1f77bcf86cd799439011"
  }'
```

### Get All Products

```bash
curl http://localhost:3000/api/product?page=1&limit=10
```

### Get Single Product

```bash
curl http://localhost:3000/api/product/PRODUCT_ID
```

## 📋 Common Operations

### 1. Publish a Product

```bash
curl -X POST http://localhost:3000/api/product/PRODUCT_ID/publish \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 2. Update Stock

```bash
curl -X PATCH http://localhost:3000/api/product/PRODUCT_ID/stock \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"quantity": 100, "operation": "set"}'
```

### 3. Add Review

```bash
curl -X POST http://localhost:3000/api/product/PRODUCT_ID/review \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID",
    "userName": "John",
    "rating": 5,
    "title": "Great!",
    "comment": "Amazing product"
  }'
```

### 4. Track Analytics

```bash
curl -X POST http://localhost:3000/api/product/PRODUCT_ID/track \
  -H "Content-Type: application/json" \
  -d '{"action": "view"}'
```

## 🎯 Key Concepts

### Product Status
- **draft** - Not published (default)
- **published** - Live for customers
- **scheduled** - Will publish on set date

### Stock Status (Virtual)
- **in-stock** - Stock > 0
- **low-stock** - Stock ≤ lowStockThreshold
- **out-of-stock** - Stock = 0

### Pricing Priority
1. Black Friday Price (if active)
2. Sale Price (if set)
3. Base Price (fallback)

### Soft Delete
- Products marked with `isDeleted: true`
- Not deleted permanently
- Can be restored
- Auto-filtered from queries

## 📊 Fields Reference

### Required Fields
- `name` - Product name
- `description` - Full description
- `basePrice` - Original price
- `stock` - Quantity available
- `category` - Category ID

### Optional Fields
- `salePrice` - Discounted price
- `shortDescription` - For listings
- `brand` - Brand name
- `sku` - SKU code
- `attributes` - Size, color, etc.
- `images` - Product images
- `deliveryLocations` - Shipping options

## 🔍 Filtering Examples

### By Category
```
GET /api/product?category=507f1f77bcf86cd799439011
```

### By Price Range
```
GET /api/product?minPrice=10000&maxPrice=50000
```

### By Status
```
GET /api/product?status=published
```

### By Featured
```
GET /api/product?featured=true
```

### Search
```
GET /api/product?search=headphones
```

### Sort Options
- `createdAt` - Newest (default)
- `price-asc` - Price low to high
- `price-desc` - Price high to low
- `rating` - By rating
- `popular` - By views

## 🎨 React Component Example

```javascript
import { useState, useEffect } from 'react';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('/api/product?page=1&limit=20');
      const data = await response.json();
      setProducts(data.data);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product._id}>
          <h3>{product.name}</h3>
          <p>Price: ₦{product.currentPrice.toLocaleString()}</p>
          <p>Rating: {product.averageRating} ⭐</p>
          <p>Stock: {product.stockStatus}</p>
        </div>
      ))}
    </div>
  );
}
```

## ✅ Checklist Before Going Live

- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] Cloudinary credentials verified
- [ ] Authentication middleware implemented
- [ ] Error logging set up
- [ ] Rate limiting configured
- [ ] Backup strategy planned
- [ ] Performance tested with 1000+ products
- [ ] Security review completed
- [ ] Monitoring alerts set up

## 🆘 Troubleshooting

### "Product not found"
- Check product ID is valid
- Verify product is not deleted
- Check status is 'published'

### "Cloudinary error"
- Verify API credentials in .env
- Check file size < 5MB
- Verify file type (JPEG, PNG, GIF, PDF)

### "Stock cannot be negative"
- Use `operation: 'subtract'` with caution
- Stock minimum is 0
- Will automatically set to 0 if negative attempted

### "Black Friday price not showing"
- Check `blackFridayActive` is true
- Verify current date is between start and end
- Confirm `blackFridayPrice` < `basePrice`

## 📞 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* product data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error"
}
```

### Pagination Response
```json
{
  "success": true,
  "data": [ /* products */ ],
  "pagination": {
    "current": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

## 🚀 Production Deployment

### Recommended
1. Add rate limiting middleware
2. Set up monitoring/logging
3. Configure caching (Redis)
4. Enable request compression
5. Set up automated backups
6. Configure CDN for images
7. Add request validation
8. Implement error tracking

## 📚 Full Documentation

- **API Docs**: See `PRODUCT_API_DOCUMENTATION.md`
- **Setup Guide**: See `PRODUCT_IMPLEMENTATION_GUIDE.md`
- **Code Examples**: See `PRODUCT_EXAMPLES.js`
- **Summary**: See `README_PRODUCTS.md`

## 💡 Pro Tips

1. **Cache Featured Products** - Reduces DB load
2. **Use Pagination** - Always for list endpoints
3. **Track Analytics** - Understand customer behavior
4. **Monitor Low Stock** - Alert customers/admin
5. **Schedule Publishing** - Plan product launches
6. **Soft Delete** - Never truly delete data
7. **Batch Operations** - Update multiple products at once
8. **Export Data** - Use CSV export for analysis

## 🎓 Next to Learn

1. Setting up admin dashboard
2. Product search optimization
3. Analytics dashboard
4. Bulk operations UI
5. Inventory management interface
6. Pricing management tools
7. Review moderation system
8. Product recommendations

---

**You're all set!** Start creating products now! 🚀
