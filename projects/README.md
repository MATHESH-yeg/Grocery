# Grocery Delivery Website - Full Stack Application

A complete grocery delivery web application built with React, Node.js, Express, MongoDB, and Stripe test payments.

## Features

- **User Module**: Registration, login, profile management, address book, order history
- **Product Module**: Category-wise listings, search, filters, product details
- **Cart & Checkout**: Add/remove items, bill estimation, checkout flow
- **Payment Integration**: Stripe test payment (demo mode)
- **Admin Panel**: Dashboard with statistics, product management, order management, user management
- **Secure Access**: JWT authentication, admin-only routes protection

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Stripe (Test Mode)

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Stripe account (for test keys)

### 1. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/grocery_delivery
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/grocery_delivery?retryWrites=true&w=majority

JWT_SECRET=your_super_secret_jwt_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

**Important**: 
- For MongoDB Atlas, whitelist your IP address in Network Access settings
- Get Stripe test keys from https://dashboard.stripe.com/test/apikeys

### 2. Create Admin User (Owner)

**This is required to access the admin panel!**

```bash
cd server
node createAdmin.js
```

Follow the prompts to create your admin account. This will be the owner account that can manage the entire website.

### 3. Seed Sample Products (Optional)

```bash
cd server
node seedProducts.js
```

This will populate your database with sample grocery products.

### 4. Start Backend Server

```bash
cd server
npm start
```

Server will run on `http://localhost:5000`

### 5. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`

## Admin Panel Access

1. **Create Admin Account**: Run `node createAdmin.js` in the server directory
2. **Login**: Use the admin credentials you created
3. **Access Admin Panel**: Navigate to `/admin` in your browser

### Admin Features

- **Dashboard**: View statistics (users, products, orders, revenue)
- **Products**: Add, edit, delete products and manage stock
- **Orders**: View all orders and update order status (placed → packed → shipped → delivered)
- **Users**: View all users, change user roles, delete users

### Admin Routes Protection

- All admin routes are protected by authentication middleware
- Only users with `role: 'admin'` can access admin pages
- Non-admin users are automatically redirected to home page

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products (with filters: category, search, sortBy)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:productId` - Update cart item quantity
- `DELETE /api/cart/:productId` - Remove item from cart

### Orders
- `POST /api/orders` - Place new order
- `GET /api/orders/me` - Get user's orders
- `GET /api/orders` - Get all orders (Admin only)
- `PUT /api/orders/:id/status` - Update order status (Admin only)

### Payment
- `POST /api/payment/create-intent` - Create Stripe payment intent (Test mode)

### Admin
- `GET /api/admin/stats` - Get dashboard statistics (Admin only)
- `GET /api/admin/users` - Get all users (Admin only)
- `PUT /api/admin/users/:id/role` - Update user role (Admin only)
- `DELETE /api/admin/users/:id` - Delete user (Admin only)

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/        # React contexts (Auth, Cart)
│   │   ├── utils/          # Utility functions
│   │   └── hooks/          # Custom hooks
│   └── package.json
│
├── server/                 # Express backend
│   ├── controllers/        # Route controllers
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── middlewares/        # Auth & admin middleware
│   ├── config/             # Configuration files
│   └── package.json
│
└── README.md
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected routes (user & admin)
- Admin-only API endpoints
- Input validation
- Error handling

## Notes

- **Payment is in test mode**: Use Stripe test cards (4242 4242 4242 4242)
- **Admin access**: Only users created via `createAdmin.js` or promoted by existing admins can access admin panel
- **MongoDB**: Ensure MongoDB is running and accessible before starting the server

## Troubleshooting

### MongoDB Connection Issues
- Check if MongoDB is running (local) or IP is whitelisted (Atlas)
- Verify `MONGO_URI` in `.env` file
- Check network connectivity

### Admin Access Denied
- Ensure you created an admin account using `createAdmin.js`
- Check that your user has `role: 'admin'` in the database
- Verify JWT token is being sent in requests

### Products Not Showing
- Run `node seedProducts.js` to add sample products
- Or add products via admin panel at `/admin/products`

## License

This project is for educational purposes.






