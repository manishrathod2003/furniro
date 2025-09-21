// models/Wishlist.js
const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound index to ensure user can't add same product twice
wishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);

// controllers/wishlistController.js
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// Get user's wishlist
const getUserWishlist = async (req, res) => {
    try {
        const { userId } = req.params;

        const wishlistItems = await Wishlist.find({ userId })
            .populate('productId')
            .sort({ createdAt: -1 });

        // Filter out any items where product no longer exists
        const validWishlistItems = wishlistItems.filter(item => item.productId);

        res.json({
            success: true,
            data: validWishlistItems,
            count: validWishlistItems.length
        });
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching wishlist'
        });
    }
};

// Add product to wishlist
const addToWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        // Validation
        if (!userId || !productId) {
            return res.status(400).json({
                success: false,
                message: 'User ID and Product ID are required'
            });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check if item already in wishlist
        const existingWishlistItem = await Wishlist.findOne({ userId, productId });
        if (existingWishlistItem) {
            return res.status(409).json({
                success: false,
                message: 'Product already in wishlist'
            });
        }

        // Add to wishlist
        const wishlistItem = new Wishlist({
            userId,
            productId
        });

        await wishlistItem.save();

        // Populate the product details for response
        await wishlistItem.populate('productId');

        res.status(201).json({
            success: true,
            message: 'Product added to wishlist successfully',
            data: wishlistItem
        });
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Product already in wishlist'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error while adding to wishlist'
        });
    }
};

// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const removedItem = await Wishlist.findOneAndDelete({ userId, productId });

        if (!removedItem) {
            return res.status(404).json({
                success: false,
                message: 'Product not found in wishlist'
            });
        }

        res.json({
            success: true,
            message: 'Product removed from wishlist successfully',
            data: removedItem
        });
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while removing from wishlist'
        });
    }
};

// Toggle wishlist (add if not exists, remove if exists)
const toggleWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        // Validation
        if (!userId || !productId) {
            return res.status(400).json({
                success: false,
                message: 'User ID and Product ID are required'
            });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check if item already in wishlist
        const existingWishlistItem = await Wishlist.findOne({ userId, productId });

        if (existingWishlistItem) {
            // Remove from wishlist
            await Wishlist.findOneAndDelete({ userId, productId });
            return res.json({
                success: true,
                message: 'Product removed from wishlist',
                action: 'removed',
                isLiked: false
            });
        } else {
            // Add to wishlist
            const wishlistItem = new Wishlist({
                userId,
                productId
            });
            await wishlistItem.save();
            
            return res.json({
                success: true,
                message: 'Product added to wishlist',
                action: 'added',
                isLiked: true,
                data: wishlistItem
            });
        }
    } catch (error) {
        console.error('Error toggling wishlist:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating wishlist'
        });
    }
};

// Clear entire wishlist
const clearWishlist = async (req, res) => {
    try {
        const { userId } = req.params;

        const result = await Wishlist.deleteMany({ userId });

        res.json({
            success: true,
            message: `Removed ${result.deletedCount} items from wishlist`,
            removedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Error clearing wishlist:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while clearing wishlist'
        });
    }
};

// Get wishlist count for a user
const getWishlistCount = async (req, res) => {
    try {
        const { userId } = req.params;

        const count = await Wishlist.countDocuments({ userId });

        res.json({
            success: true,
            count
        });
    } catch (error) {
        console.error('Error fetching wishlist count:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching wishlist count'
        });
    }
};

// Check if products are in user's wishlist
const checkWishlistStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { productIds } = req.body; // Array of product IDs

        if (!Array.isArray(productIds)) {
            return res.status(400).json({
                success: false,
                message: 'Product IDs should be an array'
            });
        }

        const wishlistItems = await Wishlist.find({
            userId,
            productId: { $in: productIds }
        });

        const likedProductIds = wishlistItems.map(item => item.productId.toString());

        res.json({
            success: true,
            likedProducts: likedProductIds
        });
    } catch (error) {
        console.error('Error checking wishlist status:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while checking wishlist status'
        });
    }
};

module.exports = {
    getUserWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    getWishlistCount,
    checkWishlistStatus
};