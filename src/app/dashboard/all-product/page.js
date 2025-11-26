'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Archive,
  RotateCcw,
  Download,
} from 'lucide-react';
import { useState as useStateModal } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const AllProductsPage = () => {
  const router = useRouter();

  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showActions, setShowActions] = useState(null);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      let url = '/api/product?limit=100';

      if (filterStatus !== 'all') {
        url += `&status=${filterStatus}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch products');
      }

      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setAlert({
        type: 'error',
        message: 'Failed to load products. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle delete
  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`/api/product/${productId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete product');
      }

      setAlert({
        type: 'success',
        message: 'Product deleted successfully!',
      });

      setDeleteConfirm(null);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      setAlert({
        type: 'error',
        message: error.message || 'Failed to delete product.',
      });
    }
  };

  // Handle restore
  const handleRestore = async (productId) => {
    try {
      const response = await fetch(`/api/product/${productId}/restore`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to restore product');
      }

      setAlert({
        type: 'success',
        message: 'Product restored successfully!',
      });

      setShowActions(null);
      fetchProducts();
    } catch (error) {
      console.error('Error restoring product:', error);
      setAlert({
        type: 'error',
        message: error.message || 'Failed to restore product.',
      });
    }
  };

  // Search and filter
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Calculate statistics
  const stats = {
    total: products.length,
    published: products.filter((p) => p.status === 'published').length,
    draft: products.filter((p) => p.status === 'draft').length,
    lowStock: products.filter((p) => p.stock <= p.lowStockThreshold).length,
  };

  const clearAlert = () => {
    setAlert(null);
  };

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(clearAlert, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  return (
    <ProtectedRoute allowedRoles={['admin', 'staff-member']}>
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-600 mt-1">
                Manage your product catalog
              </p>
            </div>
            <Link
              href="/dashboard/add-product"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <Plus size={20} /> Add Product
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Alert */}
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
                <CheckCircle className="text-green-600 shrink-0" size={24} />
              ) : (
                <AlertCircle className="text-red-600 shrink-0" size={24} />
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
              onClick={clearAlert}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Products" value={stats.total} color="blue" />
          <StatCard label="Published" value={stats.published} color="green" />
          <StatCard label="Drafts" value={stats.draft} color="amber" />
          <StatCard label="Low Stock" value={stats.lowStock} color="red" />
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, SKU, or category..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

            {/* Filter by Status */}
            <div className="flex gap-2 items-center">
              <Filter size={20} className="text-gray-600" />
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              >
                <option value="all">All Products</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-200">
            <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 font-medium">No products found</p>
            <p className="text-gray-500 text-sm mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      PRODUCT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      CATEGORY
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      PRICE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      STOCK
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      STATUS
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      RATING
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50 transition">
                      {/* Product */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {product.thumbnail ? (
                            <Image
                              src={product.thumbnail}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="w-10 h-10 object-cover rounded"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-xs text-gray-500">No img</span>
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {product.sku}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {product.category}
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">
                            ₦{product.basePrice?.toLocaleString()}
                          </p>
                          {product.salePrice && (
                            <p className="text-xs text-green-600">
                              Sale: ₦{product.salePrice?.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              product.stock > product.lowStockThreshold
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {product.stock}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            product.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : product.status === 'scheduled'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {product.status?.charAt(0).toUpperCase() +
                            product.status?.slice(1)}
                        </span>
                      </td>

                      {/* Rating */}
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {product.averageRating ? (
                          <div className="flex items-center gap-1">
                            <span className="font-semibold">
                              {product.averageRating?.toFixed(1)}
                            </span>
                            <span className="text-yellow-500">★</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">No reviews</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => router.push(`/dashboard/all-product/${product._id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                            title="View"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() =>
                              router.push(`/dashboard/all-product/${product._id}?edit=true`)
                            }
                            className="p-2 text-green-600 hover:bg-green-50 rounded transition"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(product._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {paginatedProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                >
                  <div className="flex gap-3 mb-4">
                    {product.thumbnail ? (
                      <Image
                        src={product.thumbnail}
                        alt={product.name}
                        width={60}
                        height={60}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-500">No img</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500">{product.sku}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {product.category}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                    <div>
                      <p className="text-gray-600">Price</p>
                      <p className="font-semibold">
                        ₦{product.basePrice?.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Stock</p>
                      <p
                        className={`font-semibold ${
                          product.stock > product.lowStockThreshold
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {product.stock}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : product.status === 'scheduled'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {product.status?.charAt(0).toUpperCase() +
                        product.status?.slice(1)}
                    </span>
                    {product.averageRating && (
                      <div className="flex items-center gap-1 text-sm">
                        <span className="font-semibold">
                          {product.averageRating?.toFixed(1)}
                        </span>
                        <span className="text-yellow-500">★</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/dashboard/all-product/${product._id}`)}
                      className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded text-sm font-medium hover:bg-blue-100 transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() =>
                        router.push(`/dashboard/all-product/${product._id}?edit=true`)
                      }
                      className="flex-1 px-3 py-2 bg-green-50 text-green-600 rounded text-sm font-medium hover:bg-green-100 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(product._id)}
                      className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded text-sm font-medium hover:bg-red-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8 px-6 py-4 bg-white rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing{' '}
                  <span className="font-semibold">
                    {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredProducts.length)}
                  </span>{' '}
                  of <span className="font-semibold">{filteredProducts.length}</span>{' '}
                  products
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Delete Product?</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDelete(deleteConfirm);
                  setDeleteConfirm(null);
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </ProtectedRoute>
  );
};

// Stat Card Component
const StatCard = ({ label, value, color }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    red: 'bg-red-50 text-red-600 border-red-200',
  };

  return (
    <div
      className={`${colors[color]} border rounded-lg p-4 md:p-6`}
    >
      <p className="text-sm font-medium opacity-75">{label}</p>
      <p className="text-2xl md:text-3xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default AllProductsPage;
