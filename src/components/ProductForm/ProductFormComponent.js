'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Upload,
  X,
  AlertCircle,
  Loader2,
  ChevronDown,
  Plus,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';

const ProductFormComponent = ({
  initialData = null,
  onSubmit,
  isLoading = false,
  onCancel,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState(
    initialData ? {
      name: initialData.name || '',
      slug: initialData.slug || '',
      description: initialData.description || '',
      shortDescription: initialData.shortDescription || '',
      category: initialData.category || '',
      subcategory: initialData.subcategory || '',
      brand: initialData.brand || '',
      basePrice: initialData.basePrice || '',
      salePrice: initialData.salePrice || '',
      discountPercent: initialData.discountPercent || '',
      stock: initialData.stock || '',
      lowStockThreshold: initialData.lowStockThreshold || '',
      sku: initialData.sku || '',
      barcode: initialData.barcode || '',
      weight: initialData.weight || { value: '', unit: 'kg' },
      dimensions: initialData.dimensions || {
        length: '',
        width: '',
        height: '',
        unit: 'cm',
      },
      attributes: initialData.attributes || [],
      featured: initialData.featured || false,
      status: initialData.status || 'draft',
      existingImages: (initialData.images || []).map(img => ({
        url: img.url,
        name: img.alt || 'product image',
        publicId: img.publicId,
        isExisting: true,
      })) || [],
      newImages: [],
    } : {
      name: '',
      slug: '',
      description: '',
      shortDescription: '',
      category: '',
      subcategory: '',
      brand: '',
      basePrice: '',
      salePrice: '',
      discountPercent: '',
      stock: '',
      lowStockThreshold: '',
      sku: '',
      barcode: '',
      weight: { value: '', unit: 'kg' },
      dimensions: {
        length: '',
        width: '',
        height: '',
        unit: 'cm',
      },
      attributes: [],
      featured: false,
      status: 'draft',
      existingImages: [],
      newImages: [],
    }
  );

  const [errors, setErrors] = useState({});
  const [uploadingImages, setUploadingImages] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const fileInputRef = useRef(null);
  const [attributeInput, setAttributeInput] = useState({
    name: '',
    value: '',
  });

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await fetch('/api/category?limit=100');
        const data = await response.json();
        
        const activeCategories = data.categories
          .filter(cat => cat.isActive && !cat.deletedAt)
          .sort((a, b) => a.name.localeCompare(b.name));
        
        setCategories(activeCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle nested object changes
  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  // Auto-calculate discount percent
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    handleInputChange(e);

    if (name === 'basePrice' || name === 'salePrice') {
      const basePrice = parseFloat(
        name === 'basePrice' ? value : formData.basePrice
      );
      const salePrice = parseFloat(
        name === 'salePrice' ? value : formData.salePrice
      );

      if (basePrice && salePrice && salePrice < basePrice) {
        const discountPercent = Math.round(
          ((basePrice - salePrice) / basePrice) * 100
        );
        setFormData((prev) => ({
          ...prev,
          discountPercent: discountPercent.toString(),
        }));
      }
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingImages(true);

    // Create previews for new images
    const newPreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      file,
      isExisting: false,
    }));

    setFormData((prev) => {
      // Add new files to newImages array
      const updatedNewImages = [...prev.newImages, ...files];
      // Add new previews to existingImages for display
      const updatedExistingImages = [...prev.existingImages, ...newPreviews];
      
      return {
        ...prev,
        newImages: updatedNewImages,
        existingImages: updatedExistingImages,
      };
    });

    setUploadingImages(false);
    fileInputRef.current.value = '';
  };

  // Remove image
  const removeImage = (index) => {
    setFormData((prev) => {
      const existingImages = [...prev.existingImages];
      const removedImage = existingImages[index];
      
      existingImages.splice(index, 1);
      
      // If it's a new image (not existing), remove from newImages too
      let newImages = [...prev.newImages];
      if (!removedImage.isExisting && removedImage.file) {
        newImages = newImages.filter(img => img !== removedImage.file);
      }
      
      return {
        ...prev,
        existingImages,
        newImages,
      };
    });
  };

  // Add attribute
  const addAttribute = () => {
    if (attributeInput.name && attributeInput.value) {
      setFormData((prev) => ({
        ...prev,
        attributes: [
          ...prev.attributes,
          { ...attributeInput, id: Date.now() },
        ],
      }));
      setAttributeInput({ name: '', value: '' });
    }
  };

  // Remove attribute
  const removeAttribute = (id) => {
    setFormData((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((attr) => attr.id !== id),
    }));
  };

  // Add delivery location
  const addDeliveryLocation = () => {
    if (
      deliveryInput.locationId &&
      deliveryInput.name &&
      deliveryInput.shippingCost
    ) {
      setFormData((prev) => ({
        ...prev,
        deliveryLocations: [
          ...prev.deliveryLocations,
          { ...deliveryInput, id: Date.now() },
        ],
      }));
      setDeliveryInput({
        locationId: '',
        name: '',
        shippingCost: '',
        estimatedDays: '',
      });
    }
  };

  // Remove delivery location
  const removeDeliveryLocation = (id) => {
    setFormData((prev) => ({
      ...prev,
      deliveryLocations: prev.deliveryLocations.filter((loc) => loc.id !== id),
    }));
  };

  // Generate slug from name
  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData((prev) => ({
      ...prev,
      slug,
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description.trim())
      newErrors.description = 'Description is required';
    if (!formData.basePrice) newErrors.basePrice = 'Base price is required';
    if (!formData.stock) newErrors.stock = 'Stock quantity is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Prepare form data with images
    const submitData = new FormData();

    // Add text fields
    Object.keys(formData).forEach((key) => {
      if (key !== 'existingImages' && key !== 'newImages') {
        if (typeof formData[key] === 'object') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          submitData.append(key, formData[key]);
        }
      }
    });

    // Add existing images data (for the backend to keep them)
    const existingImageIds = formData.existingImages
      .filter(img => img.isExisting)
      .map(img => ({
        url: img.url,
        publicId: img.publicId,
      }));
    if (existingImageIds.length > 0) {
      submitData.append('existingImages', JSON.stringify(existingImageIds));
    }

    // Add new images files - log to verify
    console.log('Submitting new images:', formData.newImages.length);
    formData.newImages.forEach((image, index) => {
      if (image instanceof File) {
        console.log(`Adding image ${index}:`, image.name);
        submitData.append('images', image);
      }
    });

    await onSubmit(submitData);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">
        {isEditing ? 'Edit Product' : 'Add New Product'}
      </h1>
      <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8">
        {isEditing
          ? 'Update product details and information'
          : 'Create a new product with complete details'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
        {/* Basic Information */}
        <div className="border-t pt-6 md:pt-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 md:mb-6">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Product Name */}
            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={generateSlug}
                placeholder="Enter product name"
                className={`w-full px-3 md:px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#7b3306] outline-none transition ${
                  errors.name
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs md:text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.name}
                </p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                URL Slug * <span className='text-xs md:text-sm'>(auto-generated)</span>
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                readOnly
                placeholder="auto-generated-from-name"
                className={`w-full px-3 md:px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#7b3306] outline-none transition ${
                  errors.slug
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300'
                }`}
              />
              {errors.slug && (
                <p className="text-red-500 text-xs md:text-sm mt-1">Auto-generated slug</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                disabled={loadingCategories}
                className={`w-full px-3 md:px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#7b3306] outline-none transition ${
                  errors.category
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300'
                } ${loadingCategories ? 'bg-gray-100' : ''}`}
              >
                <option value="">{loadingCategories ? 'Loading...' : 'Select Category'}</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-xs md:text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.category}
                </p>
              )}
            </div>

            {/* Subcategory */}
            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                Subcategory
              </label>
              <input
                type="text"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleInputChange}
                placeholder="Enter subcategory"
                className="w-full px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] outline-none transition"
              />
            </div>

            {/* Brand */}
            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="Enter brand name"
                className="w-full px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] outline-none transition"
              />
            </div>

            {/* SKU */}
            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                SKU <span className='text-xs md:text-sm text-green-700 font-normal'>(Auto-generated)</span>
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                placeholder="Auto-generated from product name"
                readOnly
                className="w-full px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Auto-generated when you create the product</p>
            </div>
          </div>

          {/* Short Description */}
          <div className="mt-6">
            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
              Short Description
            </label>
            <input
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleInputChange}
              placeholder="Brief product summary (max 160 characters)"
              maxLength={160}
              className="w-full px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] outline-none transition"
            />
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              {formData.shortDescription.length}/160 characters
            </p>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
              Full Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter detailed product description"
              rows={6}
              className={`w-full px-3 md:px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#7b3306] outline-none transition resize-none ${
                errors.description
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs md:text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={14} /> {errors.description}
              </p>
            )}
          </div>
        </div>

        {/* Pricing Information */}
        <div className="border-t pt-6 md:pt-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 md:mb-6">
            Pricing
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {/* Base Price */}
            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                Base Price *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">₦</span>
                <input
                  type="number"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handlePriceChange}
                  placeholder="0.00"
                  step="0.01"
                  className={`w-full pl-8 pr-3 md:pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#7b3306] outline-none transition text-sm ${
                    errors.basePrice
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.basePrice && (
                <p className="text-red-500 text-xs md:text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.basePrice}
                </p>
              )}
            </div>

            {/* Sale Price */}
            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                Sale Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">₦</span>
                <input
                  type="number"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handlePriceChange}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full pl-8 pr-3 md:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] outline-none transition text-sm"
                />
              </div>
            </div>

            {/* Discount Percent */}
            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                Discount %
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="discountPercent"
                  value={formData.discountPercent}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] outline-none transition text-sm"
                  disabled
                />
                <span className="absolute right-3 top-2 text-gray-500">%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Auto-calculated</p>
            </div>
          </div>
        </div>

        {/* Stock Information */}
        <div className="border-t pt-6 md:pt-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 md:mb-6">
            Inventory
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {/* Stock */}
            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="0"
                className={`w-full px-3 md:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#7b3306] outline-none transition text-sm ${
                  errors.stock
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300'
                }`}
              />
              {errors.stock && (
                <p className="text-red-500 text-xs md:text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.stock}
                </p>
              )}
            </div>

            {/* Low Stock Threshold */}
            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                Low Stock Alert
              </label>
              <input
                type="number"
                name="lowStockThreshold"
                value={formData.lowStockThreshold}
                onChange={handleInputChange}
                placeholder="5"
                className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] outline-none transition text-sm"
              />
            </div>

            {/* Barcode */}
            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                Barcode <span className='text-xs md:text-sm text-green-700 font-normal'>(Auto-generated)</span>
              </label>
              <input
                type="text"
                name="barcode"
                value={formData.barcode}
                onChange={handleInputChange}
                placeholder="Auto-generated barcode"
                readOnly
                className="w-full px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Auto-generated when you create the product</p>
            </div>
          </div>
        </div>

        {/* Weight & Dimensions */}
        <div className="border-t pt-6 md:pt-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 md:mb-6">
            Weight & Dimensions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 md:gap-6">
            {/* Weight */}
            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                Weight
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={formData.weight.value}
                  onChange={(e) =>
                    handleNestedChange('weight', 'value', e.target.value)
                  }
                  placeholder="0.00"
                  step="0.01"
                  className="flex-1 px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] outline-none transition text-sm"
                />
                <select
                  value={formData.weight.unit}
                  onChange={(e) =>
                    handleNestedChange('weight', 'unit', e.target.value)
                  }
                  className="px-2 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] outline-none transition text-sm"
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="lb">lb</option>
                </select>
              </div>
            </div>

            {/* Dimensions */}
            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                Dimensions (L × W × H)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  value={formData.dimensions.length}
                  onChange={(e) =>
                    handleNestedChange('dimensions', 'length', e.target.value)
                  }
                  placeholder="Length"
                  step="0.01"
                  className="px-2 md:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] outline-none transition text-xs md:text-sm"
                />
                <input
                  type="number"
                  value={formData.dimensions.width}
                  onChange={(e) =>
                    handleNestedChange('dimensions', 'width', e.target.value)
                  }
                  placeholder="Width"
                  step="0.01"
                  className="px-2 md:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] outline-none transition text-xs md:text-sm"
                />
                <input
                  type="number"
                  value={formData.dimensions.height}
                  onChange={(e) =>
                    handleNestedChange('dimensions', 'height', e.target.value)
                  }
                  placeholder="Height"
                  step="0.01"
                  className="px-2 md:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] outline-none transition text-xs md:text-sm"
                />
              </div>
              <select
                value={formData.dimensions.unit}
                onChange={(e) =>
                  handleNestedChange('dimensions', 'unit', e.target.value)
                }
                className="mt-2 w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] outline-none transition text-sm"
              >
                <option value="cm">cm</option>
                <option value="in">in</option>
                <option value="m">m</option>
              </select>
            </div>
          </div>
        </div>

        {/* Attributes */}
        <div className="border-t pt-6 md:pt-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 md:mb-6">
            Attributes
          </h2>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={attributeInput.name}
                onChange={(e) =>
                  setAttributeInput({ ...attributeInput, name: e.target.value })
                }
                placeholder="e.g., Size"
                className="flex-1 px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] outline-none transition text-sm"
              />
              <input
                type="text"
                value={attributeInput.value}
                onChange={(e) =>
                  setAttributeInput({
                    ...attributeInput,
                    value: e.target.value,
                  })
                }
                placeholder="e.g., Large"
                className="flex-1 px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] outline-none transition text-sm"
              />
              <button
                type="button"
                onClick={addAttribute}
                className="px-3 md:px-4 py-2 bg-[#7b3306] text-white rounded-lg hover:bg-[#4a1e02] transition flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <Plus size={18} /> Add
              </button>
            </div>

            {formData.attributes.length > 0 && (
              <div className="space-y-2">
                {formData.attributes.map((attr) => (
                  <div
                    key={attr.id}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded-lg text-sm"
                  >
                    <span className="font-medium text-gray-700">
                      {attr.name}: <span className="text-[#7b3306]">{attr.value}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAttribute(attr.id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Images */}
        <div className="border-t pt-6 md:pt-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 md:mb-6">
            Product Images
          </h2>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-[#7b3306] rounded-lg p-4 md:p-8 bg-[#f7ede2] hover:border-[#7b3306] transition cursor-pointer">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center justify-center gap-3"
              >
                {uploadingImages ? (
                  <>
                    <Loader2 className="animate-spin text-[#7b3306]" size={28} />
                    <span className="text-[#7b3306] font-medium text-sm md:text-base">
                      Uploading...
                    </span>
                  </>
                ) : (
                  <>
                    <Upload className="text-[#7b3306]" size={28} />
                    <span className="text-center">
                      <p className="font-semibold text-gray-900 text-sm md:text-base">
                        Click to upload images
                      </p>
                      <p className="text-xs md:text-sm text-gray-600">
                        or drag and drop (PNG, JPG, GIF up to 5MB)
                      </p>
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Image Preview Grid */}
            {formData.existingImages.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {formData.existingImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative group rounded-lg overflow-hidden bg-gray-100"
                  >
                    <Image
                      src={image.url}
                      alt={`Preview ${index}`}
                      width={150}
                      height={150}
                      className="w-full h-32 md:h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="flex items-center justify-center"
                      >
                        <X className="text-white" size={20} />
                      </button>
                    </div>
                    {image.isExisting && (
                      <span className="absolute top-1 right-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        Existing
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Status & Featured */}
        <div className="border-t pt-6 md:pt-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 md:mb-6">
            Visibility & Status
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 md:gap-6">
            {/* Status */}
            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] outline-none transition text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>

            {/* Featured */}
            <div className="flex items-center gap-3 pt-2 md:pt-6">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="w-4 h-4 md:w-5 md:h-5 text-[#7b3306] rounded focus:ring-2 focus:ring-[#7b3306] cursor-pointer"
              />
              <label className="text-xs md:text-sm font-semibold text-gray-700 cursor-pointer">
                Mark as Featured Product
              </label>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="border-t pt-6 md:pt-8 flex flex-col sm:flex-row justify-end gap-3 md:gap-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 md:px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm md:text-base"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 md:px-8 py-2 bg-[#7b3306] text-white rounded-lg hover:bg-[#4a1e02] transition font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
          >
            {isLoading && <Loader2 className="animate-spin" size={18} />}
            {isEditing ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductFormComponent;
