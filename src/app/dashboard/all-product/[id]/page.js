'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import ProductFormComponent from '@/components/ProductForm/ProductFormComponent';
import ProductDetailView from '@/components/ProductDetail/ProductDetailView';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const ProductDetailPage = ({ params }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditing = searchParams.get('edit') === 'true';
  
  // Unwrap the params promise
  const { id: productId } = use(params);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch product
  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/product/${productId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch product');
      }

      setProduct(data.product);
    } catch (error) {
      console.error('Error fetching product:', error);
      setAlert({
        type: 'error',
        message: error.message || 'Failed to load product details.',
      });
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleUpdate = async (formData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/product/${productId}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update product');
      }

      setAlert({
        type: 'success',
        message: 'Product updated successfully!',
      });

      // Refetch product to get updated data
      setTimeout(() => {
        fetchProduct();
        router.push(`/dashboard/all-product/${productId}`);
      }, 1500);
    } catch (error) {
      console.error('Error updating product:', error);
      setAlert({
        type: 'error',
        message: error.message || 'Failed to update product. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isEditing) {
      router.push(`/dashboard/all-product/${productId}`);
    } else {
      router.back();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-blue-600" size={40} />
          <p className="text-gray-600 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <AlertCircle className="mx-auto mb-4 text-red-600" size={48} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Product Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The product you&rsquo;re looking for doesn&rsquo;t exist.
            </p>
            <button
              onClick={() => router.push('/dashboard/all-product')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <ArrowLeft size={20} /> Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['admin', 'staff-member']}>
    <div className="min-h-screen bg-gray-100 py-8 px-4 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleCancel}
          className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <ArrowLeft size={20} /> Back
        </button>

        {/* Alert Messages */}
        {alert && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center justify-between ${
              alert.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <div className="flex items-center gap-3">
              {alert.type === 'success' ? (
                <CheckCircle className="text-green-600" size={24} />
              ) : (
                <AlertCircle className="text-red-600" size={24} />
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
            <button
              onClick={() => setAlert(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        )}

        {/* Content */}
        {isEditing ? (
          <ProductFormComponent
            initialData={product}
            onSubmit={handleUpdate}
            isLoading={isSubmitting}
            onCancel={handleCancel}
            isEditing={true}
          />
        ) : (
          <ProductDetailView product={product} onEdit={() => {
            router.push(`/dashboard/all-product/${productId}?edit=true`);
          }} />
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default ProductDetailPage;
