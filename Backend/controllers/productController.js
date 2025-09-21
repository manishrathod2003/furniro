const Product = require('../models/Product');

// Get all products with filtering, sorting and pagination (keeping same)
const getProducts = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            sort,
            order = 'asc',
            brand,
            category,
            minPrice,
            maxPrice,
            search
        } = req.query;

        // Build filter object
        const filter = {};
        if (brand) filter.brand = brand;
        if (category) filter.category = category;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        
        // Add search functionality
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } }
            ];
        }

        // Build sort object
        const sortObj = {};
        if (sort) {
            sortObj[sort] = order === 'asc' ? 1 : -1;
        } else {
            sortObj.createdAt = -1; // Default sort by newest
        }

        const products = await Product.find(filter)
            .sort(sortObj)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Product.countDocuments(filter);

        // Transform products to include all necessary fields
        const transformedProducts = products.map(product => {
            const productObj = product.toObject();
            
            // Ensure images array exists
            if (!productObj.images || productObj.images.length === 0) {
                productObj.images = [{ url: product.image, alt: product.name, isMain: true }];
            }
            
            // Set shortDescription if not exists
            if (!productObj.shortDescription) {
                productObj.shortDescription = product.description.substring(0, 100) + '...';
            }

            return productObj;
        });

        res.json({
            products: transformedProducts,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page),
            totalProducts: total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single product by ID (NEW)
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const productObj = product.toObject();
        
        // Ensure images array exists
        if (!productObj.images || productObj.images.length === 0) {
            productObj.images = [
                { url: product.image, alt: product.name, isMain: true },
                { url: product.image, alt: `${product.name} view 2` },
                { url: product.image, alt: `${product.name} view 3` }
            ];
        }
        
        // Set shortDescription if not exists
        if (!productObj.shortDescription) {
            productObj.shortDescription = product.description.substring(0, 150) + '...';
        }

        // Get related products (same category, excluding current product)
        const relatedProducts = await Product.find({
            _id: { $ne: product._id },
            category: product.category,
            status: 'active'
        }).limit(4).select('name price originalPrice image description brand');

        // Transform related products
        const transformedRelated = relatedProducts.map(related => {
            const relatedObj = related.toObject();
            if (!relatedObj.images) {
                relatedObj.images = [{ url: related.image, alt: related.name, isMain: true }];
            }
            if (!relatedObj.shortDescription) {
                relatedObj.shortDescription = related.description.substring(0, 50) + '...';
            }
            return relatedObj;
        });

        productObj.relatedProducts = transformedRelated;

        res.json(productObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new product (keeping same)
const createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update product (keeping same)
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id, 
            req.body,
            { new: true }
        );
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete product (keeping same)
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById, // NEW export
    createProduct,
    updateProduct,
    deleteProduct
};