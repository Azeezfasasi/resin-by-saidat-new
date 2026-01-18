import mongoose from 'mongoose';
import Product from './src/app/server/models/Product.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';

/**
 * Test product submission to see exact MongoDB validation errors
 */
async function testProductSubmission() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Create a test product with minimal required fields
    const testProduct = new Product({
      name: 'Fish scale set',
      slug: 'fish-scale-set',
      description: 'A test product description',
      category: 'Flower vase',
      basePrice: 100,
      stock: 10,
    });
    
    console.log('📝 Attempting to save test product...\n');
    console.log('Product data:', {
      name: testProduct.name,
      slug: testProduct.slug,
      description: testProduct.description,
      category: testProduct.category,
      basePrice: testProduct.basePrice,
      stock: testProduct.stock,
    });
    
    await testProduct.save();
    
    console.log('\n✅ Product saved successfully!');
    console.log('Product ID:', testProduct._id);
    
    // Clean up
    await Product.deleteOne({ _id: testProduct._id });
    console.log('✅ Test product removed');
    
  } catch (error) {
    console.error('\n❌ Error Details:');
    console.error('Name:', error.name);
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    
    if (error.name === 'ValidationError') {
      console.error('\n📋 Validation Errors:');
      Object.entries(error.errors).forEach(([field, err]) => {
        console.error(`  ${field}: ${err.message}`);
      });
    }
    
    if (error.name === 'MongoServerError' || error.name === 'MongoError') {
      console.error('\n📋 MongoDB Error Details:');
      if (error.errInfo) {
        console.error('  Error Info:', error.errInfo);
      }
    }
    
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

testProductSubmission();
