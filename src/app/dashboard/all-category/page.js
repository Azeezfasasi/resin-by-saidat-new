'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, AlertCircle, Image as ImageIcon } from 'lucide-react';
import categoryApi from '@/lib/categoryApi';

export default function AllCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, [search, page]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await categoryApi.getCategories({
        search: search || undefined,
        page,
        limit: 20
      });
      setCategories(data.categories);
      setTotalPages(data.pagination.pages);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await categoryApi.deleteCategory(id);
      setCategories(categories.filter(c => c._id !== id));
      setDeleteId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-0 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Categories</h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">Manage product categories</p>
          </div>
          <Link
            href="/dashboard/all-category/add"
            className="flex items-center gap-2 bg-[#7b3306] text-white px-3 md:px-4 py-2 rounded-lg hover:bg-[#4a1e02] transition text-sm md:text-base w-full md:w-auto justify-center md:justify-start"
          >
            <Plus size={18} />
            Add Category
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6 flex items-center gap-2 bg-white rounded-lg shadow px-3 md:px-4 py-2 md:py-3">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by name or description..."
            value={search}
            onChange={handleSearch}
            className="flex-1 outline-none text-sm md:text-base"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-3 md:p-4">
            <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={18} />
            <div>
              <p className="font-semibold text-red-900 text-sm md:text-base">{error}</p>
            </div>
          </div>
        )}

        {/* Table - Desktop View */}
        <div className="bg-white rounded-lg shadow overflow-hidden hidden md:block">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600 mb-4">No categories found</p>
              <Link
                href="/dashboard/all-category/add"
                className="text-[#7b3306] hover:text-[#4a1e02] font-medium"
              >
                Create your first category
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold text-gray-900 text-sm">Name</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-900 text-sm">Image</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-900 text-sm">Products</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-900 text-sm">Status</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-900 text-sm">Created</th>
                  <th className="text-right px-6 py-3 font-semibold text-gray-900 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{category.name}</p>
                        <p className="text-xs text-gray-500">{category.slug}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {category.image?.url ? (
                        <img
                          src={category.image.url}
                          alt={category.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
                          <ImageIcon size={16} className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{category.productCount || 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          category.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {new Date(category.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/dashboard/all-category/${category._id}`}
                          className="p-2 text-[#7b3306] hover:bg-[#f3e6d9] rounded transition"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(category._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Mobile Card View */}
        {!loading && categories.length > 0 && (
          <div className="md:hidden space-y-3">
            {categories.map((category) => (
              <div key={category._id} className="bg-white rounded-lg shadow p-4">
                <div className="flex gap-3 mb-3">
                  {category.image?.url ? (
                    <img
                      src={category.image.url}
                      alt={category.name}
                      className="w-16 h-16 rounded object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded bg-gray-200 flex items-center justify-center shrink-0">
                      <ImageIcon size={20} className="text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">{category.name}</h3>
                    <p className="text-xs text-gray-500">{category.slug}</p>
                    <div className="flex gap-2 mt-2 items-center">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          category.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-xs text-gray-600">{category.productCount || 0} products</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-3">
                  Created: {new Date(category.createdAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/all-category/${category._id}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#7b3306] text-white px-3 py-2 rounded-lg hover:bg-[#4a1e02] transition text-sm"
                  >
                    <Edit size={16} />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition text-sm"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State - Mobile */}
        {!loading && categories.length === 0 && (
          <div className="md:hidden bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4 text-sm">No categories found</p>
            <Link
              href="/dashboard/all-category/add"
              className="text-[#7b3306] hover:text-[#4a1e02] font-medium text-sm"
            >
              Create your first category
            </Link>
          </div>
        )}

        {/* Loading State - Mobile */}
        {loading && (
          <div className="md:hidden bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 text-sm">Loading categories...</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 md:px-4 py-2 rounded border border-gray-300 text-gray-700 disabled:opacity-50 text-sm md:text-base"
            >
              Previous
            </button>
            <span className="px-3 md:px-4 py-2 text-sm md:text-base">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 md:px-4 py-2 rounded border border-gray-300 text-gray-700 disabled:opacity-50 text-sm md:text-base"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
