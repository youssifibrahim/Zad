# 🛒 Zad E-Commerce API (Advanced Backend)

A robust, production-ready RESTful API for "Zad" E-commerce platform. This backend system manages products, secure user authentication, shopping carts, and a multi-method payment system (Cash on Delivery & Credit Card via Stripe), complete with real-time sales analytics.

---

## 🚀 Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js (v5.x)
* **Database:** MongoDB with Mongoose (v9.x)
* **Security:** Helmet, Express-Rate-Limit, Bcrypt.js, and JWT.
* **Media Management:** Cloudinary API with Multer for professional image hosting.
* **Payments:** Stripe API (with secure Webhook integration).

---

## ✨ Key Features

### 🔐 Authentication & Authorization
* Secure user registration and login using **JWT** (JSON Web Tokens).
* Password hashing with **Bcryptjs**.
* **Role-Based Access Control (RBAC):** Distinct permissions for Users and Administrators.

### 🛍️ Product & Inventory Management
* Full CRUD operations for products and categories.
* Advanced **Search, Filter, Sort, and Pagination** logic.
* Automated stock deduction and sales increment upon successful purchase.

### 💳 Order & Payment System
* **Hybrid Checkout:** Supports both **Cash on Delivery (COD)** and **Online Payment (Stripe)**.
* **Stripe Webhook Security:** Implements `Stripe-Signature` verification to prevent fake payment requests.
* **Cart Logic:** Dynamic cart management that calculates total prices and validates coupons.

### 📊 Admin Analytics Dashboard
* **Business Intelligence:** Aggregation pipelines to calculate daily, weekly, monthly, and total revenue.
* **Monthly Sales Plan:** Visualizable data structure for sales trends across the year.

---

## 📂 Project Structure

```text
├── src
│   ├── controllers    # Business logic & request handling
│   ├── models         # Mongoose schemas & data structure
│   ├── routes         # API endpoint definitions
│   ├── utils          # Helpers (Email, SearchFilter, AppError)
│   └── middleware     # Auth, validation, and error handlers
├── app.js             # Express configuration & middleware
└── server.js          # Entry point & database connection
```
---

## ⚙️ Installation & Setup Guide

### 1. Clone the Repository
```bash
git clone [https://github.com/youssifibrahim/zad.git](https://github.com/youssifibrahim/zad.git)
cd zad
```
### 2. Install Dependencies
```bash
npm install
```
### 3. Environment Variables Configuration
Create a .env file in the root directory and populate it with your credentials:
```Code snippet
# --- Server Settings ---
PORT=3000
NODE_ENV=development

# --- Database ---
DATABASE_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/zad

# --- Authentication ---
JWT_SECRET=your_long_random_secret_string
JWT_EXPIRES_IN=1d

# --- Stripe Payments ---
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_key

# --- Cloudinary (Media Hosting) ---
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# --- Email Notifications ---
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
```
### 4. Database 
Ensure your MongoDB instance (Local or Atlas) is active.
### 5. Testing Webhooks Locally (Stripe)
To test the payment success flow on your local machine, use the Stripe CLI:
1. Log in to Stripe: ```stripe login```
2. Forward events: ```stripe listen --forward-to localhost:3000/api/orders/webhook-checkout```
3. Update ```STRIPE_WEBHOOK_SECRET``` in your ```.env``` with the provided secret.
### 6. Launch the Application
Start the server based on your environment:

* Development Mode (with Nodemon):
```bash
npm run start:dev
```
* Production Mode:
```bash
npm start
```

---

### 🛠 API Endpoints (Quick Reference)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users/signup` | Register a new user | Public |
| `GET` | `/api/products` | Get products (Search/Filter) | Public |
| `POST` | `/api/cart` | Add product to cart | User |
| `POST` | `/api/orders/checkout-session` | Get Stripe Payment Link | User |
| `GET` | `/api/orders/combined-stats` | Business Analytics Dashboard | Admin |

---

## 🏁 Conclusion

**Zad** is more than just an e-commerce API; it's a scalable architecture built with security and performance in mind. Whether it's handling real-time payments via Stripe, managing media through Cloudinary, or providing deep business insights for admins, this project serves as a solid foundation for any modern online store.

### 🌟 Show your support
If you find this project helpful or if it helped you learn something new, please consider giving it a ⭐ on GitHub! It means a lot.

### 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/youssifibrahim/zad-api/issues).

---

Developed with ❤️ by [Youssif Ibrahim]






