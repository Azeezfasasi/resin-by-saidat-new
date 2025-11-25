// Email service for order notifications using Brevo REST API
const apiKey = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const BREVO_FROM_EMAIL = process.env.BREVO_FROM_EMAIL || 'noreply@rayobengineering.com';

/**
 * Email templates for different order events
 */
const emailTemplates = {
  confirmation: {
    subject: 'Order Confirmation - {{orderNumber}}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Order Confirmation</h2>
        <p>Thank you for your order! Your order number is <strong>{{orderNumber}}</strong></p>
        
        <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3>Order Details</h3>
          <p><strong>Order Date:</strong> {{orderDate}}</p>
          <p><strong>Order Total:</strong> {{orderTotal}}</p>
          
          <h4>Items:</h4>
          {{#itemsList}}
          <div style="margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #ddd;">
            <p><strong>{{itemName}}</strong> (x{{quantity}})</p>
            <p>Price: {{itemPrice}}</p>
          </div>
          {{/itemsList}}
        </div>

        <h3>Shipping Address</h3>
        <p>{{shippingName}}<br/>
        {{shippingAddress}}<br/>
        {{shippingCity}}, {{shippingState}} {{shippingZip}}<br/>
        {{shippingCountry}}</p>

        <h3>Payment Method</h3>
        <p>{{paymentMethod}}</p>

        <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p>We'll send you an email update when your order ships. You can track your order status anytime by visiting your account.</p>
        </div>

        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          If you have any questions, please contact us at support@rayobengineering.com
        </p>
      </div>
    `
  },
  statusUpdate: {
    subject: 'Order Status Update - {{orderNumber}}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Order Status Update</h2>
        <p>Your order <strong>{{orderNumber}}</strong> has been updated.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <p><strong>Status:</strong> <span style="color: #4CAF50; font-size: 18px;">{{newStatus}}</span></p>
          <p><strong>Updated At:</strong> {{updatedAt}}</p>
          {{#notes}}<p><strong>Notes:</strong> {{notes}}</p>{{/notes}}
        </div>

        <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p>{{statusMessage}}</p>
        </div>

        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          If you have any questions, please contact us at support@rayobengineering.com
        </p>
      </div>
    `
  },
  shipped: {
    subject: 'Your Order Has Shipped - {{orderNumber}}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Your Order Has Shipped!</h2>
        <p>Great news! Your order <strong>{{orderNumber}}</strong> has been shipped.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h4>Tracking Information</h4>
          <p><strong>Carrier:</strong> {{carrier}}</p>
          <p><strong>Tracking Number:</strong> <a href="{{trackingUrl}}" style="color: #1976d2;">{{trackingNumber}}</a></p>
          <p><strong>Expected Delivery:</strong> {{expectedDelivery}}</p>
        </div>

        <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p>Click the tracking number above to monitor your shipment in real-time.</p>
        </div>

        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          If you have any questions, please contact us at support@rayobengineering.com
        </p>
      </div>
    `
  },
  delivered: {
    subject: 'Order Delivered - {{orderNumber}}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Your Order Has Been Delivered!</h2>
        <p>Your order <strong>{{orderNumber}}</strong> has been delivered.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <p><strong>Delivered At:</strong> {{deliveredAt}}</p>
        </div>

        <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p>We'd love to hear about your experience! Please consider leaving a review.</p>
        </div>

        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          If you have any questions, please contact us at support@rayobengineering.com
        </p>
      </div>
    `
  },
  cancelled: {
    subject: 'Order Cancelled - {{orderNumber}}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Order Cancellation Confirmation</h2>
        <p>Your order <strong>{{orderNumber}}</strong> has been cancelled.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <p><strong>Cancellation Reason:</strong> {{cancellationReason}}</p>
          {{#refundAmount}}<p><strong>Refund Amount:</strong> {{refundAmount}}</p>{{/refundAmount}}
        </div>

        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          If you have any questions, please contact us at support@rayobengineering.com
        </p>
      </div>
    `
  }
};

/**
 * Send email via Brevo REST API
 */
async function sendBrevoEmail(emailData) {
  if (!apiKey) {
    console.warn('BREVO_API_KEY not configured. Email not sent.');
    return { success: false, message: 'Email service not configured' };
  }

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Brevo API error:', error);
      throw new Error(`Brevo API error: ${error.message || response.statusText}`);
    }

    const result = await response.json();
    console.log('Email sent successfully via Brevo:', result);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email via Brevo:', error);
    throw error;
  }
}

/**
 * Send order confirmation email
 */
export const sendOrderConfirmationEmail = async (order, customerEmail) => {
  try {
    const items = order.items.map(item => ({
      itemName: item.name,
      quantity: item.quantity,
      itemPrice: formatPrice(item.price)
    }));

    const html = interpolateTemplate(emailTemplates.confirmation.html, {
      orderNumber: order.orderNumber,
      orderDate: formatDate(order.createdAt),
      orderTotal: formatPrice(order.totalAmount),
      itemsList: items,
      shippingName: `${order.shippingInfo.firstName} ${order.shippingInfo.lastName}`,
      shippingAddress: order.shippingInfo.address,
      shippingCity: order.shippingInfo.city,
      shippingState: order.shippingInfo.state,
      shippingZip: order.shippingInfo.zipCode,
      shippingCountry: order.shippingInfo.country,
      paymentMethod: order.paymentMethod.toUpperCase()
    });

    const emailData = {
      to: [{ email: customerEmail, name: `${order.shippingInfo.firstName} ${order.shippingInfo.lastName}` }],
      sender: { name: 'Rayob Engineering', email: BREVO_FROM_EMAIL },
      subject: interpolateTemplate(emailTemplates.confirmation.subject, { orderNumber: order.orderNumber }),
      htmlContent: html
    };

    return await sendBrevoEmail(emailData);
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
};

/**
 * Send order status update email
 */
export const sendOrderStatusUpdateEmail = async (order, customerEmail, newStatus) => {
  try {
    const statusMessages = {
      confirmed: 'Your order has been confirmed and will be processed soon.',
      processing: 'Your order is being prepared for shipment.',
      shipped: 'Your order has shipped! Check the tracking information in your account.',
      delivered: 'Your order has been delivered. Thank you for your purchase!',
      cancelled: 'Your order has been cancelled as requested.',
      refunded: 'Your refund has been processed.'
    };

    const html = interpolateTemplate(emailTemplates.statusUpdate.html, {
      orderNumber: order.orderNumber,
      newStatus: capitalizeFirst(newStatus),
      updatedAt: formatDate(new Date()),
      notes: order.adminNotes?.length > 0 ? order.adminNotes[0].text : '',
      statusMessage: statusMessages[newStatus] || 'Your order status has been updated.'
    });

    const emailData = {
      to: [{ email: customerEmail, name: `${order.shippingInfo.firstName} ${order.shippingInfo.lastName}` }],
      sender: { name: 'Rayob Engineering', email: BREVO_FROM_EMAIL },
      subject: interpolateTemplate(emailTemplates.statusUpdate.subject, { orderNumber: order.orderNumber }),
      htmlContent: html
    };

    return await sendBrevoEmail(emailData);
  } catch (error) {
    console.error('Error sending order status update email:', error);
    throw error;
  }
};

/**
 * Send order shipped email with tracking info
 */
export const sendOrderShippedEmail = async (order, customerEmail, trackingInfo) => {
  try {
    const html = interpolateTemplate(emailTemplates.shipped.html, {
      orderNumber: order.orderNumber,
      carrier: trackingInfo.carrier || 'Standard Shipping',
      trackingNumber: trackingInfo.trackingNumber || 'N/A',
      trackingUrl: trackingInfo.trackingUrl || '#',
      expectedDelivery: trackingInfo.expectedDelivery || 'Coming soon'
    });

    const emailData = {
      to: [{ email: customerEmail, name: `${order.shippingInfo.firstName} ${order.shippingInfo.lastName}` }],
      sender: { name: 'Rayob Engineering', email: BREVO_FROM_EMAIL },
      subject: interpolateTemplate(emailTemplates.shipped.subject, { orderNumber: order.orderNumber }),
      htmlContent: html
    };

    return await sendBrevoEmail(emailData);
  } catch (error) {
    console.error('Error sending order shipped email:', error);
    throw error;
  }
};

/**
 * Helper function to interpolate template variables
 */
function interpolateTemplate(template, variables) {
  let html = template;
  
  // Handle simple variables
  Object.entries(variables).forEach(([key, value]) => {
    if (value && typeof value !== 'object') {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
  });

  // Handle conditional blocks
  html = html.replace(/{{#([a-zA-Z0-9_]+)}}([\s\S]*?){{\/\1}}/g, (match, key, content) => {
    return variables[key] ? content : '';
  });

  // Handle arrays (itemsList)
  if (variables.itemsList && Array.isArray(variables.itemsList)) {
    let itemsHtml = '';
    variables.itemsList.forEach(item => {
      let itemContent = '{{#itemsList}}[placeholder]{{/itemsList}}'.match(/[^{]*{{#itemsList}}([\s\S]*?){{\/itemsList}}/);
      if (itemContent) {
        let rendered = itemContent[1];
        Object.entries(item).forEach(([key, value]) => {
          rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), value);
        });
        itemsHtml += rendered;
      }
    });
    html = html.replace(/{{#itemsList}}[\s\S]*?{{\/itemsList}}/, itemsHtml);
  }

  return html;
}

/**
 * Format currency
 */
function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}

/**
 * Format date
 */
function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
}

/**
 * Capitalize first letter
 */
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
