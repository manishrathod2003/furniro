// src/services/api.js - Fixed routing and CORS issues
import axios from 'axios';

// Use environment variable with proper fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log('API Configuration:', {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    API_URL,
    NODE_ENV: import.meta.env.NODE_ENV
});

// Create axios instance with proper configuration
const apiClient = axios.create({
    baseURL: `${API_URL}/api`, // This creates: http://localhost:5000/api
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: false,
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Add auth token if available
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Log request for debugging
        console.log(`🚀 API Request:`, {
            method: config.method?.toUpperCase(),
            url: `${config.baseURL}${config.url}`,
            data: config.data,
            params: config.params
        });
        
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor with better error handling
apiClient.interceptors.response.use(
    (response) => {
        console.log('✅ API Response:', {
            status: response.status,
            url: response.config.url,
            data: response.data
        });
        return response.data;
    },
    (error) => {
        console.error('❌ API Error:', {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            url: error.config?.url,
            method: error.config?.method,
            data: error.response?.data
        });

        // Handle specific error types
        if (error.code === 'ECONNABORTED') {
            throw new Error('Request timeout. Please try again.');
        }
        
        if (error.message === 'Network Error') {
            throw new Error('Cannot connect to server. Please check if the backend is running.');
        }

        if (error.response?.status === 404) {
            throw new Error(`API endpoint not found: ${error.config?.url}`);
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

// Enhanced fallback function
const createMockResponse = (data, message = 'Using mock data - API unavailable') => {
    console.warn('⚠️ ' + message);
    return Promise.resolve(data);
};

export const api = {
    // Health check to test connectivity
    healthCheck: async () => {
        try {
            console.log('🔍 Testing API connectivity...');
            const response = await apiClient.get('/health');
            console.log('✅ API is reachable');
            return response;
        } catch (error) {
            console.error('❌ API health check failed:', error.message);
            return { 
                success: false, 
                message: 'API not available',
                error: error.message 
            };
        }
    },

    // PRODUCT FUNCTIONS
    getProducts: async (params = {}) => {
        try {
            // GET /api/products
            const response = await apiClient.get('/products', { params });
            return response;
        } catch (error) {
            console.error('Error fetching products:', error.message);
            
            // Fallback to mock data
            if (error.message.includes('Cannot connect') || error.message.includes('Network Error')) {
                return createMockResponse({
                    success: true,
                    data: [
                        {
                            id: 1,
                            name: 'Sample Product 1',
                            price: 99.99,
                            image: '/api/placeholder/300/300',
                            category: 'Sample Category'
                        },
                        {
                            id: 2,
                            name: 'Sample Product 2',
                            price: 149.99,
                            image: '/api/placeholder/300/300',
                            category: 'Sample Category'
                        }
                    ],
                    message: 'Mock product data',
                    pagination: {
                        currentPage: params.page || 1,
                        totalPages: 1,
                        totalItems: 2,
                        itemsPerPage: params.limit || 8
                    }
                });
            }
            
            throw error;
        }
    },

    getProductById: async (id) => {
        try {
            // GET /api/products/:id
            const response = await apiClient.get(`/products/${id}`);
            return response;
        } catch (error) {
            console.error(`Error fetching product ${id}:`, error.message);
            
            // Fallback for single product
            if (error.message.includes('Cannot connect') || error.message.includes('Network Error')) {
                return createMockResponse({
                    success: true,
                    data: {
                        id: id,
                        name: `Sample Product ${id}`,
                        price: 99.99,
                        description: 'This is a sample product description.',
                        image: '/api/placeholder/400/400',
                        category: 'Sample Category',
                        inStock: true
                    },
                    message: 'Mock product data'
                });
            }
            
            throw error;
        }
    },

    // CART FUNCTIONS
    getCartItems: async (userId) => {
        try {
            // GET /api/cart/:userId
            const response = await apiClient.get(`/cart/${userId}`);
            return response;
        } catch (error) {
            console.error('Error fetching cart items:', error.message);
            
            if (error.message.includes('Cannot connect') || error.message.includes('Network Error')) {
                return createMockResponse({
                    success: true,
                    data: [],
                    message: 'Mock cart data - empty cart'
                });
            }
            
            throw error;
        }
    },

    addToCart: async (cartItem) => {
        try {
            // POST /api/cart/add
            const response = await apiClient.post('/cart/add', cartItem);
            return response;
        } catch (error) {
            console.error('Error adding to cart:', error.message);
            
            if (error.message.includes('Cannot connect') || error.message.includes('Network Error')) {
                return createMockResponse({
                    success: true,
                    message: 'Item added to cart (mock mode)',
                    data: { ...cartItem, id: Date.now() }
                });
            }
            
            throw error;
        }
    },

    updateCartQuantity: async (itemId, quantity) => {
        try {
            // PUT /api/cart/update/:itemId
            const response = await apiClient.put(`/cart/update/${itemId}`, { quantity });
            return response;
        } catch (error) {
            console.error('Error updating cart quantity:', error.message);
            throw error;
        }
    },

    removeFromCart: async (itemId) => {
        try {
            // DELETE /api/cart/remove/:itemId
            const response = await apiClient.delete(`/cart/remove/${itemId}`);
            return response;
        } catch (error) {
            console.error('Error removing from cart:', error.message);
            throw error;
        }
    },

    clearCart: async (userId) => {
        try {
            // DELETE /api/cart/clear/:userId
            const response = await apiClient.delete(`/cart/clear/${userId}`);
            return response;
        } catch (error) {
            console.error('Error clearing cart:', error.message);
            throw error;
        }
    },

    getCartCount: async (userId) => {
        try {
            // GET /api/cart/count/:userId
            const response = await apiClient.get(`/cart/count/${userId}`);
            return response;
        } catch (error) {
            console.error('Error fetching cart count:', error.message);
            
            if (error.message.includes('Cannot connect') || error.message.includes('Network Error')) {
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
            // GET /api/wishlist/:userId
            const response = await apiClient.get(`/wishlist/${userId}`);
            return response;
        } catch (error) {
            console.error('Error fetching wishlist:', error.message);
            
            if (error.message.includes('Cannot connect') || error.message.includes('Network Error')) {
                return createMockResponse({
                    success: true,
                    data: [],
                    message: 'Mock wishlist data - empty wishlist'
                });
            }
            
            throw error;
        }
    },

    addToWishlist: async (userId, productId) => {
        try {
            // POST /api/wishlist/add
            const response = await apiClient.post('/wishlist/add', {
                userId,
                productId
            });
            return response;
        } catch (error) {
            console.error('Error adding to wishlist:', error.message);
            
            if (error.message.includes('Cannot connect') || error.message.includes('Network Error')) {
                return createMockResponse({
                    success: true,
                    message: 'Added to wishlist (mock mode)',
                    data: { userId, productId }
                });
            }
            
            throw error;
        }
    },

    removeFromWishlist: async (userId, productId) => {
        try {
            // POST /api/wishlist/remove
            const response = await apiClient.post('/wishlist/remove', {
                userId,
                productId
            });
            return response;
        } catch (error) {
            console.error('Error removing from wishlist:', error.message);
            
            if (error.message.includes('Cannot connect') || error.message.includes('Network Error')) {
                return createMockResponse({
                    success: true,
                    message: 'Removed from wishlist (mock mode)',
                    data: { userId, productId }
                });
            }
            
            throw error;
        }
    },

    toggleWishlist: async (userId, productId) => {
        try {
            // POST /api/wishlist/toggle
            const response = await apiClient.post('/wishlist/toggle', {
                userId,
                productId
            });
            return response;
        } catch (error) {
            console.error('Error toggling wishlist:', error.message);
            
            if (error.message.includes('Cannot connect') || error.message.includes('Network Error')) {
                return createMockResponse({
                    success: true,
                    message: 'Wishlist toggled (mock mode)',
                    data: { userId, productId, added: true }
                });
            }
            
            throw error;
        }
    },

    clearWishlist: async (userId) => {
        try {
            // DELETE /api/wishlist/clear/:userId
            const response = await apiClient.delete(`/wishlist/clear/${userId}`);
            return response;
        } catch (error) {
            console.error('Error clearing wishlist:', error.message);
            throw error;
        }
    },

    getWishlistCount: async (userId) => {
        try {
            // GET /api/wishlist/count/:userId
            const response = await apiClient.get(`/wishlist/count/${userId}`);
            return response;
        } catch (error) {
            console.error('Error fetching wishlist count:', error.message);
            
            if (error.message.includes('Cannot connect') || error.message.includes('Network Error')) {
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
            // POST /api/wishlist/check/:userId
            const response = await apiClient.post(`/wishlist/check/${userId}`, {
                productIds
            });
            return response;
        } catch (error) {
            console.error('Error checking wishlist status:', error.message);
            
            if (error.message.includes('Cannot connect') || error.message.includes('Network Error')) {
                return createMockResponse({
                    success: true,
                    data: productIds.reduce((acc, id) => ({ ...acc, [id]: false }), {})
                });
            }
            
            throw error;
        }
    }
};

// Test API connectivity on module load
api.healthCheck().then(result => {
    if (result.success) {
        console.log('🎉 API connection established successfully');
    } else {
        console.warn('⚠️ API not available, using mock data mode');
    }
});

export default api;