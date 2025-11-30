/**
 * Email Templates for Order System
 * HTML templates for customer and admin notifications
 */

export const orderConfirmationTemplate = (order) => {
  const itemsHTML = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">
        ${item.name} (SKU: ${item.sku})
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: right;">
        ₦${item.price.toLocaleString()}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: right;">
        ₦${(item.price * item.quantity).toLocaleString()}
      </td>
    </tr>
  `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background-color: #f9fafb; padding: 20px; }
        .section { margin-bottom: 20px; }
        .order-items { width: 100%; border-collapse: collapse; background-color: white; }
        .order-items th { background-color: #e5e7eb; padding: 10px; text-align: left; font-weight: bold; }
        .totals { background-color: white; padding: 15px; margin-top: 10px; border-radius: 5px; }
        .total-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e0e0e0; }
        .total-row.final { border-bottom: 2px solid #2563eb; font-weight: bold; font-size: 18px; color: #2563eb; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; background-color: #f3f4f6; border-radius: 0 0 5px 5px; }
        .button { display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px; }
        .address-box { background-color: white; padding: 15px; border-radius: 5px; margin-bottom: 10px; }
        .label { font-weight: bold; color: #1f2937; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✓ Order Confirmed</h1>
          <p>Order Number: <strong>${order.orderNumber}</strong></p>
        </div>

        <div class="content">
          <!-- Customer Greeting -->
          <div class="section">
            <p>Hi ${order.customerInfo.firstName} ${order.customerInfo.lastName},</p>
            <p>Thank you for your order! We've received your order and it will be processed shortly.</p>
          </div>

          <!-- Order Details -->
          <div class="section">
            <h2 style="color: #1f2937; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">Order Details</h2>
            <p><span class="label">Order Number:</span> ${order.orderNumber}</p>
            <p><span class="label">Order Date:</span> ${new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><span class="label">Payment Method:</span> ${order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}</p>
            <p><span class="label">Payment Status:</span> <span style="color: #f59e0b;">${order.paymentStatus.toUpperCase()}</span></p>
          </div>

          <!-- Items -->
          <div class="section">
            <h2 style="color: #1f2937; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">Order Items</h2>
            <table class="order-items">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
              </tbody>
            </table>
          </div>

          <!-- Order Totals -->
          <div class="totals">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>₦${order.subtotal.toLocaleString()}</span>
            </div>
            ${order.tax > 0 ? `<div class="total-row"><span>Tax:</span><span>₦${order.tax.toLocaleString()}</span></div>` : ''}
            ${order.shippingCost > 0 ? `<div class="total-row"><span>Shipping:</span><span>₦${order.shippingCost.toLocaleString()}</span></div>` : ''}
            ${order.discount > 0 ? `<div class="total-row"><span>Discount:</span><span>-₦${order.discount.toLocaleString()}</span></div>` : ''}
            <div class="total-row final">
              <span>Total Amount:</span>
              <span>₦${order.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <!-- Shipping Address -->
          <div class="section">
            <h2 style="color: #1f2937; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">Shipping Address</h2>
            <div class="address-box">
              <p><strong>${order.shippingInfo.firstName} ${order.shippingInfo.lastName}</strong></p>
              <p>${order.shippingInfo.address}</p>
              <p>${order.shippingInfo.city}, ${order.shippingInfo.state} ${order.shippingInfo.zipCode}</p>
              <p>${order.shippingInfo.country}</p>
              <p><strong>Phone:</strong> ${order.customerInfo.phone}</p>
            </div>
          </div>

          <!-- What's Next -->
          <div class="section">
            <h2 style="color: #1f2937; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">What's Next?</h2>
            <ul style="line-height: 1.8;">
              <li>We'll confirm your payment shortly</li>
              <li>Your order will be prepared for shipment</li>
              <li>You'll receive a shipping notification with tracking info</li>
              <li>Track your order anytime using your order number</li>
            </ul>
          </div>

          <!-- Support -->
          <div class="section" style="background-color: #dbeafe; padding: 15px; border-radius: 5px;">
            <p><strong>Need Help?</strong></p>
            <p>If you have any questions about your order, please don't hesitate to contact us at <strong>info@resinbysaidat.com.ng</strong></p>
          </div>
        </div>

        <div class="footer">
          <p>&copy; 2025 Resin By Saidat. All rights reserved.</p>
          <p>This is an automated email. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const orderStatusUpdateTemplate = (order, previousStatus) => {
  const statusMessages = {
    confirmed: 'Your order has been confirmed and will be processed soon.',
    processing: 'We are processing your order and preparing it for shipment.',
    shipped: `Great news! Your order has been shipped. ${order.trackingInfo?.number ? `Tracking number: ${order.trackingInfo.number}` : ''}`,
    delivered: 'Your order has been delivered. Thank you for shopping with us!',
    cancelled: 'Your order has been cancelled. If you have any questions, please contact our support team.',
    refunded: 'Your order has been refunded. The refund will be processed within 5-7 business days.'
  };

  const statusColor = {
    pending: '#f59e0b',
    confirmed: '#3b82f6',
    processing: '#8b5cf6',
    shipped: '#6366f1',
    delivered: '#10b981',
    cancelled: '#ef4444',
    refunded: '#6b7280'
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: ${statusColor[order.status] || '#2563eb'}; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background-color: #f9fafb; padding: 20px; }
        .status-badge { background-color: ${statusColor[order.status] || '#2563eb'}; color: white; padding: 10px 15px; border-radius: 5px; display: inline-block; font-weight: bold; margin: 10px 0; }
        .info-box { background-color: white; padding: 15px; border-radius: 5px; margin: 10px 0; border-left: 4px solid ${statusColor[order.status] || '#2563eb'}; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; background-color: #f3f4f6; border-radius: 0 0 5px 5px; }
        .section { margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📦 Order Status Update</h1>
        </div>

        <div class="content">
          <div class="section">
            <p>Hi ${order.customerInfo.firstName} ${order.customerInfo.lastName},</p>
            <p>Your order status has been updated:</p>
          </div>

          <div style="text-align: center;">
            <div class="status-badge">
              ${order.status.toUpperCase()}
            </div>
          </div>

          <div class="info-box">
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Current Status:</strong> ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
            <p><strong>Updated At:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          </div>

          <div class="section">
            <p><strong>Update Details:</strong></p>
            <p>${statusMessages[order.status] || 'Your order has been updated.'}</p>
          </div>

          ${order.trackingInfo?.number ? `
            <div class="info-box">
              <p><strong>Tracking Information:</strong></p>
              <p><strong>Carrier:</strong> ${order.trackingInfo.carrier || 'N/A'}</p>
              <p><strong>Tracking Number:</strong> ${order.trackingInfo.number}</p>
              ${order.trackingInfo.expectedDelivery ? `<p><strong>Expected Delivery:</strong> ${new Date(order.trackingInfo.expectedDelivery).toLocaleDateString()}</p>` : ''}
            </div>
          ` : ''}

          <div class="section" style="background-color: #dbeafe; padding: 15px; border-radius: 5px;">
            <p><strong>Need Help?</strong></p>
            <p>If you have any questions about your order, please contact us at <strong>info@resinbysaidat.com.ng</strong></p>
          </div>
        </div>

        <div class="footer">
          <p>&copy; 2025 Resin By Saidat. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const adminOrderNotificationTemplate = (order) => {
  const itemsHTML = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e0e0e0; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e0e0e0; text-align: right;">₦${item.price.toLocaleString()}</td>
    </tr>
  `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 700px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1f2937; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
        .content { background-color: #f9fafb; padding: 20px; }
        .table { width: 100%; border-collapse: collapse; background-color: white; margin: 10px 0; }
        .table th { background-color: #e5e7eb; padding: 10px; text-align: left; font-weight: bold; border-bottom: 2px solid #d1d5db; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background-color: white; padding: 15px; border-radius: 5px; margin: 10px 0; }
        .info-item { border-left: 3px solid #2563eb; padding-left: 10px; }
        .footer { text-align: center; padding: 15px; color: #666; font-size: 12px; background-color: #f3f4f6; border-radius: 0 0 5px 5px; }
        .section { margin-bottom: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🛒 New Order Alert</h2>
          <p>Order #${order.orderNumber}</p>
        </div>

        <div class="content">
          <div class="section">
            <h3 style="color: #1f2937; border-bottom: 2px solid #2563eb; padding-bottom: 8px;">Customer Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <strong>Name:</strong>
                <p>${order.customerInfo.firstName} ${order.customerInfo.lastName}</p>
              </div>
              <div class="info-item">
                <strong>Email:</strong>
                <p>${order.customerInfo.email}</p>
              </div>
              <div class="info-item">
                <strong>Phone:</strong>
                <p>${order.customerInfo.phone}</p>
              </div>
              <div class="info-item">
                <strong>Order Date:</strong>
                <p>${new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div class="section">
            <h3 style="color: #1f2937; border-bottom: 2px solid #2563eb; padding-bottom: 8px;">Shipping Address</h3>
            <p>
              ${order.shippingInfo.firstName} ${order.shippingInfo.lastName}<br>
              ${order.shippingInfo.address}<br>
              ${order.shippingInfo.city}, ${order.shippingInfo.state} ${order.shippingInfo.zipCode}<br>
              ${order.shippingInfo.country}
            </p>
          </div>

          <div class="section">
            <h3 style="color: #1f2937; border-bottom: 2px solid #2563eb; padding-bottom: 8px;">Order Items</h3>
            <table class="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h3 style="color: #1f2937; border-bottom: 2px solid #2563eb; padding-bottom: 8px;">Order Summary</h3>
            <div class="info-grid">
              <div class="info-item">
                <strong>Subtotal:</strong>
                <p>₦${order.subtotal.toLocaleString()}</p>
              </div>
              <div class="info-item">
                <strong>Tax:</strong>
                <p>₦${order.tax.toLocaleString()}</p>
              </div>
              <div class="info-item">
                <strong>Shipping:</strong>
                <p>₦${order.shippingCost.toLocaleString()}</p>
              </div>
              <div class="info-item">
                <strong>Total:</strong>
                <p style="font-weight: bold; color: #2563eb; font-size: 18px;">₦${order.totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div class="section">
            <h3 style="color: #1f2937; border-bottom: 2px solid #2563eb; padding-bottom: 8px;">Payment Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <strong>Payment Method:</strong>
                <p>${order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}</p>
              </div>
              <div class="info-item">
                <strong>Payment Status:</strong>
                <p style="color: #f59e0b; font-weight: bold;">${order.paymentStatus.toUpperCase()}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="footer">
          <p>Please process this order promptly.</p>
          <p>&copy; 2025 Resin By Saidat Admin System</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const adminStatusUpdateNotificationTemplate = (order, changeDetails) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1f2937; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
        .content { background-color: #f9fafb; padding: 20px; }
        .change-box { background-color: white; padding: 15px; border-radius: 5px; margin: 10px 0; border-left: 4px solid #2563eb; }
        .footer { text-align: center; padding: 15px; color: #666; font-size: 12px; background-color: #f3f4f6; border-radius: 0 0 5px 5px; }
        .section { margin-bottom: 15px; }
        strong { color: #1f2937; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>📝 Order #${order.orderNumber} - Updated</h2>
        </div>

        <div class="content">
          <div class="section">
            <h3 style="color: #1f2937; border-bottom: 2px solid #2563eb; padding-bottom: 8px;">Changes Made</h3>
          </div>

          ${changeDetails.orderStatusChanged ? `
            <div class="change-box">
              <strong>Order Status Changed:</strong>
              <p>${changeDetails.previousOrderStatus} → ${order.status}</p>
            </div>
          ` : ''}

          ${changeDetails.paymentStatusChanged ? `
            <div class="change-box">
              <strong>Payment Status Changed:</strong>
              <p>${changeDetails.previousPaymentStatus} → ${order.paymentStatus}</p>
            </div>
          ` : ''}

          ${changeDetails.trackingInfoAdded ? `
            <div class="change-box">
              <strong>Tracking Information Added:</strong>
              <p><strong>Carrier:</strong> ${order.trackingInfo.carrier}</p>
              <p><strong>Tracking Number:</strong> ${order.trackingInfo.number}</p>
              ${order.trackingInfo.expectedDelivery ? `<p><strong>Expected Delivery:</strong> ${new Date(order.trackingInfo.expectedDelivery).toLocaleDateString()}</p>` : ''}
            </div>
          ` : ''}

          ${changeDetails.adminNoteAdded ? `
            <div class="change-box">
              <strong>Admin Note Added:</strong>
              <p>${order.adminNotes[order.adminNotes.length - 1].text}</p>
            </div>
          ` : ''}

          <div class="section" style="background-color: #dbeafe; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <p><strong>Updated At:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>

        <div class="footer">
          <p>This is a system notification. No action needed.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
