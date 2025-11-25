# Order Management System - Quick Reference Guide

## 🚀 Quick Start

### Access Order Management
1. Navigate to `/dashboard/order` to see all orders
2. Click "View" on any order to see details
3. Manage status, notes, and send emails

## 📊 Orders List Page (`/dashboard/order`)

### What You Can Do
- **Search**: Find orders by order #, customer name, or email
- **Filter**: By order status, payment status, date range
- **Sort**: By date, total, order #, or status
- **Export**: Download all visible orders as CSV
- **View**: Click to see full order details

### Status Legend
| Status | Color | Meaning |
|--------|-------|---------|
| Pending | 🟡 Yellow | Awaiting confirmation |
| Confirmed | 🔵 Blue | Order verified |
| Processing | 🟣 Purple | Being prepared |
| Shipped | 🟦 Indigo | In transit |
| Delivered | 🟢 Green | Completed |
| Cancelled | 🔴 Red | Rejected/Cancelled |
| Refunded | ⚫ Gray | Money returned |

### Payment Status Legend
| Status | Color | Meaning |
|--------|-------|---------|
| Pending | 🟡 Yellow | Awaiting payment |
| Completed | 🟢 Green | Payment received |
| Failed | 🔴 Red | Payment failed |
| Refunded | ⚫ Gray | Refund processed |

## 📝 Order Details Page (`/dashboard/order/[id]`)

### Information Displayed
- Order number and date
- Current status (order + payment)
- Customer information
- Shipping address
- All items in order with prices
- Order totals (subtotal, tax, shipping, discount)
- Payment method

### Order Management Features

#### 1. Update Order Status
- **Where**: Right sidebar
- **How**: 
  1. Select new status from dropdown
  2. Check "Notify customer" if you want to send email
  3. Click "Update Status"
- **Notification**: Customer gets email when status changes

#### 2. Add Order Notes
- **Where**: Main content area
- **Note Types**:
  - **Internal**: Only staff can see (for internal communication)
  - **Customer Visible**: Customer can see (for updates/explanations)
- **How**:
  1. Select note type
  2. Type your message
  3. Click "Add Note"
- **View**: All notes appear below with date and type

#### 3. Send Emails
- **Where**: Right sidebar
- **Email Templates**:
  - **Confirmation**: Order confirmation (send when creating order)
  - **Status Update**: Generic status change notification
  - **Shipped**: Order shipped with tracking info
  - **Delivered**: Delivery confirmation
  - **Cancelled**: Cancellation notice
- **How**:
  1. Select email template
  2. Click "Send Email"
  3. Customer receives email

#### 4. Quick Actions
- **Cancel Order**: Available if order is pending or confirmed
- **Refund Payment**: Available if payment is completed
- **Print Order**: Print order details
- **Download Invoice**: Get invoice PDF

## 🔧 API Reference

### Get All Orders
```
GET /api/order?search=ORD&status=shipped&page=1&limit=10
```

### Get Single Order
```
GET /api/order/[orderId]
```

### Update Order Status
```
PATCH /api/order/[orderId]
Body: {
  "status": "shipped",
  "notifyCustomer": true
}
```

### Add Note to Order
```
POST /api/order/[orderId]/notes
Body: {
  "text": "Note content",
  "type": "internal" | "customer"
}
```

### Get Order Notes
```
GET /api/order/[orderId]/notes
```

### Send Email
```
POST /api/order/[orderId]/email
Body: {
  "templateType": "confirmation" | "statusUpdate" | "shipped"
}
```

## 📧 Email Configuration

### Required Environment Variables
```bash
BREVO_API_KEY=xkeysib_xxxxx...
BREVO_FROM_EMAIL=noreply@rayobengineering.com
```

### Email Variables (Available in Templates)
- `{{orderNumber}}` - ORD-0001
- `{{orderDate}}` - Order creation date
- `{{orderTotal}}` - Total amount
- `{{customerName}}` - Full customer name
- `{{newStatus}}` - Updated status
- `{{trackingNumber}}` - Shipping tracking
- `{{expectedDelivery}}` - Delivery date

## 💡 Common Workflows

### Workflow 1: New Order Processing
1. View new orders on orders list (status = "pending")
2. Click "View" to see details
3. Verify customer information
4. Update status to "confirmed"
5. Check "Notify customer"
6. Email sent automatically

### Workflow 2: Order Shipped
1. Open order details
2. Add internal note: "Package shipped from warehouse"
3. Update status to "shipped"
4. Select "Shipped" email template
5. Send email with tracking information
6. Customer receives tracking details

### Workflow 3: Order Delivered
1. Open order details
2. Add customer note: "Your order has been delivered!"
3. Update status to "delivered"
4. Select "Delivered" email template
5. Send delivery confirmation

### Workflow 4: Handle Cancellation Request
1. Open order details
2. Add internal note: "Customer requested cancellation - reason: changed mind"
3. Update status to "cancelled"
4. If already paid, use "Refund Payment" action
5. Update payment status to "refunded"
6. Select "Cancelled" email template
7. Send cancellation notice

## 🎯 Features Checklist

✅ View all orders with pagination
✅ Search orders by order #, customer name, email
✅ Filter by order status
✅ Filter by payment status
✅ Filter by date range
✅ Sort by date, total, order #, status
✅ Export orders to CSV
✅ View order details
✅ Update order status
✅ Notify customer on status change
✅ Add internal notes
✅ Add customer-visible notes
✅ View note history
✅ Send confirmation emails
✅ Send status update emails
✅ Send shipped emails
✅ Send delivered emails
✅ Send cancellation emails
✅ Cancel orders
✅ Refund payments
✅ Print orders
✅ Download invoices

## ⚠️ Important Notes

1. **Customer Notifications**
   - Always check "Notify customer" when updating status
   - Use appropriate email template when sending emails
   - Ensure BREVO email is configured

2. **Data Integrity**
   - Cannot delete orders (use cancellation instead)
   - Status changes are logged
   - All notes are timestamped

3. **Security**
   - Only admins can access order management
   - Internal notes are staff-only
   - Customer emails are encrypted

## 🐛 Troubleshooting

### Orders not showing
- Check MongoDB connection
- Verify you have orders in database
- Try refreshing page

### Email not sending
- Verify BREVO_API_KEY is set
- Check BREVO_FROM_EMAIL is verified in Brevo
- Check customer email is valid
- See browser console for errors

### Status update fails
- Ensure order exists
- Check valid status value
- Try refreshing page

### Notes not saving
- Check note text is not empty
- Verify order exists
- See browser console for errors

## 📱 Mobile Support

- Orders list is responsive (stacks on mobile)
- Order details work on tablets
- Email sending works on all devices
- Status updates work on mobile

## 🔐 Best Practices

1. **Always notify customers** when status changes significantly
2. **Add internal notes** for context on unusual orders
3. **Use customer notes** to communicate with buyers
4. **Verify addresses** before marking as shipped
5. **Send tracking email** immediately when shipping
6. **Keep records** by exporting orders regularly

## 📚 Related Documentation

- See `ORDERS_MANAGEMENT_DOCUMENTATION.md` for detailed technical docs
- See `ECOMMERCE_SYSTEM_DOCUMENTATION.md` for full system overview
- See `ordersApi.js` for utility functions
- See `emailService.js` for email templates

---

**Last Updated:** January 2025
**Version:** 1.0
**Status:** Production Ready ✅
