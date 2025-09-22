// src/services/api.js - FIXED: Remove double /api issue
import axios from 'axios';

// Use environment variable with proper fallback
const API_URL = import.meta.env.VITE_API_URL ;

console.log('API Configuration:', {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    API_URL,
    NODE_ENV: import.meta.env.NODE_ENV
});

// Create axios instance with FIXED configuration
const apiClient = axios.create({
    baseURL: API_URL, // ✅ FIXED: No /api here, will be added in individual routes
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
            const response = await apiClient.get('/health'); // ✅ FIXED: /health (not /api/health)
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
            // ✅ FIXED: GET /api/products (single /api)
            const response = await apiClient.get('/api/products', { params });
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
                            name: 'Syltherine',
                            description: 'Stylish cafe chair',
                            price: 2500000,
                            originalPrice: 3500000,
                            discount: 30,
                            image: '/images/product1.jpg',
                            category: 'Chair'
                        },
                        {
                            id: 2,
                            name: 'Leviosa',
                            description: 'Stylish cafe chair',
                            price: 2500000,
                            image: '/images/product2.jpg',
                            category: 'Chair'
                        },
                        {
                            id: 3,
                            name: 'Lolito',
                            description: 'Luxury big sofa',
                            price: 7000000,
                            originalPrice: 14000000,
                            discount: 50,
                            image: '/images/product3.jpg',
                            category: 'Sofa'
                        },
                        {
                            id: 4,
                            name: 'Respira',
                            description: 'Outdoor bar table and stool',
                            price: 500000,
                            image: '/images/product4.jpg',
                            category: 'Table',
                            isNew: true
                        }
                    ],
                    message: 'Mock product data',
                    pagination: {
                        currentPage: params.page || 1,
                        totalPages: 1,
                        totalItems: 4,
                        itemsPerPage: params.limit || 8
                    }
                });
            }
            
            throw error;
        }
    },

    getProductById: async (id) => {
        try {
            // ✅ FIXED: GET /api/products/:id (single /api)
            const response = await apiClient.get(`/api/products/${id}`);
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
            // ✅ FIXED: GET /api/cart/:userId (single /api)
            const response = await apiClient.get(`/api/cart/${userId}`);
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
            // ✅ FIXED: POST /api/cart/add (single /api)
            const response = await apiClient.post('/api/cart/add', cartItem);
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
            // ✅ FIXED: PUT /api/cart/update/:itemId (single /api)
            const response = await apiClient.put(`/api/cart/update/${itemId}`, { quantity });
            return response;
        } catch (error) {
            console.error('Error updating cart quantity:', error.message);
            throw error;
        }
    },

    removeFromCart: async (itemId) => {
        try {
            // ✅ FIXED: DELETE /api/cart/remove/:itemId (single /api)
            const response = await apiClient.delete(`/api/cart/remove/${itemId}`);
            return response;
        } catch (error) {
            console.error('Error removing from cart:', error.message);
            throw error;
        }
    },

    clearCart: async (userId) => {
        try {
            // ✅ FIXED: DELETE /api/cart/clear/:userId (single /api)
            const response = await apiClient.delete(`/api/cart/clear/${userId}`);
            return response;
        } catch (error) {
            console.error('Error clearing cart:', error.message);
            throw error;
        }
    },

    getCartCount: async (userId) => {
        try {
            // ✅ FIXED: GET /api/cart/count/:userId (single /api)
            const response = await apiClient.get(`/api/cart/count/${userId}`);
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
            // ✅ FIXED: GET /api/wishlist/:userId (single /api)
            const response = await apiClient.get(`/api/wishlist/${userId}`);
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
            // ✅ FIXED: POST /api/wishlist/add (single /api)
            const response = await apiClient.post('/api/wishlist/add', {
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
            // ✅ FIXED: POST /api/wishlist/remove (single /api)
            const response = await apiClient.post('/api/wishlist/remove', {
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
            // ✅ FIXED: POST /api/wishlist/toggle (single /api)
            const response = await apiClient.post('/api/wishlist/toggle', {
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
            // ✅ FIXED: DELETE /api/wishlist/clear/:userId (single /api)
            const response = await apiClient.delete(`/api/wishlist/clear/${userId}`);
            return response;
        } catch (error) {
            console.error('Error clearing wishlist:', error.message);
            throw error;
        }
    },

    getWishlistCount: async (userId) => {
        try {
            // ✅ FIXED: GET /api/wishlist/count/:userId (single /api)
            const response = await apiClient.get(`/api/wishlist/count/${userId}`);
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
            // ✅ FIXED: POST /api/wishlist/check/:userId (single /api)
            const response = await apiClient.post(`/api/wishlist/check/${userId}`, {
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