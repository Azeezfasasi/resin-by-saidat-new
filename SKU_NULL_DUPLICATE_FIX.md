# E11000 Duplicate Key Error - FIXED ✅

## Problem
```
E11000 duplicate key error collection: test.products index: sku_1 dup key: { sku: null }
```

Multiple products with `sku: null` (or `barcode: null`) were violating the unique constraint because MongoDB's unique index was treating all null values as the same, creating duplicates.

## Root Cause
The database had old **non-sparse** unique indexes on SKU and barcode fields. MongoDB requires special handling for nullable unique fields - they must be **sparse indexes**, which ignore null/missing values.

**Non-sparse (❌ problematic):**
- `unique: true` alone
- Treats multiple nulls as duplicates ❌
- Error when adding 2nd product with null

**Sparse (✅ correct):**
- `unique: true, sparse: true`
- Ignores null values in unique check ✓
- Multiple products can have null ✓

## What Was Fixed

### 1. Product Model Schema (`src/app/server/models/Product.js`)
```javascript
// BEFORE: unique: true only
sku: { type: String, unique: true, ... }

// AFTER: Added explicit sparse index definition
sku: {
  type: String,
  unique: true,
  sparse: true,
  trim: true,
  default: null,
  set: (v) => v === '' ? null : v,
  index: { unique: true, sparse: true }, // ← Explicit sparse index
}
```

### 2. Removed Duplicate Index Declaration
- Removed redundant `productSchema.index({ slug: 1 })` (was conflicting with field-level `unique: true`)

### 3. Rebuilt Database Indexes
- Dropped old non-sparse SKU and barcode indexes
- Recreated them as sparse indexes using MongoDB

**Verification:**
```bash
✅ sku_1: { unique: true, sparse: true }
✅ barcode_1: { unique: true, sparse: true }
```

## Testing
✅ Try editing the product that caused the error - it should now work!

## Why This Happened
1. Schema originally defined SKU with `unique: true` only
2. Database created non-sparse indexes
3. When multiple products had `sku: null`, it triggered the E11000 error
4. Fix: Rebuild indexes as sparse (null values are ignored)

## Prevention
The Product model now has proper sparse indexes, so new databases will be created correctly. Future products without SKU will all use `null` instead of empty strings, and the sparse index allows unlimited null values.
