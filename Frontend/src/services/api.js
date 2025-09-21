// src/services/api.js - Updated with wishlist functions
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance
const apiClient = axios.create({
    baseURL: `${API_URL}/api`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor
apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           error.message || 
                           'Something went wrong';
        throw new Error(errorMessage);
    }
);

export const api = {
    // EXISTING PRODUCT FUNCTIONS
    getProducts: async (params = {}) => {
        try {
            const response = await apiClient.get('/products', { params });
            return response;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    getProductById: async (id) => {
        try {
            const response = await apiClient.get(`/products/${id}`);
            return response;
        } catch (error) {
            console.error('Error fetching product by ID:', error);
            throw error;
        }
    },

    // EXISTING CART FUNCTIONS
    getCartItems: async (userId) => {
        try {
            const response = await apiClient.get(`/cart/${userId}`);
            return response;
        } catch (error) {
            console.error('Error fetching cart items:', error);
            throw error;
        }
    },

    addToCart: async (cartItem) => {
        try {
            const response = await apiClient.post('/cart/add', cartItem);
            return response;
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    },

    updateCartQuantity: async (itemId, quantity) => {
        try {
            const response = await apiClient.put(`/cart/update/${itemId}`, { quantity });
            return response;
        } catch (error) {
            console.error('Error updating cart quantity:', error);
            throw error;
        }
    },

    removeFromCart: async (itemId) => {
        try {
            const response = await apiClient.delete(`/cart/remove/${itemId}`);
            return response;
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    },

    clearCart: async (userId) => {
        try {
            const response = await apiClient.delete(`/cart/clear/${userId}`);
            return response;
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    },

    getCartCount: async (userId) => {
        try {
            const response = await apiClient.get(`/cart/count/${userId}`);
            return response;
        } catch (error) {
            console.error('Error fetching cart count:', error);
            throw error;
        }
    },

    // NEW WISHLIST FUNCTIONS
    // Get user's complete wishlist
    getUserWishlist: async (userId) => {
        try {
            const response = await apiClient.get(`/wishlist/${userId}`);
            return response;
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            throw error;
        }
    },

    // Add product to wishlist
    addToWishlist: async (userId, productId) => {
        try {
            const response = await apiClient.post('/wishlist/add', {
                userId,
                productId
            });
            return response;
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            throw error;
        }
    },

    // Remove product from wishlist
    removeFromWishlist: async (userId, productId) => {
        try {
            const response = await apiClient.post('/wishlist/remove', {
                userId,
                productId
            });
            return response;
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            throw error;
        }
    },

    // Toggle wishlist (add if not exists, remove if exists)
    toggleWishlist: async (userId, productId) => {
        try {
            const response = await apiClient.post('/wishlist/toggle', {
                userId,
                productId
            });
            return response;
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            throw error;
        }
    },

    // Clear entire wishlist
    clearWishlist: async (userId) => {
        try {
            const response = await apiClient.delete(`/wishlist/clear/${userId}`);
            return response;
        } catch (error) {
            console.error('Error clearing wishlist:', error);
            throw error;
        }
    },

    // Get wishlist count for navbar
    getWishlistCount: async (userId) => {
        try {
            const response = await apiClient.get(`/wishlist/count/${userId}`);
            return response;
        } catch (error) {
            console.error('Error fetching wishlist count:', error);
            throw error;
        }
    },

    // Check if multiple products are in user's wishlist
    checkWishlistStatus: async (userId, productIds) => {
        try {
            const response = await apiClient.post(`/wishlist/check/${userId}`, {
                productIds
            });
            return response;
        } catch (error) {
            console.error('Error checking wishlist status:', error);
            throw error;
        }
    }
};

export default api;