/**
 * Order Email Service
 * Handles sending order-related emails to customers and admins
 */

import { sendEmailViaBrevo } from './brevoEmailService';
import {
  orderConfirmationTemplate,
  orderStatusUpdateTemplate,
  adminOrderNotificationTemplate,
  adminStatusUpdateNotificationTemplate,
} from './emailTemplates';

const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.BREVO_SENDER_EMAIL;

/**
 * Send order confirmation email to customer
 * @param {Object} order - Order data
 * @returns {Promise<Object>} Email send result
 */
export const sendOrderConfirmationEmail = async (order) => {
  try {
    if (!order.customerInfo?.email) {
      throw new Error('Customer email is required');
    }

    const htmlContent = orderConfirmationTemplate(order);

    const result = await sendEmailViaBrevo({
      to: order.customerInfo.email,
      subject: `Order Confirmation - Order #${order.orderNumber} | Resin By Saidat`,
      htmlContent,
      textContent: `Your order ${order.orderNumber} has been confirmed. Thank you for your purchase!`,
      tags: ['order-confirmation', order.orderNumber],
    });

    if (result.success) {
      console.log(`✓ Order confirmation email sent to ${order.customerInfo.email}`);
    } else {
      console.error(`✗ Failed to send order confirmation email:`, result.error);
    }

    return result;
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    throw error;
  }
};

/**
 * Send order confirmation email to admin
 * @param {Object} order - Order data
 * @returns {Promise<Object>} Email send result
 */
export const sendAdminOrderNotification = async (order) => {
  try {
    if (!ADMIN_EMAIL) {
      console.warn('⚠️ Admin email not configured, skipping admin notification');
      return { success: false, message: 'Admin email not configured' };
    }

    const htmlContent = adminOrderNotificationTemplate(order);

    const result = await sendEmailViaBrevo({
      to: ADMIN_EMAIL,
      subject: `🛒 New Order Alert - Order #${order.orderNumber} | Resin By Saidat`,
      htmlContent,
      textContent: `New order received: #${order.orderNumber} from ${order.customerInfo.firstName} ${order.customerInfo.lastName}. Total: ₦${order.totalAmount.toLocaleString()}`,
      tags: ['admin-notification', 'new-order', order.orderNumber],
    });

    if (result.success) {
      console.log(`✓ Admin notification email sent for order #${order.orderNumber}`);
    } else {
      console.error(`✗ Failed to send admin notification email:`, result.error);
    }

    return result;
  } catch (error) {
    console.error('❌ Error sending admin notification email:', error);
    throw error;
  }
};

/**
 * Send order status update email to customer
 * @param {Object} order - Updated order data
 * @param {string} previousStatus - Previous order status (optional)
 * @returns {Promise<Object>} Email send result
 */
export const sendOrderStatusUpdateEmail = async (order, previousStatus = null) => {
  try {
    if (!order.customerInfo?.email) {
      throw new Error('Customer email is required');
    }

    const htmlContent = orderStatusUpdateTemplate(order, previousStatus);

    const result = await sendEmailViaBrevo({
      to: order.customerInfo.email,
      subject: `Order Status Update - Order #${order.orderNumber} | Resin By Saidat`,
      htmlContent,
      textContent: `Your order ${order.orderNumber} status has been updated to ${order.status}.`,
      tags: ['order-status-update', order.orderNumber, order.status],
    });

    if (result.success) {
      console.log(
        `✓ Order status update email sent to ${order.customerInfo.email} (Status: ${order.status})`
      );
    } else {
      console.error(`✗ Failed to send order status update email:`, result.error);
    }

    return result;
  } catch (error) {
    console.error('❌ Error sending order status update email:', error);
    throw error;
  }
};

/**
 * Send order status update notification to admin
 * @param {Object} order - Updated order data
 * @param {Object} changeDetails - Details of what changed
 * @returns {Promise<Object>} Email send result
 */
export const sendAdminStatusUpdateNotification = async (order, changeDetails) => {
  try {
    if (!ADMIN_EMAIL) {
      console.warn('⚠️ Admin email not configured, skipping admin notification');
      return { success: false, message: 'Admin email not configured' };
    }

    const htmlContent = adminStatusUpdateNotificationTemplate(order, changeDetails);

    const result = await sendEmailViaBrevo({
      to: ADMIN_EMAIL,
      subject: `📝 Order #${order.orderNumber} Updated - Status: ${order.status} | Resin By Saidat`,
      htmlContent,
      textContent: `Order #${order.orderNumber} has been updated. Status: ${order.status}, Payment Status: ${order.paymentStatus}`,
      tags: ['admin-notification', 'order-update', order.orderNumber, order.status],
    });

    if (result.success) {
      console.log(`✓ Admin status update notification sent for order #${order.orderNumber}`);
    } else {
      console.error(`✗ Failed to send admin status update notification:`, result.error);
    }

    return result;
  } catch (error) {
    console.error('❌ Error sending admin status update notification:', error);
    throw error;
  }
};

/**
 * Send bulk order status update emails
 * Useful for campaigns or batch updates
 * @param {Array<Object>} orders - Array of orders to update
 * @param {string} status - New status for all orders
 * @returns {Promise<Object>} Results of bulk send
 */
export const sendBulkOrderStatusUpdates = async (orders, status) => {
  try {
    const results = {
      successful: [],
      failed: [],
      totalSent: 0,
      totalFailed: 0,
    };

    for (const order of orders) {
      try {
        const result = await sendOrderStatusUpdateEmail(order);
        if (result.success) {
          results.successful.push({
            orderNumber: order.orderNumber,
            email: order.customerInfo.email,
          });
          results.totalSent++;
        } else {
          results.failed.push({
            orderNumber: order.orderNumber,
            email: order.customerInfo.email,
            error: result.error,
          });
          results.totalFailed++;
        }
      } catch (error) {
        results.failed.push({
          orderNumber: order.orderNumber,
          email: order.customerInfo.email,
          error: error.message,
        });
        results.totalFailed++;
      }

      // Add small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    console.log(
      `✓ Bulk status update completed: ${results.totalSent} sent, ${results.totalFailed} failed`
    );

    return results;
  } catch (error) {
    console.error('❌ Error sending bulk order status updates:', error);
    throw error;
  }
};

/**
 * Retry sending order confirmation email
 * @param {string} orderNumber - Order number to retry
 * @param {Object} order - Order data
 * @returns {Promise<Object>} Email send result
 */
export const retrySendOrderConfirmation = async (orderNumber, order) => {
  try {
    console.log(`🔄 Retrying order confirmation email for order #${orderNumber}`);

    const result = await sendOrderConfirmationEmail(order);

    if (result.success) {
      console.log(`✓ Order confirmation email resent successfully for #${orderNumber}`);
    }

    return result;
  } catch (error) {
    console.error(`❌ Error retrying order confirmation for #${orderNumber}:`, error);
    throw error;
  }
};
