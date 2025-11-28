# Order Tracking System - Quick Links & Navigation Guide

## Customer Links

### Public Tracking Page
- **URL**: `/track-order`
- **Description**: Customers enter order number and email to track shipments
- **What They Can See**:
  - Order status timeline
  - Shipping address
  - Order items and prices
  - Tracking carrier and number (when available)
  - Payment status
  - Progress bar showing delivery progress

**Add to Navigation Menu**:
```jsx
<Link href="/track-order" className="...">
  Track Your Order
</Link>
```

---

## Admin Links

### All Orders Dashboard
- **URL**: `/dashboard/order`
- **Access**: Admin / Staff Members Only
- **Features**:
  - View all orders
  - Search by order number
  - Filter by status and payment status
  - Export orders to CSV
  - Sort by date, total, order number, or status
  - Quick preview of each order

### Order Details & Management
- **URL**: `/dashboard/order/[orderId]`
- **Access**: Admin / Staff Members Only
- **Features**:
  - Update order status
  - Update payment status
  - Set tracking information:
    - Carrier name
    - Tracking number
    - Expected delivery date
  - Add admin notes
  - View full customer and shipping information
  - See all order items

**How to Access**:
1. Go to `/dashboard/order`
2. Click "View" button on any order
3. You'll be taken to `/dashboard/order/[orderId]`

---

## API Endpoints

### Public Tracking API
```
GET /api/order/track?orderNumber=RS1140231&email=customer@example.com
```
- **Response**: Full order details (if found)
- **Error**: 404 if order not found

### Admin Order Management APIs
```
GET /api/order/[orderId]
PATCH /api/order/[orderId]
```
- **GET**: Retrieve order details
- **PATCH**: Update order status, payment status, tracking info

---

## Adding "Track Order" to Your Website Header

### Add Navigation Link
In your main navigation component, add:

```jsx
<Link href="/track-order" className="nav-link">
  Track Order
</Link>
```

### Add to Mobile Menu
```jsx
<MobileMenuLink href="/track-order" icon={<Truck />}>
  Track Order
</MobileMenuLink>
```

---

## Order Number Format
All orders use the format: **RS[NUMBER]**

Examples:
- RS1140231 (first order)
- RS1140232 (second order)
- RS1140233 (third order)

Customers will receive this order number in:
1. Order confirmation page after checkout
2. Confirmation email (when email system is set up)

---

## Workflow Example

### 1. Customer Places Order
- Order is created with number RS1140231
- Order status: `pending`
- Payment status: `pending`
- Customer sees order confirmation page with order number

### 2. Customer Tracks Order
- Visits `/track-order`
- Enters: Order number (RS1140231) and email (fas.azeez@gmail.com)
- Sees order in `pending` status with progress at 0%

### 3. Admin Confirms Order
- Admin opens `/dashboard/order`
- Clicks "View" on RS1140231
- Changes status to `confirmed`
- Saves changes
- Customer refreshes track page → sees `confirmed` status

### 4. Admin Adds Tracking
- Admin keeps order details open
- Sets Carrier: "DHL"
- Sets Tracking #: "123456789"
- Sets Expected Delivery: 2025-12-05
- Saves changes
- Customer sees tracking info and expected delivery date

### 5. Order Delivered
- Admin updates status to `delivered`
- Customer sees 100% progress and "Delivered" status

---

## Customization Options

### Change Default Carriers
Edit `/track-order/page.js` and update the carrier suggestions:

```jsx
placeholder="e.g., DHL, FedEx, Local Courier, Fedex Logistics Nigeria"
```

### Change Progress Bar Colors
Edit the gradient in the progress bar:
```jsx
className="bg-linear-to-r from-blue-500 to-indigo-600"
```

### Add Email Notifications (Future)
When implementing email notifications:

```jsx
// Send email when status changes
await sendEmail({
  to: order.customerInfo.email,
  subject: `Your order ${order.orderNumber} status: ${newStatus}`,
  template: 'order-status-update',
  data: { order, newStatus }
});
```

---

## Troubleshooting

### Customer Says "Order Not Found"
- Check order number format (should be RS followed by numbers)
- Verify email spelling (case-insensitive but spelling matters)
- Check if order was created in database

### Admin Can't Update Order
- Verify user role is "admin" or "staff-member"
- Check if order ID exists
- Look for error message in admin page

### Tracking Info Not Showing for Customer
- Admin must save carrier, tracking number, and/or expected delivery
- Once saved, it appears in the customer tracking page

---

## Key Features Summary

✅ **For Customers**:
- Easy order tracking with order number + email
- Visual timeline of order status
- Tracking carrier and number information
- Full order details and shipping address
- Mobile-friendly interface

✅ **For Admins**:
- Manage order status and payment status
- Add tracking information
- Leave internal notes
- View all customer and order details
- Export orders for reporting

✅ **For Business**:
- Real-time order status management
- Reduce customer support inquiries
- Professional tracking experience
- No external tracking service needed

---

## Support
If customers need help:
1. Direct them to `/track-order`
2. Tell them to use their order number (e.g., RS1140231)
3. They'll see their email if it matches the order

---

**System is ready for production!** 🚀
