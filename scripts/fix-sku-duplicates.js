/**
 * MongoDB Migration Script
 * Fixes E11000 duplicate key error by converting empty string SKU and barcodes to null
 * 
 * Usage:
 * 1. Copy this file content
 * 2. Run in MongoDB shell or use Compass:
 *    - Go to Aggregation tab
 *    - Paste this script
 * 3. Or run via Node.js script with mongoose connection
 */

// ============================================
// Option 1: Using MongoDB Shell / Compass
// ============================================
// Run in your MongoDB shell after connecting to your database:

db.products.updateMany(
  { sku: "" },
  { $set: { sku: null } }
);

db.products.updateMany(
  { barcode: "" },
  { $set: { barcode: null } }
);

// ============================================
// Option 2: Using Node.js Script
// ============================================
// Save as `scripts/fix-sku-duplicates.js` and run: node scripts/fix-sku-duplicates.js

import mongoose from 'mongoose';
import Product from '@/app/server/models/Product.js';
import { connectDB } from '@/utils/db.js';

async function fixSkuDuplicates() {
  try {
    console.log('🔧 Starting SKU/Barcode migration...');
    
    await connectDB();

    // Update empty SKUs to null
    const skuResult = await Product.updateMany(
      { sku: "" },
      { $set: { sku: null } }
    );
    console.log(`✅ Updated ${skuResult.modifiedCount} products with empty SKU to null`);

    // Update empty barcodes to null
    const barcodeResult = await Product.updateMany(
      { barcode: "" },
      { $set: { barcode: null } }
    );
    console.log(`✅ Updated ${barcodeResult.modifiedCount} products with empty barcode to null`);

    console.log('\n✨ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
fixSkuDuplicates();

// ============================================
// Option 3: MongoDB Compass GUI
// ============================================
// 1. Open MongoDB Compass
// 2. Connect to your database
// 3. Go to the `products` collection
// 4. Click the "Aggregation" tab
// 5. Add a $match stage to find empty SKUs:
//    { sku: { $eq: "" } }
// 6. Then update using MongoDB CLI or shell

// ============================================
// What This Fixes
// ============================================
/*
PROBLEM:
- MongoDB unique index on `sku` field treats all empty strings ("") as the same value
- This causes E11000 duplicate key error when updating multiple products with no SKU
- Error: "E11000 duplicate key error collection: test.products index: sku_1 dup key: { sku: "" }"

SOLUTION:
- Convert empty strings to null/undefined
- With sparse: true index, null values are ignored
- Allows multiple products to have no SKU without conflicts

VERIFICATION:
- After running this script, you should be able to update products without SKU errors
- Check in MongoDB Compass or shell:
  db.products.find({ sku: null }).count()
  db.products.find({ barcode: null }).count()
*/
