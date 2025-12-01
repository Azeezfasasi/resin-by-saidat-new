// Orders API utilities and helper functions
export const orderStatuses = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  { value: 'processing', label: 'Processing', color: 'bg-purple-100 text-purple-800' },
  { value: 'shipped', label: 'Shipped', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  { value: 'refunded', label: 'Refunded', color: 'bg-gray-100 text-gray-800' }
];

export const paymentStatuses = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
  { value: 'failed', label: 'Failed', color: 'bg-red-100 text-red-800' },
  { value: 'refunded', label: 'Refunded', color: 'bg-gray-100 text-gray-800' }
];

/**
 * Fetch all orders with filtering, sorting, and pagination
 */
export const getOrders = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await fetch(`/api/order?${params}`, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) throw new Error('Failed to fetch orders');
    return await response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

/**
 * Fetch a single order by ID
 */
export const getOrderById = async (orderId) => {
  try {
    const response = await fetch(`/api/order/${orderId}`, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) throw new Error('Failed to fetch order');
    return await response.json();
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (orderId, status, notifyCustomer = true) => {
  try {
    const response = await fetch(`/api/order/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        status,
        notifyCustomer 
      })
    });

    if (!response.ok) throw new Error('Failed to update order status');
    return await response.json();
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

/**
 * Add note to order
 */
export const addOrderNote = async (orderId, note, type = 'internal') => {
  try {
    const response = await fetch(`/api/order/${orderId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        text: note,
        type // 'internal' or 'customer'
      })
    });

    if (!response.ok) throw new Error('Failed to add note');
    return await response.json();
  } catch (error) {
    console.error('Error adding note:', error);
    throw error;
  }
};

/**
 * Get order notes
 */
export const getOrderNotes = async (orderId) => {
  try {
    const response = await fetch(`/api/order/${orderId}/notes`, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) throw new Error('Failed to fetch notes');
    return await response.json();
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};

/**
 * Send order notification email
 */
export const sendOrderEmail = async (orderId, templateType = 'confirmation') => {
  try {
    const response = await fetch(`/api/order/${orderId}/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateType })
    });

    if (!response.ok) throw new Error('Failed to send email');
    return await response.json();
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

/**
 * Format currency
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'NGN'
  }).format(price);
};

/**
 * Format date
 */
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

/**
 * Get status badge color
 */
export const getStatusColor = (status, type = 'order') => {
  const statuses = type === 'payment' ? paymentStatuses : orderStatuses;
  const found = statuses.find(s => s.value === status);
  return found ? found.color : 'bg-gray-100 text-gray-800';
};

/**
 * Get status label
 */
export const getStatusLabel = (status, type = 'order') => {
  const statuses = type === 'payment' ? paymentStatuses : orderStatuses;
  const found = statuses.find(s => s.value === status);
  return found ? found.label : status;
};

/**
 * Calculate order summary
 */
export const calculateOrderSummary = (order) => {
  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = order.tax || (subtotal * 0.1);
  const shipping = order.shippingCost || 0;
  const total = subtotal + tax + shipping;

  return {
    subtotal,
    tax,
    shipping,
    total,
    discount: order.discount || 0
  };
};

/**
 * Check if order can be cancelled
 */
export const canCancelOrder = (status) => {
  return ['pending', 'confirmed'].includes(status);
};

/**
 * Check if order can be refunded
 */
export const canRefundOrder = (paymentStatus) => {
  return paymentStatus === 'completed';
};
