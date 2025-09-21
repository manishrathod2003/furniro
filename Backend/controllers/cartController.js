// controllers/cartController.js
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get all cart items for a user
const getCartItems = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const cartItems = await Cart.find({ userId }).populate('productId');
        
        res.json({
            success: true,
            data: cartItems,
            count: cartItems.length
        });
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching cart items'
        });
    }
};

// Add item to cart
const addToCart = async (req, res) => {
    try {
        const {
            userId,
            productId,
            name,
            price,
            quantity,
            size,
            color,
            image
        } = req.body;

        // Validation
        if (!userId || !productId || !name || !price || !quantity) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
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

        // Check if item with same product, size, and color already exists
        const existingItem = await Cart.findOne({
            userId,
            productId,
            size: size || 'L',
            color: color || ''
        });

        if (existingItem) {
            // Update quantity if item exists
            existingItem.quantity += parseInt(quantity);
            await existingItem.save();
            
            res.json({
                success: true,
                message: 'Cart item quantity updated',
                data: existingItem
            });
        } else {
            // Add new item to cart
            const newCartItem = new Cart({
                userId,
                productId,
                name,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                size: size || 'L',
                color: color || '',
                image: image || product.image
            });

            await newCartItem.save();

            res.json({
                success: true,
                message: 'Item added to cart successfully',
                data: newCartItem
            });
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while adding item to cart'
        });
    }
};

// Update cart item quantity
const updateCartQuantity = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Invalid quantity'
            });
        }

        const updatedItem = await Cart.findByIdAndUpdate(
            itemId,
            { quantity: parseInt(quantity) },
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }

        res.json({
            success: true,
            message: 'Cart item quantity updated',
            data: updatedItem
        });
    } catch (error) {
        console.error('Error updating cart quantity:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating cart item'
        });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.params;

        const removedItem = await Cart.findByIdAndDelete(itemId);

        if (!removedItem) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }

        res.json({
            success: true,
            message: 'Item removed from cart',
            data: removedItem
        });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while removing cart item'
        });
    }
};

// Clear all items from user's cart
const clearCart = async (req, res) => {
    try {
        const { userId } = req.params;

        const result = await Cart.deleteMany({ userId });

        res.json({
            success: true,
            message: `Removed ${result.deletedCount} items from cart`,
            removedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while clearing cart'
        });
    }
};

// Get cart count for a user
const getCartCount = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const cartItems = await Cart.find({ userId });
        const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

        res.json({
            success: true,
            count: totalCount
        });
    } catch (error) {
        console.error('Error fetching cart count:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching cart count'
        });
    }
};

module.exports = {
    getCartItems,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getCartCount
};