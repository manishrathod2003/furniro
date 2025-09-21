// routes/wishlistRoutes.js
const express = require('express');
const router = express.Router();
const {
    getUserWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    getWishlistCount,
    checkWishlistStatus
} = require('../controllers/wishlistController');

// @route   GET /api/wishlist/:userId
// @desc    Get user's wishlist
// @access  Public (should be protected in production)
router.get('/:userId', getUserWishlist);

// @route   POST /api/wishlist/add
// @desc    Add product to wishlist
// @access  Public (should be protected in production)
router.post('/add', addToWishlist);

// @route   POST /api/wishlist/remove
// @desc    Remove product from wishlist
// @access  Public (should be protected in production)
router.post('/remove', removeFromWishlist);

// @route   POST /api/wishlist/toggle
// @desc    Toggle product in wishlist (add/remove)
// @access  Public (should be protected in production)
router.post('/toggle', toggleWishlist);

// @route   DELETE /api/wishlist/clear/:userId
// @desc    Clear user's entire wishlist
// @access  Public (should be protected in production)
router.delete('/clear/:userId', clearWishlist);

// @route   GET /api/wishlist/count/:userId
// @desc    Get wishlist count for user
// @access  Public (should be protected in production)
router.get('/count/:userId', getWishlistCount);

// @route   POST /api/wishlist/check/:userId
// @desc    Check if products are in user's wishlist
// @access  Public (should be protected in production)
router.post('/check/:userId', checkWishlistStatus);

module.exports = router;