/**
 * Category API utilities
 */

export const categoryApi = {
  /**
   * Get all categories
   */
  async getCategories(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.parentId) params.append('parentId', filters.parentId);
    if (filters.isActive !== undefined) params.append('isActive', filters.isActive);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await fetch(`/api/category?${params}`, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  /**
   * Get a single category
   */
  async getCategory(id) {
    const response = await fetch(`/api/category/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) throw new Error('Failed to fetch category');
    return response.json();
  },

  /**
   * Create a new category
   */
  async createCategory(formData) {
    const response = await fetch('/api/category', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create category');
    }
    return response.json();
  },

  /**
   * Update a category
   */
  async updateCategory(id, formData) {
    const response = await fetch(`/api/category/${id}`, {
      method: 'PUT',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update category');
    }
    return response.json();
  },

  /**
   * Delete a category
   */
  async deleteCategory(id) {
    const response = await fetch(`/api/category/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete category');
    }
    return response.json();
  },

  /**
   * Restore a deleted category
   */
  async restoreCategory(id) {
    const response = await fetch(`/api/category/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to restore category');
    }
    return response.json();
  }
};

export default categoryApi;
