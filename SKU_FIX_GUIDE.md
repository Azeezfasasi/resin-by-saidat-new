# E11000 Duplicate Key Error - SKU Fix Guide

## Problem

When editing products, you're getting this error:

```
MongoServerError: E11000 duplicate key error collection: test.products index: sku_1 dup key: { sku: "" }
```

This happens because:
- MongoDB's `unique` index treats all empty strings as the same value
- When you have multiple products without a SKU, they all have `sku: ""` 
- Trying to update any product without a SKU fails due to the unique constraint

## Solution

I've implemented a 3-part fix:

### 1. **Updated Product Model** (`src/app/server/models/Product.js`)
```javascript
sku: {
  type: String,
  unique: true,
  sparse: true,
  trim: true,
  default: null,
  set: (v) => v === '' ? null : v, // Convert empty string to null
},
```

**What this does:**
- Sets empty SKU values to `null` instead of empty string
- With `sparse: true`, null values are ignored by the unique index
- Multiple products can now have no SKU without conflicts

### 2. **Updated Create Product Controller** (`src/app/server/controllers/productController.js`)
```javascript
sku: sku && sku.trim() ? sku.trim() : null, // Set to null if empty
barcode: barcode && barcode.trim() ? barcode.trim() : null, // Set to null if empty
```

**What this does:**
- New products save with `null` instead of empty string for SKU/barcode

### 3. **Updated Update Product Controller** (Same file)
```javascript
// Handle empty SKU - set to null instead of empty string
if (updates.sku === '' || updates.sku === null || updates.sku === undefined) {
  updates.sku = null;
}

// Handle empty barcode - set to null instead of empty string
if (updates.barcode === '' || updates.barcode === null || updates.barcode === undefined) {
  updates.barcode = null;
}
```

**What this does:**
- Updates explicitly convert empty strings to null
- Prevents the unique index conflict when editing products

---

## Fix Existing Data

You have existing products with empty SKU values that need to be migrated to null.

### Option 1: MongoDB Shell (Quickest)

Open MongoDB shell and run:

```javascript
db.products.updateMany(
  { sku: "" },
  { $set: { sku: null } }
);

db.products.updateMany(
  { barcode: "" },
  { $set: { barcode: null } }
);
```

### Option 2: MongoDB Compass GUI

1. Open MongoDB Compass
2. Connect to your database
3. Select the `products` collection
4. Click the Query tab
5. Enter: `{ sku: "" }`
6. Click "Update" and change to: `{ $set: { sku: null } }`
7. Repeat for barcode

### Option 3: Node.js Script

Run this command:

```bash
node scripts/fix-sku-duplicates.js
```

The script will:
- Connect to MongoDB
- Update all products with empty SKU to null
- Update all products with empty barcode to null
- Show you how many products were updated

---

## Verify the Fix

After running the migration, verify it worked:

```javascript
// Check how many products have null SKU
db.products.find({ sku: null }).count()

// Check for any remaining empty string SKUs
db.products.find({ sku: "" }).count()  // Should be 0

// Check if any still have empty barcode
db.products.find({ barcode: "" }).count()  // Should be 0
```

---

## Testing

Now you should be able to:

✅ Edit products without SKU - no more error  
✅ Create products without SKU - no more error  
✅ Add SKU to products that don't have one  
✅ Update SKU on existing products  
✅ Remove SKU from a product (set to empty, converts to null)  

---

## What Changed

| Scenario | Before | After |
|----------|--------|-------|
| No SKU provided | Empty string `""` | `null` |
| Edit product without SKU | ❌ E11000 Error | ✅ Works fine |
| Multiple products no SKU | ❌ Conflict | ✅ All can coexist |
| Unique index behavior | Treats `""` as value | Ignores `null` |

---

## If You Still Get the Error

If after applying these fixes you still see the error:

1. **Clear your database** (if in development):
   ```javascript
   db.products.deleteMany({})
   ```

2. **Drop the index and recreate**:
   ```javascript
   db.products.collection.dropIndex("sku_1")
   ```

3. **Restart your Node server** to reload the model with new setters

4. **Run the migration script** to fix existing data

---

## Prevention

Going forward, the system will:
- Auto-convert empty SKU/barcode to null on save
- Prevent new E11000 errors
- Allow unlimited products without SKU

The fix is automatic - no manual data cleaning needed for new products!
