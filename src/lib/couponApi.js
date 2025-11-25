/**
 * Coupon API utilities
 */

export const couponApi = {
  /**
   * Get all coupons
   */
  async getCoupons(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.isActive !== undefined) params.append('isActive', filters.isActive);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await fetch(`/api/coupon?${params}`, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) throw new Error('Failed to fetch coupons');
    return response.json();
  },

  /**
   * Get a single coupon
   */
  async getCoupon(id) {
    const response = await fetch(`/api/coupon/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) throw new Error('Failed to fetch coupon');
    return response.json();
  },

  /**
   * Create a new coupon
   */
  async createCoupon(data) {
    const response = await fetch('/api/coupon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create coupon');
    }
    return response.json();
  },

  /**
   * Update a coupon
   */
  async updateCoupon(id, data) {
    const response = await fetch(`/api/coupon/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update coupon');
    }
    return response.json();
  },

  /**
   * Delete a coupon
   */
  async deleteCoupon(id) {
    const response = await fetch(`/api/coupon/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete coupon');
    }
    return response.json();
  },

  /**
   * Restore a deleted coupon
   */
  async restoreCoupon(id) {
    const response = await fetch(`/api/coupon/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to restore coupon');
    }
    return response.json();
  },

  /**
   * Validate a coupon code for an order
   */
  async validateCoupon(code, orderData) {
    const response = await fetch('/api/coupon/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, orderData })
    });

    return response.json();
  }
};

export function formatCouponDiscount(coupon) {
  if (coupon.discountType === 'percentage') {
    return `${coupon.discountValue}% OFF`;
  } else {
    return `₦${coupon.discountValue.toLocaleString()} OFF`;
  }
}

export function formatDateRange(startDate, endDate) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const start = new Date(startDate).toLocaleDateString('en-US', options);
  const end = new Date(endDate).toLocaleDateString('en-US', options);
  return `${start} - ${end}`;
}

export function isValidCoupon(coupon) {
  const now = new Date();
  return coupon.isActive && new Date(coupon.startDate) <= now && new Date(coupon.endDate) >= now;
}

export default couponApi;
