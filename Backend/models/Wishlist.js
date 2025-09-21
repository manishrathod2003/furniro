// models/Wishlist.js - Fixed version
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

// Check if model already exists before creating it
module.exports = mongoose.models.Wishlist || mongoose.model('Wishlist', wishlistSchema);