import mongoose from 'mongoose';
import Product from './src/app/server/models/Product.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';

async function checkIndexes() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    // Get the raw index stats from MongoDB
    const stats = await Product.collection.listIndexes().toArray();
    
    console.log('\n📋 Full Index Specifications:');
    stats.forEach((idx) => {
      console.log(`\nIndex: ${idx.name}`);
      console.log(JSON.stringify(idx, null, 2));
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkIndexes();
