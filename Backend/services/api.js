// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const api = {
    // Get products with filters, sorting, pagination
    getProducts: async (params) => {
        const response = await axios.get(`${API_URL}/products`, { params });
        return response.data;
    },

    // Get single product by ID
    getProductById: async (id) => {
        const response = await axios.get(`${API_URL}/products/${id}`);
        return response.data;
    },

    // Create new product
    createProduct: async (productData) => {
        const response = await axios.post(`${API_URL}/products`, productData);
        return response.data;
    },

    // Update product
    updateProduct: async (id, productData) => {
        const response = await axios.put(`${API_URL}/products/${id}`, productData);
        return response.data;
    },

    // Delete product
    deleteProduct: async (id) => {
        const response = await axios.delete(`${API_URL}/products/${id}`);
        return response.data;
    },

    // Get related products (mock implementation using existing API)
    getRelatedProducts: async (category, excludeId) => {
        const params = { category, limit: 4 };
        const response = await axios.get(`${API_URL}/products`, { params });
        // Filter out the current product
        const relatedProducts = response.data.products.filter(product => 
            product._id !== excludeId
        ).slice(0, 4);
        return relatedProducts;
    }
};