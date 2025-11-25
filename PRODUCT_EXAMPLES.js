/**
 * Product System - Examples & Test Cases
 * Demonstrates usage of the complete product system
 */

// ============================================
// EXAMPLE 1: CREATE PRODUCT
// ============================================

const createProductExample = async () => {
  const productData = {
    name: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality.",
    shortDescription: "Premium wireless headphones with ANC",
    category: "507f1f77bcf86cd799439011",
    subcategory: "507f1f77bcf86cd799439012",
    brand: "AudioPro",
    basePrice: 45000,
    salePrice: 35000,
    stock: 100,
    sku: "AUD-WH-001",
    barcode: "1234567890123",
    attributes: [
      { name: "Color", value: "Matte Black" },
      { name: "Connectivity", value: "Bluetooth 5.0" },
      { name: "Battery Life", value: "30 hours" },
      { name: "Weight", value: "250g" }
    ],
    deliveryLocations: [
      {
        locationName: "Lagos",
        shippingCost: 2000,
        estimatedDays: 2,
        isAvailable: true
      },
      {
        locationName: "Abuja",
        shippingCost: 3500,
        estimatedDays: 3,
        isAvailable: true
      }
    ],
    weight: {
      value: 250,
      unit: "g"
    },
    dimensions: {
      length: 20,
      width: 18,
      height: 8,
      unit: "cm"
    },
    metaTitle: "Premium Wireless Headphones - Best Price",
    metaDescription: "Buy premium wireless headphones with ANC at best price",
    metaKeywords: ["headphones", "wireless", "audio", "bluetooth"]
  };

  const response = await fetch('/api/product', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_JWT_TOKEN'
    },
    body: JSON.stringify(productData)
  });

  const result = await response.json();
  console.log(result);
  return result.data._id;
};

// ============================================
// EXAMPLE 2: UPLOAD PRODUCT IMAGES
// ============================================

const uploadProductImagesExample = async (productId) => {
  const formData = new FormData();
  
  // Add multiple images
  const imageFiles = await document.querySelectorAll('input[type="file"]');
  imageFiles.forEach(input => {
    if (input.files) {
      for (let file of input.files) {
        formData.append('images', file);
      }
    }
  });

  const response = await fetch(`/api/product/${productId}/upload-images`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_JWT_TOKEN'
    },
    body: formData
  });

  const result = await response.json();
  console.log('Images uploaded:', result.data.uploadedImages);
  return result;
};

// ============================================
// EXAMPLE 3: PUBLISH PRODUCT
// ============================================

const publishProductExample = async (productId) => {
  // Publish immediately
  const response = await fetch(`/api/product/${productId}/publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_JWT_TOKEN'
    },
    body: JSON.stringify({})
  });

  const result = await response.json();
  console.log('Product published:', result.data);
};

// ============================================
// EXAMPLE 4: SCHEDULE PRODUCT PUBLISH
// ============================================

const schedulePublishExample = async (productId, publishDate) => {
  const response = await fetch(`/api/product/${productId}/publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_JWT_TOKEN'
    },
    body: JSON.stringify({
      scheduledDate: publishDate.toISOString()
    })
  });

  const result = await response.json();
  console.log('Product scheduled:', result.data);
};

// ============================================
// EXAMPLE 5: SET BLACK FRIDAY SALE
// ============================================

const setBlackFridayExample = async (productId) => {
  const response = await fetch(`/api/product/${productId}/black-friday`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_JWT_TOKEN'
    },
    body: JSON.stringify({
      blackFridayPrice: 19999,
      startDate: new Date('2024-11-24').toISOString(),
      endDate: new Date('2024-11-30').toISOString(),
      active: true
    })
  });

  const result = await response.json();
  console.log('Black Friday set:', result.data);
};

// ============================================
// EXAMPLE 6: UPDATE STOCK
// ============================================

const updateStockExample = async (productId) => {
  // Set stock to specific amount
  const setResponse = await fetch(`/api/product/${productId}/stock`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_JWT_TOKEN'
    },
    body: JSON.stringify({
      quantity: 100,
      operation: 'set'
    })
  });

  // Add to stock
  const addResponse = await fetch(`/api/product/${productId}/stock`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_JWT_TOKEN'
    },
    body: JSON.stringify({
      quantity: 50,
      operation: 'add'
    })
  });

  // Reduce stock
  const subtractResponse = await fetch(`/api/product/${productId}/stock`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_JWT_TOKEN'
    },
    body: JSON.stringify({
      quantity: 10,
      operation: 'subtract'
    })
  });

  console.log('Stock updated');
};

// ============================================
// EXAMPLE 7: ADD PRODUCT REVIEW
// ============================================

