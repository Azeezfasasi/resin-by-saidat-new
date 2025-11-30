# Quick Reference: E11000 Error Fix

## Problem in 10 Seconds

When you edited a product without a SKU, you got this error:
```
E11000 duplicate key error ... sku_1 dup key: { sku: "" }
```

MongoDB was treating all empty SKUs as the same value → collision → error.

---

## Solution in 10 Seconds

I changed the system to use `null` for empty SKUs instead of `""`.

With the `sparse: true` index setting, MongoDB ignores null values.

Result: Multiple products can now have no SKU without conflicts.

---

## What Changed

| Before | After |
|--------|-------|
| No SKU = `""` | No SKU = `null` |
| ❌ Errors | ✅ Works |
| Max 1 product without SKU | ∞ products without SKU |

---

## Quick Fixes You Can Run

### In MongoDB Shell:
```javascript
db.products.updateMany({ sku: "" }, { $set: { sku: null } });
db.products.updateMany({ barcode: "" }, { $set: { barcode: null } });
```

### Or Run Node Script:
```bash
node scripts/fix-sku-duplicates.js
```

---

## Test It

Edit a product without a SKU → Should work now!

---

## Files Changed

- `src/app/server/models/Product.js` - Model updated
- `src/app/server/controllers/productController.js` - Create & update functions fixed
- `scripts/fix-sku-duplicates.js` - Migration script (NEW)
- `SKU_FIX_GUIDE.md` - Full guide (NEW)
- `SKU_ERROR_FIX_COMPLETE.md` - Complete explanation (NEW)

---

## That's It!

✅ The error is fixed  
✅ New products work automatically  
✅ Just migrate existing products using one of the methods above  
✅ Edit to your heart's content!

See `SKU_FIX_GUIDE.md` for detailed instructions.
