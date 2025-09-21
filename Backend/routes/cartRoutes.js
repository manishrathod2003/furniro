// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const {
    getCartItems,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getCartCount
} = require('../controllers/cartController');

// @route   GET /api/cart/:userId
// @desc    Get all cart items for a user
// @access  Public
router.get('/:userId', getCartItems);

// @route   POST /api/cart/add
// @desc    Add item to cart
// @access  Public
router.post('/add', addToCart);

// @route   PUT /api/cart/update/:itemId
// @desc    Update cart item quantity
// @access  Public
router.put('/update/:itemId', updateCartQuantity);

// @route   DELETE /api/cart/remove/:itemId
// @desc    Remove item from cart
// @access  Public
router.delete('/remove/:itemId', removeFromCart);

// @route   DELETE /api/cart/clear/:userId
// @desc    Clear all items from user's cart
// @access  Public
router.delete('/clear/:userId', clearCart);

// @route   GET /api/cart/count/:userId
// @desc    Get cart items count for a user
// @access  Public
router.get('/count/:userId', getCartCount);

module.exports = router;