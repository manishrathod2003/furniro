const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById, // NEW import
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

router.route('/')
    .get(getProducts)
    .post(createProduct);

router.route('/:id')
    .get(getProductById) // NEW route for single product
    .put(updateProduct)
    .delete(deleteProduct);

module.exports = router;