'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Upload, AlertCircle } from 'lucide-react';
import { use } from 'react';
import categoryApi from '@/lib/categoryApi';

export default function CategoryDetails({ params }) {
  const { id } = use(params);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: [],
    displayOrder: 0,
    isActive: true
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isEdit = id && id !== 'add';

  useEffect(() => {
    if (isEdit) {
      fetchCategory();
    } else {
      setLoading(false);
    }
  }, [id, isEdit]);

  const fetchCategory = async () => {
    try {
      const data = await categoryApi.getCategory(id);
      const { category } = data;
      setFormData({
        name: category.name,
        description: category.description || '',
        metaTitle: category.metaTitle || '',
        metaDescription: category.metaDescription || '',
        metaKeywords: category.metaKeywords || [],
        displayOrder: category.displayOrder || 0,
        isActive: category.isActive !== false
      });
      if (category.image?.url) {
        setCurrentImage(category.image);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleKeywordChange = (e, index) => {
    const newKeywords = [...formData.metaKeywords];
    newKeywords[index] = e.target.value;
    setFormData((prev) => ({ ...prev, metaKeywords: newKeywords }));
  };

  const addKeyword = () => {
    setFormData((prev) => ({
      ...prev,
      metaKeywords: [...prev.metaKeywords, '']
    }));
  };

  const removeKeyword = (index) => {
    setFormData((prev) => ({
      ...prev,
      metaKeywords: prev.metaKeywords.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const submitFormData = new FormData();
      submitFormData.append('name', formData.name);
      submitFormData.append('description', formData.description);
      submitFormData.append('metaTitle', formData.metaTitle);
      submitFormData.append('metaDescription', formData.metaDescription);
      submitFormData.append('metaKeywords', JSON.stringify(formData.metaKeywords));
      submitFormData.append('displayOrder', formData.displayOrder);
      submitFormData.append('isActive', formData.isActive);

      if (imageFile) {
        submitFormData.append('image', imageFile);
      }

      let response;
      if (isEdit) {
        response = await categoryApi.updateCategory(id, submitFormData);
      } else {
        response = await categoryApi.createCategory(submitFormData);
      }

      setSuccess(isEdit ? 'Category updated successfully!' : 'Category created successfully!');
      
      if (!isEdit) {
        // Reset form for new category
        setFormData({
          name: '',
          description: '',
          metaTitle: '',
          metaDescription: '',
          metaKeywords: [],
          displayOrder: 0,
          isActive: true
        });
        setImageFile(null);
        setImagePreview(null);
      } else {
        setCurrentImage(response.category.image);
        setImageFile(null);
        setImagePreview(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Link
          href="/dashboard/all-category"
          className="flex items-center gap-2 text-[#7b3306] hover:text-[#4a1e02] font-medium mb-6"
        >
          <ChevronLeft size={20} />
          Back to Categories
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isEdit ? 'Edit Category' : 'Add New Category'}
        </h1>
        <p className="text-gray-600 mb-8">
          {isEdit ? 'Update category details' : 'Create a new product category'}
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
            <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] outline-none"
                  placeholder="e.g., Electronics"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] outline-none"
                  placeholder="Category description..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="displayOrder"
                    value={formData.displayOrder}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mt-6">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    Active Category
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Category Image */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Category Image</h2>

            <div className="space-y-4">
              {/* Current Image */}
              {currentImage && !imagePreview && (
                <div className="flex items-center gap-4">
                  <img
                    src={currentImage.url}
                    alt={formData.name}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <div>
                    <p className="text-sm text-gray-600">Current image</p>
                    <button
                      type="button"
                      onClick={() => setCurrentImage(null)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              {/* Image Preview */}
              {imagePreview && (
                <div className="flex items-center gap-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <p className="text-sm text-gray-600">New image preview</p>
                </div>
              )}

              {/* Upload Input */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#7b3306] transition cursor-pointer">
                <label htmlFor="image" className="cursor-pointer block">
                  <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-sm font-medium text-gray-900">Upload image</p>
                  <p className="text-xs text-gray-600">PNG, JPG, GIF up to 5MB</p>
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* SEO Information */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">SEO Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleInputChange}
                  maxLength="160"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] outline-none"
                  placeholder="Meta title for SEO"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.metaTitle.length}/160
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Meta Description
                </label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleInputChange}
                  maxLength="160"
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] outline-none"
                  placeholder="Meta description for SEO"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.metaDescription.length}/160
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-gray-900">Meta Keywords</label>
                  <button
                    type="button"
                    onClick={addKeyword}
                    className="text-[#7b3306] hover:text-[#4a1e02] text-sm font-medium"
                  >
                    + Add keyword
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.metaKeywords.map((keyword, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={keyword}
                        onChange={(e) => handleKeywordChange(e, index)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] outline-none"
                        placeholder="Enter keyword"
                      />
                      <button
                        type="button"
                        onClick={() => removeKeyword(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="border-t pt-6 flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-[#7b3306] text-white py-3 rounded-lg hover:bg-[#4a1e02] transition font-semibold disabled:bg-gray-400"
            >
              {submitting
                ? 'Saving...'
                : isEdit
                ? 'Update Category'
                : 'Create Category'}
            </button>
            <Link
              href="/dashboard/all-category"
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:border-gray-400 transition font-semibold text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
