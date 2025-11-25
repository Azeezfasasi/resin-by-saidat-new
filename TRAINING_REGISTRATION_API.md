# Training Registration API Documentation

## Overview
Complete API for managing ResinBySaidat training registrations with admin functionality for status tracking, payment management, and data exports.

---

## Base Endpoints

### 1. Create Training Registration
**POST** `/api/training-register`

Create a new training registration for a participant.

**Request Body:**
```json
{
  "firstName": "string (required)",
  "lastName": "string (required)",
  "email": "string (required, unique)",
  "phone": "string (required)",
  "experience": "beginner|intermediate|advanced (required)",
  "city": "string (required)",
  "occupation": "string (optional)",
  "sessionDate": "december|january|february|march (required)",
  "referralSource": "string (optional)",
  "agreeTerms": "boolean (required)"
}
```

**Response (201):**
```json
{
  "message": "Registration successful",
  "data": {
    "_id": "ObjectId",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "experience": "string",
    "city": "string",
    "occupation": "string",
    "sessionDate": "string",
    "referralSource": "string",
    "status": "pending",
    "paymentStatus": "unpaid",
    "paymentAmount": 150000,
    "registrationDate": "ISO Date",
    "createdAt": "ISO Date",
    "updatedAt": "ISO Date"
  }
}
```

**Error Responses:**
- 400: Missing required fields
- 409: Email already registered
- 500: Internal server error

---

### 2. Get All Registrations (Admin)
**GET** `/api/training-register?page=1&limit=20&status=pending&sessionDate=december&search=john`

Fetch all training registrations with filtering and pagination.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Records per page (default: 20)
- `status`: Filter by status (pending|confirmed|paid|completed|cancelled)
- `sessionDate`: Filter by session (december|january|february|march)
- `search`: Search by name, email, or phone

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "ObjectId",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phone": "string",
      "experience": "string",
      "city": "string",
      "status": "string",
      "paymentStatus": "string",
      "paymentAmount": "number",
      "registrationDate": "ISO Date",
      "createdAt": "ISO Date",
      "updatedAt": "ISO Date"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

---

### 3. Get Registration Statistics (Admin)
**GET** `/api/training-register?stats=true`

Get analytics about all registrations.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalRegistrations": 150,
    "byStatus": {
      "pending": 45,
      "confirmed": 60,
      "paid": 40,
      "completed": 5,
      "cancelled": 0
    },
    "bySessionDate": {
      "december": 50,
      "january": 40,
      "february": 35,
      "march": 25
    },
    "byPaymentStatus": {
      "unpaid": 65,
      "partial": 25,
      "paid": 60
    },
    "revenue": {
      "totalRevenue": 9000000,
      "paidRegistrations": 60
    }
  }
}
```

---

### 4. Get Single Registration (Admin)
**GET** `/api/training-register/{id}`

Fetch details of a specific registration.

**Path Parameters:**
- `id`: Registration ID (MongoDB ObjectId)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "ObjectId",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "experience": "string",
    "city": "string",
    "occupation": "string",
    "sessionDate": "string",
    "referralSource": "string",
    "status": "string",
    "paymentStatus": "string",
    "paymentAmount": "number",
    "notes": "string",
    "registrationDate": "ISO Date",
    "confirmationSentAt": "ISO Date",
    "createdAt": "ISO Date",
    "updatedAt": "ISO Date"
  }
}
```

**Error Responses:**
- 404: Registration not found
- 500: Internal server error

---

### 5. Update Registration Details (Admin)
**PUT** `/api/training-register/{id}`

Update registration information.

**Request Body:**
```json
{
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "phone": "string (optional)",
  "city": "string (optional)",
  "occupation": "string (optional)",
  "sessionDate": "december|january|february|march (optional)",
  "notes": "string (optional)"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "ObjectId",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "experience": "string",
    "city": "string",
    "occupation": "string",
    "sessionDate": "string",
    "status": "string",
    "paymentStatus": "string",
    "paymentAmount": "number",
    "notes": "string",
    "updatedAt": "ISO Date"
  }
}
```

---

### 6. Update Registration Status (Admin)
**PUT** `/api/training-register/{id}`

Update the registration status.

**Request Body:**
```json
{
  "action": "status",
  "status": "pending|confirmed|paid|completed|cancelled"
}
```

**Valid Status Transitions:**
- `pending` → Initial state
- `confirmed` → Admin confirmed participation
- `paid` → Payment received
- `completed` → Training completed
- `cancelled` → Cancelled registration

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "ObjectId",
    "status": "confirmed",
    "updatedAt": "ISO Date"
  }
}
```

---

### 7. Update Payment Status (Admin)
**PUT** `/api/training-register/{id}`

Update payment information.

**Request Body:**
```json
{
  "action": "payment",
  "paymentStatus": "unpaid|partial|paid",
  "paymentAmount": 150000
}
```

**Payment Status:**
- `unpaid`: No payment received
- `partial`: Partial payment received
- `paid`: Full payment received (auto-updates status to 'paid')

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "ObjectId",
    "paymentStatus": "paid",
    "paymentAmount": 150000,
    "status": "paid",
    "updatedAt": "ISO Date"
  }
}
```

