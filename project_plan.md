# Pre-Milestone: Project Planning and Proposal -- E-Commerce Order Management API

By Raahil Khan

## 1. Project Concept

E-Commerce-Order-Management- RESTful API- This API will be used as a
restful back-end system, to facilitate online e-commerce, product
management, customer orders and payments. Admins, Sellers and Customers
can perform different tasks designed for their role using this API.

Admins will have the control of whole system, Sellers can manage their
products and view order status, while customers can view the product
details and place an order and view all previous orders.

The purpose of this API is for me to mimic the basic backend behaviors
which a small shop on shopify or amazon might exhibit but in an
over-simplified fashion, it's just to do with educational reasons. This
idea was chosen because e-commerce is a real-world use case for APIs and
it directly relates to the basic stuff that we have been covering
throughout (CRUD actions, authentication, authorization, validation,
testing and documentation).

## 2. Scope and Functionality

The E-Commerce Order Management API will include three main
sections: Products, Orders, and Customers. Each part will
have its own purpose and set of endpoints to handle data smoothly.

Products:\
This section will keep all product information, such as the product
name, price, category, and how many items are in stock.\
Users will be able to add new products, view all available products,
edit existing ones, or remove them when needed.\
Example routes:

-   POST /products -- Add a product

-   GET /products -- View all products

-   PUT /products/:id -- Edit a product

-   DELETE /products/:id -- Delete a product

Orders:\
The Orders section will manage everything related to customer purchases.
It will handle creating new orders, updating order status (like
"processing" or "delivered"), and canceling orders if required.\
Example routes:

-   POST /orders -- Place a new order

-   GET /orders/:id -- View details of one order

-   PUT /orders/:id -- Update or change the order status

-   DELETE /orders/:id -- Cancel an order

Customers:\
This section will store information about customers and their previous
orders.\
Customers can register a new account, view their profile and order
history, or delete their account if needed.\
Example routes:

-   POST /customers -- Create a new customer account

-   GET /customers/:id -- View customer details

-   DELETE /customers/:id -- Remove a customer

Authentication and Roles:\
The system will use Firebase Authentication for login and
registration.\
Each user will have a specific role defined through Firebase Custom
Claims:

-   Admin: Can manage all data including products, orders, and
    users.

-   Seller: Can add or update their products and view customer
    orders.

-   Customer: Can browse products, place orders, and view their own
    order history.

## 3. Course Content Alignment

- Node.js, TypeScript, and Express: Used to build the server,
routes, and middleware.\
- Firestore Database: Stores product, order, and customer data.\
- Firebase Authentication: Handles user login and role-based access
control.\
- Joi Validation: Validates data for all CRUD operations.\
- Swagger/OpenAPI: Documents all endpoints and request
examples.\
- Jest: Used to test routes and service logic for accuracy and
reliability.\
- Helmet.js, CORS, dotenv: Ensure security and environment
configuration.

## 4. GitHub Project Setup

GitHub repository has been created.

Repository name: `E-commerce_API`

Branching strategy:  
- `main` – production-ready and stable version of the code  
- `development` – used for merging completed features before final testing  
- `feature` – separate branches for individual features  



## Pre-Milestone (Week 0)"-: 
- Goals -: Plan the project, write proposal, and create GitHub repo with a project board 
- Issues -: Define project scope and create issues for Products, Orders, and Customers modules

## Milestone 1 (Weeks 1-2) -:
- Goals -: Set up environment, implement CRUD for main resources, and connect Firebase
- Issues -: Create controller, service, and route files for each resource; test using Jest

## Milestone 2 (Week 3) -:
- Goals -: Add new component (Nodemailer) for order confirmation emails 
- Issues -: Implement and test email notifications; prepare short demo presentation

## Milestone 3 (Weeks 4-5) -:
- Goals -: Finalize API, documentation, and testing 
- Issues -: Complete Swagger docs, verify Firestore data operations, and polish code for final submission