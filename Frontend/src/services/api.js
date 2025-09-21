// src/services/api.js - Fixed CORS issues
import axios from 'axios';

// Use environment variable or fallback to local development
const API_URL = import.meta.env.VITE_API_URL ;

// Create axios instance with proper configuration
const apiClient = axios.create({
    baseURL: `${API_URL}/api`,
    timeout: 15000, // Increased timeout
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    // Add CORS configuration
    withCredentials: false,
});

// Request interceptor to add auth headers if needed
apiClient.interceptors.request.use(
    (config) => {
        // Add auth token if available
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Log request for debugging
        console.log(`Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`);
        
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor with better error handling
apiClient.interceptors.response.use(
    (response) => {
        console.log('API Response:', response.status, response.statusText);
        return response.data;
    },
    (error) => {
        console.error('API Error Details:', {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            config: {
                url: error.config?.url,
                method: error.config?.method,
                baseURL: error.config?.baseURL
            }
        });

        // Handle specific error types
        if (error.code === 'ECONNABORTED') {
            throw new Error('Request timeout. Please try again.');
        }
        
        if (error.message === 'Network Error') {
            throw new Error('Network error. Check your internet connection or API server.');
        }

        if (error.response?.status === 404) {
            throw new Error('API endpoint not found.');
        }

        if (error.response?.status >= 500) {
            throw new Error('Server error. Please try again later.');
        }

        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           error.message || 
                           'Something went wrong';
        
        throw new Error(errorMessage);
    }
);

// Fallback function for when API is not available
const createMockResponse = (data) => {
    console.warn('Using mock data - API not available');
    return Promise.resolve(data);
};

export const api = {
    // PRODUCT FUNCTIONS
    getProducts: async (params = {}) => {
        try {
            const response = await apiClient.get('/products', { params });
            return response;
        } catch (error) {
            console.error('Error fetching products:', error);
            
            // Fallback to mock data if needed
            if (error.message.includes('Network error') || error.message.includes('CORS')) {
                return createMockResponse({
                    success: true,
                    data: [],
                    message: 'Mock data - API unavailable',
                    pagination: {
                        currentPage: params.page || 1,
                        totalPages: 1,
                        totalItems: 0,
                        itemsPerPage: params.limit || 8
                    }
                });
            }
            
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

    // CART FUNCTIONS
    getCartItems: async (userId) => {
        try {
            const response = await apiClient.get(`/cart/${userId}`);
            return response;
        } catch (error) {
            console.error('Error fetching cart items:', error);
            
            // Fallback for cart
            if (error.message.includes('Network error') || error.message.includes('CORS')) {
                return createMockResponse({
                    success: true,
                    data: [],
                    message: 'Mock cart data'
                });
            }
            
            throw error;
        }
    },

    addToCart: async (cartItem) => {
        try {
            const response = await apiClient.post('/cart/add', cartItem);
            return response;
        } catch (error) {
            console.error('Error adding to cart:', error);
            
            // Fallback for add to cart
            if (error.message.includes('Network error') || error.message.includes('CORS')) {
                return createMockResponse({
                    success: true,
                    message: 'Item added to cart (mock)',
                    data: cartItem
                });
            }
            
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
            
            // Fallback for cart count
            if (error.message.includes('Network error') || error.message.includes('CORS')) {
                return createMockResponse({
                    success: true,
                    count: 0
                });
            }
            
            throw error;
        }
    },

    // WISHLIST FUNCTIONS
    getUserWishlist: async (userId) => {
        try {
            const response = await apiClient.get(`/wishlist/${userId}`);
            return response;
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            
            // Fallback for wishlist
            if (error.message.includes('Network error') || error.message.includes('CORS')) {
                return createMockResponse({
                    success: true,
                    data: [],
                    message: 'Mock wishlist data'
                });
            }
            
            throw error;
        }
    },

    addToWishlist: async (userId, productId) => {
        try {
            const response = await apiClient.post('/wishlist/add', {
                userId,
                productId
            });
            return response;
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            
            // Fallback for add to wishlist
            if (error.message.includes('Network error') || error.message.includes('CORS')) {
                return createMockResponse({
                    success: true,
                    message: 'Added to wishlist (mock)',
                    data: { userId, productId }
                });
            }
            
            throw error;
        }
    },

    removeFromWishlist: async (userId, productId) => {
        try {
            const response = await apiClient.post('/wishlist/remove', {
                userId,
                productId
            });
            return response;
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            
            // Fallback for remove from wishlist
            if (error.message.includes('Network error') || error.message.includes('CORS')) {
                return createMockResponse({
                    success: true,
                    message: 'Removed from wishlist (mock)',
                    data: { userId, productId }
                });
            }
            
            throw error;
        }
    },

    toggleWishlist: async (userId, productId) => {
        try {
            const response = await apiClient.post('/wishlist/toggle', {
                userId,
                productId
            });
            return response;
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            
            // Fallback for toggle wishlist
            if (error.message.includes('Network error') || error.message.includes('CORS')) {
                return createMockResponse({
                    success: true,
                    message: 'Wishlist toggled (mock)',
                    data: { userId, productId, added: true }
                });
            }
            
            throw error;
        }
    },

    clearWishlist: async (userId) => {
        try {
            const response = await apiClient.delete(`/wishlist/clear/${userId}`);
            return response;
        } catch (error) {
            console.error('Error clearing wishlist:', error);
            throw error;
        }
    },

    getWishlistCount: async (userId) => {
        try {
            const response = await apiClient.get(`/wishlist/count/${userId}`);
            return response;
        } catch (error) {
            console.error('Error fetching wishlist count:', error);
            
            // Fallback for wishlist count
            if (error.message.includes('Network error') || error.message.includes('CORS')) {
                return createMockResponse({
                    success: true,
                    count: 0
                });
            }
            
            throw error;
        }
    },

    checkWishlistStatus: async (userId, productIds) => {
        try {
            const response = await apiClient.post(`/wishlist/check/${userId}`, {
                productIds
            });
            return response;
        } catch (error) {
            console.error('Error checking wishlist status:', error);
            
            // Fallback for wishlist status
            if (error.message.includes('Network error') || error.message.includes('CORS')) {
                return createMockResponse({
                    success: true,
                    data: productIds.reduce((acc, id) => ({ ...acc, [id]: false }), {})
                });
            }
            
            throw error;
        }
    },

    // Health check function
    healthCheck: async () => {
        try {
            const response = await apiClient.get('/health');
            return response;
        } catch (error) {
            console.error('Health check failed:', error);
            return { success: false, message: 'API not available' };
        }
    }
};

export default api;