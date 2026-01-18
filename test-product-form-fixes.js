/**
 * Test script to verify the product form fixes
 * Tests the scenario from the mobile screenshot:
 * - Product Name: "Fish scale set"
 * - Category: "Flower vase"
 * - Slug: "fish-scale-set"
 */

import mongoose from 'mongoose';
import Product from './src/app/server/models/Product.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';

async function testProductFormFixes() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Test 1: Minimal product (like from mobile form with only required fields)
    console.log('Test 1: Creating minimal product (mobile form scenario)...');
    const minimalProduct = new Product({
      name: 'Fish scale set',
      slug: 'fish-scale-set',
      description: 'High quality fish scale set with complete details',
      category: 'Flower vase',
      basePrice: 5000,
      stock: 100,
    });
    
    await minimalProduct.save();
    console.log('✅ Minimal product created successfully\n');
    
    // Test 2: Product with empty weight and dimensions (mobile might send these as empty)
    console.log('Test 2: Creating product with empty weight/dimensions...');
    const productWithEmptyMeasurements = new Product({
      name: 'Test Product with Empty Measurements',
      slug: 'test-empty-measurements',
      description: 'Testing empty weight and dimensions',
      category: 'Flower vase',
      basePrice: 1000,
      stock: 50,
      weight: {}, // Empty object like the fix handles
      dimensions: {}, // Empty object like the fix handles
    });
    
    await productWithEmptyMeasurements.save();
    console.log('✅ Product with empty measurements created successfully\n');
    
    // Test 3: Product with partial weight
    console.log('Test 3: Creating product with partial weight...');
    const productWithWeight = new Product({
      name: 'Weighted Product',
      slug: 'weighted-product',
      description: 'Product with weight specified',
      category: 'Flower vase',
      basePrice: 2000,
      stock: 75,
      weight: { value: 2.5, unit: 'kg' },
      dimensions: {}, // Empty dimensions
    });
    
    await productWithWeight.save();
    console.log('✅ Product with weight created successfully\n');
    
    // Test 4: Product with all optional fields
    console.log('Test 4: Creating product with all fields...');
    const completeProduct = new Product({
      name: 'Complete Product',
      slug: 'complete-product',
      description: 'Product with all optional fields',
      shortDescription: 'A product with all fields',
      category: 'Flower vase',
      basePrice: 3000,
      salePrice: 2500,
      discountPercent: 17,
      stock: 100,
      lowStockThreshold: 20,
      weight: { value: 1.5, unit: 'kg' },
      dimensions: { length: 10, width: 8, height: 5, unit: 'cm' },
      attributes: [
        { name: 'Color', value: 'Red' },
        { name: 'Size', value: 'Large' }
      ],
    });
    
    await completeProduct.save();
    console.log('✅ Complete product created successfully\n');
    
    // Cleanup
    console.log('🧹 Cleaning up test data...');
    await Product.deleteMany({
      name: {
        $in: [
          'Fish scale set',
          'Test Product with Empty Measurements',
          'Weighted Product',
          'Complete Product'
        ]
      }
    });
    console.log('✅ Cleanup complete\n');
    
    console.log('✅✅✅ ALL TESTS PASSED! ✅✅✅');
    console.log('\nThe product form fixes are working correctly!');
    console.log('Users should now be able to add products from mobile without validation errors.');
    
  } catch (error) {
    console.error('\n❌ TEST FAILED!');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    
    if (error.name === 'ValidationError') {
      console.error('\nValidation Errors:');
      Object.entries(error.errors).forEach(([field, err]) => {
        console.error(`  ${field}: ${err.message}`);
      });
    }
    
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Database connection closed');
  }
}

testProductFormFixes();
