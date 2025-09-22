// index.js - Updated with wishlist routes
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const authRoutes = require('./routes/authRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes'); // NEW WISHLIST ROUTES

// Load env vars
dotenv.config();

// Connect to database
connectDB();



const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/wishlist', wishlistRoutes); // NEW WISHLIST ROUTES

// Basic route
app.get('/', (req, res) => {
    res.json({
        message: 'Furniro API is running...',
        endpoints: {
            products: '/api/products',
            cart: '/api/cart',
            auth: '/api/auth',
            wishlist: '/api/wishlist', // NEW ENDPOINT
            health: '/health'
        }
    });
});



// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`
    });
});

// Define PORT
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
   
});