---

### 8. Confirm Registration (Admin)
**PUT** `/api/training-register/{id}`

Mark registration as confirmed and send confirmation email.

**Request Body:**
```json
{
  "action": "confirm"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "ObjectId",
    "status": "confirmed",
    "confirmationSentAt": "ISO Date",
    "updatedAt": "ISO Date"
  }
}
```

---

### 9. Delete Registration (Admin)
**DELETE** `/api/training-register/{id}`

Soft delete a registration (sets deletedAt timestamp).

**Response (200):**
```json
{
  "success": true,
  "message": "Registration deleted successfully"
}
```

**Error Responses:**
- 404: Registration not found
- 500: Internal server error

---

### 10. Export Registrations to CSV (Admin)
**GET** `/api/training-register/export?status=pending&sessionDate=december`

Export filtered registrations as CSV file.

**Query Parameters:**
- `status`: Filter by status (optional)
- `sessionDate`: Filter by session (optional)

**Response (200):**
Returns CSV file with headers:
```
First Name,Last Name,Email,Phone,City,Occupation,Experience,Session Date,Referral Source,Status,Payment Status,Payment Amount,Registration Date
```

**Error Responses:**
- 404: No registrations to export
- 500: Internal server error

---

## Admin Controller Functions

The training controller exports the following functions for direct use:

### `getAllRegistrations(req)`
Get paginated registrations with filtering.

### `getRegistrationById(id)`
Get a single registration by ID.

### `createRegistration(data)`
Create a new registration.

### `updateRegistration(id, updateData)`
Update registration details (firstName, lastName, phone, city, occupation, sessionDate, notes).

### `updateRegistrationStatus(id, status)`
Update registration status.

### `updatePaymentStatus(id, paymentStatus, paymentAmount)`
Update payment information.

### `deleteRegistration(id)`
Soft delete registration.

### `confirmRegistration(id)`
Mark as confirmed and set confirmationSentAt.

### `getRegistrationStats()`
Get comprehensive statistics about registrations.

### `exportRegistrations(filters)`
Export registrations as formatted data for CSV.

### `sendConfirmationEmail(registrationId)`
Send confirmation email (placeholder for Brevo integration).

---

## Error Handling

All endpoints return consistent error responses:

**400 Bad Request:**
```json
{
  "message": "Missing required fields"
}
```

**404 Not Found:**
```json
{
  "message": "Registration not found"
}
```

**409 Conflict:**
```json
{
  "message": "This email is already registered"
}
```

**500 Internal Server Error:**
```json
{
  "message": "Internal server error"
}
```

---

## Example Usage (Admin Dashboard)

### Fetch all pending registrations
```javascript
const response = await fetch('/api/training-register?status=pending&limit=50');
const data = await response.json();
```

### Update payment status
```javascript
const response = await fetch(`/api/training-register/${registrationId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'payment',
    paymentStatus: 'paid',
    paymentAmount: 150000
  })
});
```

### Export registrations
```javascript
const response = await fetch('/api/training-register/export?sessionDate=december');
const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'training-registrations.csv';
a.click();
```

### Get statistics
```javascript
const response = await fetch('/api/training-register?stats=true');
const stats = await response.json();
console.log(stats.data.totalRegistrations);
```

---

## TODO (Future Enhancements)

1. **Email Integration**: Implement Brevo API for sending confirmation and reminder emails
2. **Payment Gateway**: Integrate Paystack/Flutterwave for payment processing
3. **SMS Notifications**: Send SMS reminders before training sessions
4. **Certificate Generation**: Auto-generate and send certificates upon completion
5. **Admin Dashboard UI**: Create admin interface to manage registrations
6. **Webhook Handler**: Handle payment confirmation webhooks
7. **Email Templates**: Create professional email templates
8. **Batch Operations**: Support bulk status/payment updates

---

## Database Schema

**TrainingRegistration Collection:**

```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique),
  phone: String,
  experience: String (beginner|intermediate|advanced),
  city: String,
  occupation: String,
  sessionDate: String (december|january|february|march),
  referralSource: String,
  agreeTerms: Boolean,
  status: String (pending|confirmed|paid|completed|cancelled),
  paymentStatus: String (unpaid|partial|paid),
  paymentAmount: Number (default: 150000),
  notes: String,
  registrationDate: Date,
  confirmationSentAt: Date,
  deletedAt: Date (soft delete),
  createdAt: Date,
  updatedAt: Date,
  __v: Number
}
```

**Indexes:**
- `email`: Unique index
- `sessionDate, status`: Compound index for queries

---
