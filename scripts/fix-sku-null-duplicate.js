#!/usr/bin/env node

/**
 * Fix E11000 Duplicate Key Error on SKU/Barcode Fields
 * 
 * Problem: MongoDB has a non-sparse unique index on SKU/barcode fields
 * When multiple products have null values, it violates the unique constraint
 * 
 * Solution: Drop the old indexes and let Mongoose recreate them as sparse indexes
 * 
 * Usage: node scripts/fix-sku-null-duplicate.js
 */

import mongoose from 'mongoose';
import Product from '../src/app/server/models/Product.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';

async function fixSKUDuplicateError() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n📊 Checking current indexes...');
    const indexes = await Product.collection.getIndexes();
    console.log('Current indexes:', Object.keys(indexes));

    // Drop the problematic non-sparse indexes
    console.log('\n🗑️  Dropping old non-sparse SKU and barcode indexes...');
    
    try {
      await Product.collection.dropIndex('sku_1');
      console.log('✅ Dropped sku_1 index');
    } catch (err) {
      if (err.message.includes('index not found')) {
        console.log('ℹ️  sku_1 index doesn\'t exist');
      } else {
        throw err;
      }
    }

    try {
      await Product.collection.dropIndex('barcode_1');
      console.log('✅ Dropped barcode_1 index');
    } catch (err) {
      if (err.message.includes('index not found')) {
        console.log('ℹ️  barcode_1 index doesn\'t exist');
      } else {
        throw err;
      }
    }

    // Recreate indexes with syncIndexes (creates sparse indexes from schema)
    console.log('\n🔨 Rebuilding indexes from schema (with sparse=true)...');
    await Product.syncIndexes();
    console.log('✅ Indexes rebuilt successfully');

    // Explicitly create sparse indexes (syncIndexes doesn't always create sparse)
    console.log('\n🔧 Creating explicit sparse indexes...');
    await Product.collection.createIndex(
      { sku: 1 },
      { unique: true, sparse: true }
    );
    await Product.collection.createIndex(
      { barcode: 1 },
      { unique: true, sparse: true }
    );
    console.log('✅ Sparse indexes created explicitly');

    // First, convert any empty strings to null in the database
    console.log('\n🔄 Converting empty strings to null...');
    const skuResult = await Product.collection.updateMany(
      { sku: '' },
      { $set: { sku: null } }
    );
    const barcodeResult = await Product.collection.updateMany(
      { barcode: '' },
      { $set: { barcode: null } }
    );
    if (skuResult.modifiedCount > 0) {
      console.log(`✅ Updated ${skuResult.modifiedCount} products with empty SKU to null`);
    }
    if (barcodeResult.modifiedCount > 0) {
      console.log(`✅ Updated ${barcodeResult.modifiedCount} products with empty barcode to null`);
    }

    console.log('\n📊 New indexes:');
    const newIndexes = await Product.collection.getIndexes();
    console.log(Object.keys(newIndexes));

    // Verify the indexes have sparse: true
    console.log('\n🔍 Verifying sparse indexes...');
    const skuIndex = newIndexes.sku_1;
    const barcodeIndex = newIndexes.barcode_1;

    if (skuIndex?.sparse === true) {
      console.log('✅ sku_1 is now SPARSE (allows multiple nulls)');
    } else {
      console.log('❌ sku_1 is NOT sparse - something went wrong');
    }

    if (barcodeIndex?.sparse === true) {
      console.log('✅ barcode_1 is now SPARSE (allows multiple nulls)');
    } else {
      console.log('❌ barcode_1 is NOT sparse - something went wrong');
    }

    // Check how many products have null SKU/barcode
    console.log('\n📈 Product statistics:');
    const totalProducts = await Product.countDocuments();
    const nullSkuProducts = await Product.countDocuments({ sku: null });
    const nullBarcodeProducts = await Product.countDocuments({ barcode: null });
    const emptySkuProducts = await Product.countDocuments({ sku: '' });
    const emptyBarcodeProducts = await Product.countDocuments({ barcode: '' });

    console.log(`  Total products: ${totalProducts}`);
    console.log(`  Products with sku: null: ${nullSkuProducts}`);
    console.log(`  Products with barcode: null: ${nullBarcodeProducts}`);
    console.log(`  Products with sku: "": ${emptySkuProducts}`);
    console.log(`  Products with barcode: "": ${emptyBarcodeProducts}`);

    console.log('\n✨ Fix completed successfully!');
    console.log('You should now be able to update products without E11000 errors.');
    console.log('\n💡 Tips:');
    console.log('  - Clear your browser cache if you still see errors');
    console.log('  - Restart your development server');
    console.log('  - Try editing a product again');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 11000) {
      console.error('\n💡 If you still get E11000 errors, try these steps:');
      console.error('1. Connect to your MongoDB directly');
      console.error('2. Run: db.products.dropIndex("sku_1"); db.products.dropIndex("barcode_1");');
      console.error('3. Restart your app');
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

fixSKUDuplicateError();
