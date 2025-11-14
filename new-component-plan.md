# New Component Plan (Milestone 1 => Milestone 2)

## Project
E-Commerce Order Management API - New Component Plan

## Chosen Component
**Nodemailer**  
This component will allow the API to send emails to customers, such as order confirmations and order status updates.

## Why I Selected Nodemailer
- It adds a **real and useful feature** for an e-commerce system.
- Simple to integrate with Node.js and TypeScript.
- Works with popular email services like **Gmail, SendGrid, Mailgun**, or any SMTP server.
- Easy to test using mocks, which supports the required test coverage.
- Clearly demonstrates an **additional back-end feature** beyond course content.

## Other Components Considered
### 1. Express-rate-limit
- Helps control request limits and prevent abuse.
- Useful but not visually impressive during a sprint demo.

### 2. Multer (File Uploads)
- Allows uploading product images.
- More complex because it requires storage setup (local/Cloud Storage).

**Nodemailer was chosen** because it provides meaningful functionality, fits the e-commerce theme, and is easier to implement within the milestone timeline.

## Scope for Milestone 2
In Milestone 2, Nodemailer will be used to:

- Send an **Order Confirmation Email** when a new order is created.  
  Endpoint: `POST /api/orders`

- Send an **Order Status Update Email** when the order status changes.  
  Endpoint: `PUT /api/orders/:id`

- Use simple HTML templates for email content.
- Use environment variables for SMTP settings.
- Allow emails to be disabled during testing using:  
  `EMAIL_DISABLED=true`

Testing required:
- Unit tests for the EmailService.
- Integration tests to verify that EmailService is triggered during order creation/status updates.

## Implementation Plan
The following will be added:

### 1. EmailService (`src/services/email.service.ts`)
Contains:
- Method to create SMTP transporter.
- `sendOrderConfirmation(order)`
- `sendOrderStatusUpdate(order)`

### 2. HTML Email Templates
- `src/templates/order-confirmation.html`
- `src/templates/order-status.html`

### 3. Example Email Environment File
- `src/config/email.example.env`  
(Only an example - no real credentials)

### 4. Integration with Order Logic
- After order creation => send confirmation email.
- After status change => send update email.

### 5. Environment Toggle
- If `EMAIL_DISABLED=true`, no emails are sent (useful for CI/tests).

## Environment Variables (Add to .env)
These are required for Nodemailer:

