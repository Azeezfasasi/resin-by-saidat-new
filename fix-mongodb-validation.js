import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';

/**
 * This script checks and fixes MongoDB collection validators that might be causing
 * "The string did not match the expected pattern" errors
 */

async function fixMongoDBValidation() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    
    const db = client.db();
    const collections = await db.listCollections().toArray();
    
    console.log('\n📋 Checking collection validators...\n');
    
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      
      try {
        // Get collection validation info
        const listCollectionsResult = await db.listCollections({ name: collectionName }).toArray();
        
        if (listCollectionsResult.length > 0 && listCollectionsResult[0].options?.validator) {
          console.log(`❌ Found validator on collection: ${collectionName}`);
          console.log('   Validator:', JSON.stringify(listCollectionsResult[0].options.validator, null, 2));
          
          // Remove the validator
          console.log(`   Removing validator...`);
          await db.command({
            collMod: collectionName,
            validator: {}
          });
          console.log(`   ✅ Validator removed from ${collectionName}\n`);
        }
      } catch (error) {
        if (error.message.includes('no such collection') || error.message.includes('ns does not exist')) {
          // Collection doesn't exist, skip
          continue;
        }
        // Other errors might indicate no validator exists
        if (!error.message.includes('validator') && !error.message.includes('no such')) {
          console.log(`   ℹ️  ${collectionName}: ${error.message}`);
        }
      }
    }
    
    console.log('\n✅ MongoDB validation check complete!');
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

fixMongoDBValidation();
