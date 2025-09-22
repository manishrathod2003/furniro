// index.js - Fixed and improved server configuration
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet'); // Add this dependency
const rateLimit = require('express-rate-limit'); // Add this dependency
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const authRoutes = require('./routes/authRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');

// Load env vars FIRST
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars);
    console.error('Please check your .env file');
    process.exit(1);
}

const app = express();

// Trust proxy for rate limiting (if behind proxy/load balancer)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply rate limiting to all requests
app.use('/api/', limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs for auth
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later.'
    }
});

// CORS configuration with environment-based origins
const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL] // Set this in production .env
    : [
        'http://localhost:3000', 
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000'
    ];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            console.warn(`Blocked CORS request from origin: ${origin}`);
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware with limits
app.use(express.json({ 
    limit: '10mb',
    verify: (req, res, buf) => {
        try {
            JSON.parse(buf);
        } catch (e) {
            res.status(400).json({
                success: false,
                message: 'Invalid JSON format'
            });
            throw new Error('Invalid JSON');
        }
    }
}));

app.use(express.urlencoded({ 
    extended: true, 
    limit: '10mb' 
}));

// Request logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} - ${req.method} ${req.path} - IP: ${req.ip}`);
    next();
});

// Connect to database with error handling
connectDB()
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch((error) => {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    });

// Health check route (before other routes for faster response)
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running successfully',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '1.0.0'
    });
});

// API Routes with proper prefixes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/auth', authLimiter, authRoutes); // Apply stricter rate limiting to auth
app.use('/api/wishlist', wishlistRoutes);

// Basic route with API documentation
app.get('/', (req, res) => {
    res.json({
        message: 'Furniro API is running...',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        endpoints: {
            health: '/health',
            products: {
                base: '/api/products',
                methods: ['GET', 'POST', 'PUT', 'DELETE']
            },
            cart: {
                base: '/api/cart',
                methods: ['GET', 'POST', 'PUT', 'DELETE']
            },
            auth: {
                base: '/api/auth',
                methods: ['POST'],
                note: 'Rate limited to 10 requests per 15 minutes'
            },
            wishlist: {
                base: '/api/wishlist',
                methods: ['GET', 'POST', 'DELETE']
            }
        },
        documentation: {
            swagger: '/api/docs', // If you add Swagger later
            postman: '/api/postman.json' // If you add Postman collection
        }
    });
});

// Catch-all for API routes that don't exist
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `API endpoint ${req.method} ${req.originalUrl} not found`,
        availableEndpoints: [
            '/api/products',
            '/api/cart', 
            '/api/auth',
            '/api/wishlist'
        ]
    });
});

// Global error handling middleware
app.use((error, req, res, next) => {
    // Log the full error for debugging
    console.error('Error occurred:', {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        timestamp: new Date().toISOString()
    });

    // Handle specific error types
    if (error.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            details: Object.values(error.errors).map(err => err.message)
        });
    }

    if (error.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'Invalid ID format'
        });
    }

    if (error.code === 11000) {
        return res.status(400).json({
            success: false,
            message: 'Duplicate field value'
        });
    }

    if (error.message === 'Not allowed by CORS') {
        return res.status(403).json({
            success: false,
            message: 'CORS policy violation'
        });
    }

    // Default error response
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? {
            stack: error.stack,
            details: error
        } : undefined
    });
});

// 404 handler for non-API routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`,
        suggestion: 'Check the API documentation at the root endpoint /'
    });
});

// Define PORT with validation
const PORT = process.env.PORT || 5000;

if (isNaN(PORT) || PORT < 1 || PORT > 65535) {
    console.error('Invalid PORT number:', PORT);
    process.exit(1);
}

// Graceful shutdown handling
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Process terminated');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    server.close(() => {
        console.log('Process terminated');
        process.exit(0);
    });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err.message);
    console.error('Shutting down server...');
    server.close(() => {
        process.exit(1);
    });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`
🚀 Server is running successfully!
📍 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
🕒 Started at: ${new Date().toISOString()}

📚 Available endpoints:
├── Health Check: http://localhost:${PORT}/health
├── Products:     http://localhost:${PORT}/api/products
├── Cart:         http://localhost:${PORT}/api/cart
├── Auth:         http://localhost:${PORT}/api/auth (rate limited)
└── Wishlist:     http://localhost:${PORT}/api/wishlist

🔒 Security features enabled:
├── CORS protection
├── Rate limiting
├── Helmet security headers
└── Request size limits

${process.env.NODE_ENV === 'development' ? '⚠️  Development mode - detailed errors enabled' : '✅ Production mode - secure error handling'}
    `);
});

module.exports = app;