// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - Verify JWT token
const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Make sure token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Get user from token
            const user = await User.findById(decoded.id);
            
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token. User not found.'
                });
            }

            if (!user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Account has been deactivated.'
                });
            }

            // Add user to request object
            req.user = user;
            next();

        } catch (tokenError) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token.'
            });
        }

    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error in authentication'
        });
    }
};

// Optional auth - Get user if token exists but don't block if no token
const optionalAuth = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (token) {
            try {
                // Verify token
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                
                // Get user from token
                const user = await User.findById(decoded.id);
                
                if (user && user.isActive) {
                    req.user = user;
                }
            } catch (tokenError) {
                // Token is invalid, but we continue without user
                console.log('Optional auth: Invalid token, continuing without user');
            }
        }

        next();

    } catch (error) {
        console.error('Optional auth middleware error:', error);
        next(); // Continue even if there's an error
    }
};

// Admin only access
const adminOnly = async (req, res, next) => {
    try {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }
    } catch (error) {
        console.error('Admin middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error in authorization'
        });
    }
};

// Check if user owns resource (for cart operations)
const checkOwnership = (req, res, next) => {
    try {
        const { userId } = req.params;
        const requestUserId = req.body.userId;
        
        // Check if the authenticated user matches the requested user
        if (req.user.id !== userId && req.user.id !== requestUserId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only access your own resources.'
            });
        }
        
        next();
    } catch (error) {
        console.error('Ownership check error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error in ownership verification'
        });
    }
};

module.exports = {
    protect,
    optionalAuth,
    adminOnly,
    checkOwnership
};