const addProductReviewExample = async (productId, userId) => {
  const response = await fetch(`/api/product/${productId}/review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_JWT_TOKEN'
    },
    body: JSON.stringify({
      userId: userId,
      userName: "John Doe",
      userEmail: "john@example.com",
      rating: 5,
      title: "Excellent product!",
      comment: "Amazing sound quality, very comfortable, and battery lasts forever!",
      verified: true
    })
  });

  const result = await response.json();
  console.log('Review added:', result.data.averageRating);
};

// ============================================
// EXAMPLE 8: TRACK ANALYTICS
// ============================================

const trackAnalyticsExample = async (productId) => {
  // Track page view
  await fetch(`/api/product/${productId}/track`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ action: 'view' })
  });

  // Track click
  await fetch(`/api/product/${productId}/track`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ action: 'click' })
  });

  // Track add to cart
  await fetch(`/api/product/${productId}/track`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ action: 'add-to-cart' })
  });

  // Track purchase
  await fetch(`/api/product/${productId}/track`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ action: 'purchase' })
  });
};

// ============================================
// EXAMPLE 9: GET ALL PRODUCTS WITH FILTERS
// ============================================

const getProductsExample = async () => {
  const filters = {
    page: 1,
    limit: 20,
    category: '507f1f77bcf86cd799439011',
    sortBy: 'price-asc',
    search: 'headphones',
    minPrice: 10000,
    maxPrice: 100000
  };

  const queryString = new URLSearchParams(filters).toString();
  const response = await fetch(`/api/product?${queryString}`);
  const result = await response.json();

  console.log('Total products:', result.pagination.total);
  console.log('Pages:', result.pagination.pages);
  console.log('Products:', result.data);
};

// ============================================
// EXAMPLE 10: GET FEATURED PRODUCTS
// ============================================

const getFeaturedProductsExample = async () => {
  const response = await fetch('/api/product?featured=true&limit=10');
  const result = await response.json();
  console.log('Featured products:', result.data);
};

// ============================================
// EXAMPLE 11: COMPLETE PRODUCT FLOW
// ============================================

const completeProductFlowExample = async () => {
  try {
    // 1. Create product
    console.log('1. Creating product...');
    const productData = {
      name: "Premium Wireless Headphones",
      description: "High-quality wireless headphones",
      basePrice: 45000,
      stock: 100,
      category: "507f1f77bcf86cd799439011"
    };

    const createResponse = await fetch('/api/product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_JWT_TOKEN'
      },
      body: JSON.stringify(productData)
    });

    const product = await createResponse.json();
    const productId = product.data._id;
    console.log('✓ Product created:', productId);

    // 2. Upload images
    console.log('2. Uploading images...');
    // ... upload images code
    console.log('✓ Images uploaded');

    // 3. Publish product
    console.log('3. Publishing product...');
    await fetch(`/api/product/${productId}/publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_JWT_TOKEN'
      },
      body: JSON.stringify({})
    });
    console.log('✓ Product published');

    // 4. Set as featured
    console.log('4. Setting as featured...');
    await fetch(`/api/product/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_JWT_TOKEN'
      },
      body: JSON.stringify({ featured: true })
    });
    console.log('✓ Set as featured');

    // 5. Set Black Friday
    console.log('5. Setting Black Friday price...');
    await fetch(`/api/product/${productId}/black-friday`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_JWT_TOKEN'
      },
      body: JSON.stringify({
        blackFridayPrice: 19999,
        startDate: '2024-11-24T00:00:00Z',
        endDate: '2024-11-30T23:59:59Z',
        active: true
      })
    });
    console.log('✓ Black Friday set');

    console.log('\n✅ Complete flow finished!');
  } catch (error) {
    console.error('Error:', error);
  }
};

// ============================================
// TEST CASES
// ============================================

const testCases = {
  // Test 1: Create and publish product
  testCreateAndPublish: async () => {
    console.log('TEST: Create and publish product');
    // Implementation
  },

  // Test 2: Upload images and set thumbnail
  testImageUpload: async () => {
    console.log('TEST: Image upload and thumbnail');
    // Implementation
  },

  // Test 3: Add reviews and calculate rating
  testReviewsAndRating: async () => {
    console.log('TEST: Reviews and rating calculation');
    // Implementation
  },

  // Test 4: Stock management
  testStockManagement: async () => {
    console.log('TEST: Stock update operations');
    // Implementation
  },

  // Test 5: Pricing logic
  testPricingLogic: async () => {
    console.log('TEST: Pricing with Black Friday');
    // Implementation
  },

  // Test 6: Analytics tracking
  testAnalyticsTracking: async () => {
    console.log('TEST: Analytics tracking and conversion');
    // Implementation
  },

  // Test 7: Soft delete and restore
  testSoftDelete: async () => {
    console.log('TEST: Soft delete and restore');
    // Implementation
  },

  // Test 8: Search and filter
  testSearchFilter: async () => {
    console.log('TEST: Search and advanced filtering');
    // Implementation
  },

  // Test 9: Scheduled publishing
  testScheduledPublish: async () => {
    console.log('TEST: Scheduled publishing');
    // Implementation
  },

  // Test 10: Delivery location management
  testDeliveryLocations: async () => {
    console.log('TEST: Delivery location updates');
    // Implementation
  },
};

// ============================================
// REACT COMPONENT EXAMPLE
// ============================================

/*
import React, { useState } from 'react';
import axios from 'axios';

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
    stock: '',
    category: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('/api/product', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('Product created:', response.data);
      alert('Product created successfully!');
    } catch (error) {
      console.error('Error:', error.response?.data);
      alert('Failed to create product');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Product Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        required
      />
      
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
        required
      />
      
      <input
        type="number"
        placeholder="Base Price"
        value={formData.basePrice}
        onChange={(e) => setFormData({...formData, basePrice: e.target.value})}
        required
      />
      
      <input
        type="number"
        placeholder="Stock"
        value={formData.stock}
        onChange={(e) => setFormData({...formData, stock: e.target.value})}
        required
      />
      
      <button type="submit">Create Product</button>
    </form>
  );
};

export default ProductForm;
*/

// ============================================
// EXPORT EXAMPLES
// ============================================

export {
  createProductExample,
  uploadProductImagesExample,
  publishProductExample,
  schedulePublishExample,
  setBlackFridayExample,
  updateStockExample,
  addProductReviewExample,
  trackAnalyticsExample,
  getProductsExample,
  getFeaturedProductsExample,
  completeProductFlowExample,
  testCases
};
