'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductFormComponent from '@/components/ProductForm/ProductFormComponent';
import { AlertCircle, CheckCircle } from 'lucide-react';

const AddProductPage = () => {
  const router = useRouter();
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      // Send request to backend
      const response = await fetch('/api/product', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type, let the browser handle it for FormData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create product');
      }

      setAlert({
        type: 'success',
        message: 'Product created successfully!',
      });

      // Redirect after success
      setTimeout(() => {
        router.push('/dashboard/all-product');
      }, 1500);
    } catch (error) {
      console.error('Error creating product:', error);
      setAlert({
        type: 'error',
        message: error.message || 'Failed to create product. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/all-product');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-4 md:py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Alert Messages */}
        {alert && (
          <div
            className={`mb-4 md:mb-6 p-3 md:p-4 rounded-lg flex items-center gap-3 text-sm md:text-base ${
              alert.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            {alert.type === 'success' ? (
              <CheckCircle className="text-green-600 shrink-0" size={20} />
            ) : (
              <AlertCircle className="text-red-600 shrink-0" size={20} />
            )}
            <p
              className={`font-medium ${
                alert.type === 'success'
                  ? 'text-green-800'
                  : 'text-red-800'
              }`}
            >
              {alert.message}
            </p>
          </div>
        )}

        {/* Form */}
        <ProductFormComponent
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default AddProductPage;
