# 🦊 Fox Khana — Premium Makhana eCommerce Platform

> **Crunch Smart. Eat Smart.**

A production-ready full-stack eCommerce web application for **Fox Khana**, India's premium makhana (fox nut) brand.

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (JSON Web Tokens) |
| Payments | Razorpay |
| State | React Context API |
| Styling | Tailwind CSS + Custom CSS |

---

## 📁 Project Structure

```
fox-khana/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Register, login, profile
│   │   ├── productController.js # CRUD + reviews
│   │   ├── orderController.js  # Razorpay + orders
│   │   └── bulkOrderController.js # B2B + coupons
│   ├── middleware/
│   │   ├── auth.js             # JWT protect + adminOnly
│   │   └── errorHandler.js     # Global error handling
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js          # With variants, reviews
│   │   ├── Order.js
│   │   ├── BulkOrder.js
│   │   └── Coupon.js
│   ├── routes/
│   │   └── index.js            # All API routes
│   ├── seed.js                 # Database seeder
│   ├── server.js               # Express app entry
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Footer.jsx
│   │   │   └── products/
│   │   │       └── ProductCard.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProductListingPage.jsx  # Plain + Flavoured
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── BulkOrderPage.jsx
│   │   │   ├── AuthPages.jsx           # Login + Register
│   │   │   ├── AdminDashboard.jsx      # Full admin panel
│   │   │   └── OrderPages.jsx          # Success + My Orders
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── utils/
│   │   │   └── api.js                  # Axios instance + all APIs
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
│
├── package.json                # Root monorepo scripts
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)
- Razorpay account (test mode for development)

### 1. Clone and Install

```bash
# Clone the repo
git clone <your-repo-url>
cd fox-khana

# Install all dependencies at once
npm run install:all
```

### 2. Configure Environment Variables

**Backend** — Copy and fill in your values:
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/foxkhana
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRE=7d
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_here
CLIENT_URL=http://localhost:5173
```

**Frontend** — Copy and fill in:
```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

### 3. Seed the Database

```bash
# From root
npm run seed
```

This creates:
- ✅ 7 products (2 plain + 5 flavoured) with full data
- ✅ Admin user: `admin@foxkhana.com` / `Admin@123`

### 4. Run Development Servers

```bash
# From root — runs both backend and frontend
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

---

## 📄 Pages Overview

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, featured products, categories |
| Plain Makhana | `/plain` | Plain product listing with filters |
| Flavoured | `/flavoured` | Flavoured products with flavour filter |
| Product Detail | `/product/:slug` | Full detail, variants, reviews |
| Cart | `/cart` | Cart with coupon code, quantity controls |
| Checkout | `/checkout` | Shipping form + Razorpay payment |
| Order Success | `/order-success/:id` | Confirmation with order details |
| My Orders | `/orders` | User's order history |
| Bulk Orders | `/bulk-orders` | B2B inquiry form |
| Admin | `/admin` | Protected admin dashboard |
| Login | `/login` | JWT auth |
| Register | `/register` | Account creation |

---

## 🛠 API Endpoints

### Auth
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile       (protected)
PUT  /api/auth/profile       (protected)
```

### Products
```
GET  /api/products           ?category=plain|flavoured&featured=true&search=...
GET  /api/products/:slug
POST /api/products/:id/reviews  (protected user)
```

### Orders
```
POST /api/orders/create-payment  (protected)
POST /api/orders/verify-payment  (protected)
GET  /api/orders/my-orders       (protected)
GET  /api/orders/:id             (protected)
```

### Bulk Orders
```
POST /api/bulk-orders
```

### Coupons
```
POST /api/coupons/validate   (protected)
```

### Admin (all require admin role)
```
GET|POST              /api/admin/products
PUT|DELETE            /api/admin/products/:id
GET|PUT               /api/admin/orders/:id
GET|PUT               /api/admin/bulk-orders/:id
GET|POST|PUT          /api/admin/coupons/:id
```

---

## 🔐 Admin Dashboard Features

Login at `/admin` with `admin@foxkhana.com` / `Admin@123`

- 📊 **Dashboard** — Key stats, recent orders
- 📦 **Products** — Add/Edit/Delete products with variants
- 🛍 **Orders** — View and update order statuses
- 👥 **Bulk Orders** — Manage B2B inquiries
- 🏷 **Coupons** — Create and manage discount codes

---

## 💳 Razorpay Integration

The checkout flow:
1. User clicks "Pay" → frontend calls `/api/orders/create-payment`
2. Backend validates cart server-side and creates a Razorpay order
3. Razorpay modal opens (loaded via CDN script)
4. On success → frontend calls `/api/orders/verify-payment`
5. Backend verifies HMAC signature → creates DB order → updates stock

For testing, use Razorpay test cards:
- **Card**: `4111 1111 1111 1111`, Expiry: any future date, CVV: any 3 digits

---

## 🚀 Deployment

### Frontend → Vercel

```bash
# From /frontend
npm run build

# Vercel CLI
vercel --prod

# Or connect your GitHub repo to vercel.com
```

Set environment variables in Vercel dashboard:
```
VITE_API_URL=https://your-backend.onrender.com/api
VITE_RAZORPAY_KEY_ID=rzp_live_xxxx
```

### Backend → Render / Railway

1. Push to GitHub
2. Create new Web Service on [render.com](https://render.com)
3. Build command: `npm install`
4. Start command: `npm start`
5. Set all environment variables from `.env`

### MongoDB → Atlas

1. Create cluster at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Get connection string
3. Add to `MONGO_URI` env var
4. Whitelist `0.0.0.0/0` for IPs (or your server IP)

---

## 🎨 Brand Design System

| Token | Value |
|-------|-------|
| Primary Orange | `#FF6B00` |
| Dark | `#1A1A1A` |
| Background | `#FFF8F2` |
| Display Font | Playfair Display |
| Body Font | DM Sans |

---

## 🎁 Bonus Features Included

- ✅ Product category filter (plain / flavoured)
- ✅ Full review system (rating + comment per user)
- ✅ Coupon system (% and flat, usage limits, expiry)
- ✅ Subscription order flag (ready for implementation)
- ✅ Stock management per variant
- ✅ Search across products
- ✅ Admin CRUD with modal forms
- ✅ Soft delete for products
- ✅ Rate limiting and security headers

---

## 📝 License

MIT — Free to use and modify.

---

Made with 🦊 by the Fox Khana team
