// Backend folder mein seedProducts.js banao
const mongoose = require('mongoose');
const Product = require('./models/Product'); // Path adjust karo
const connectDB = require('./config/db'); // Path adjust karo
require('dotenv').config();

const sampleProducts = [
    {
        name: "Modern Dining Chair",
        brand: "Furniro",
        category: "Seating",
        price: 1200000,
        originalPrice: 1500000,
        description: "Comfortable modern chair perfect for dining area. Made with premium materials and ergonomic design for maximum comfort during long meals.",
        shortDescription: "Comfortable modern chair perfect for dining area",
        image: "/src/images/cafe_chair1.png",
        images: [
            { url: "/src/images/cafe_chair1.png", alt: "Modern Dining Chair Front", isMain: true },
            { url: "/src/images/cafe_chair1_side.png", alt: "Modern Dining Chair Side", isMain: false }
        ],
        sku: "MDC001",
        variants: {
            sizes: [
                { name: "Standard", available: true, stock: 15 }
            ],
            colors: [
                { name: "Black", hexCode: "#000000", available: true },
                { name: "Brown", hexCode: "#8B4513", available: true },
                { name: "White", hexCode: "#FFFFFF", available: true }
            ]
        },
        stock: 25,
        averageRating: 4.5,
        totalReviews: 12,
        tags: ["dining", "modern", "comfortable", "chair"],
        isNew: true
    },
    {
        name: "Cafe Style Chair",
        brand: "Urban Living",
        category: "Seating",
        price: 680000,
        originalPrice: 850000,
        description: "Stylish cafe chair with premium quality materials. Perfect for modern kitchens, cafes, and contemporary dining spaces.",
        shortDescription: "Stylish cafe chair with premium quality",
        image: "/src/images/cafe_chair2.png",
        images: [
            { url: "/src/images/cafe_chair2.png", alt: "Cafe Style Chair Main", isMain: true }
        ],
        sku: "CSC002",
        variants: {
            sizes: [
                { name: "Standard", available: true, stock: 20 }
            ],
            colors: [
                { name: "Navy Blue", hexCode: "#000080", available: true },
                { name: "Gray", hexCode: "#808080", available: true }
            ]
        },
        stock: 30,
        averageRating: 4.2,
        totalReviews: 18,
        tags: ["cafe", "stylish", "urban", "seating"],
        isNew: false
    },
    {
        name: "Premium Sofa Set",
        brand: "Comfort Zone",
        category: "Living Room",
        price: 4400000,
        originalPrice: 5500000,
        description: "Luxury 3-seater sofa for living room. Crafted with high-quality fabric and premium cushioning for ultimate relaxation.",
        shortDescription: "Luxury 3-seater sofa for living room",
        image: "/src/images/sofa.png",
        images: [
            { url: "/src/images/sofa.png", alt: "Premium Sofa Set", isMain: true }
        ],
        sku: "PSS003",
        variants: {
            sizes: [
                { name: "3-Seater", available: true, stock: 5 }
            ],
            colors: [
                { name: "Beige", hexCode: "#F5F5DC", available: true },
                { name: "Dark Gray", hexCode: "#2F4F4F", available: true }
            ]
        },
        stock: 8,
        averageRating: 4.8,
        totalReviews: 25,
        tags: ["sofa", "luxury", "3-seater", "living-room"],
        isNew: true
    },
    {
        name: "Wooden Bar Table",
        brand: "Classic Wood",
        category: "Dining",
        price: 1980000,
        originalPrice: 2200000,
        description: "Elegant wooden bar table for modern homes. Made from solid oak wood with beautiful natural grain patterns.",
        shortDescription: "Elegant wooden bar table for modern homes",
        image: "/src/images/bar_table.jpg",
        images: [
            { url: "/src/images/bar_table.jpg", alt: "Wooden Bar Table", isMain: true }
        ],
        sku: "WBT004",
        variants: {
            sizes: [
                { name: "Standard", available: true, stock: 12 }
            ],
            colors: [
                { name: "Natural Wood", hexCode: "#DEB887", available: true },
                { name: "Dark Walnut", hexCode: "#654321", available: true }
            ]
        },
        stock: 15,
        averageRating: 4.3,
        totalReviews: 9,
        tags: ["wooden", "bar-table", "dining", "oak"],
        isNew: false
    },
    {
        name: "Executive Office Chair",
        brand: "WorkSpace Pro",
        category: "Office",
        price: 1530000,
        originalPrice: 1800000,
        description: "Ergonomic office chair with lumbar support. Designed for long working hours with adjustable height and premium leather finish.",
        shortDescription: "Ergonomic office chair with lumbar support",
        image: "/src/images/cafe_chair1.png",
        images: [
            { url: "/src/images/cafe_chair1.png", alt: "Executive Office Chair", isMain: true }
        ],
        sku: "EOC005",
        variants: {
            sizes: [
                { name: "Standard", available: true, stock: 18 }
            ],
            colors: [
                { name: "Black Leather", hexCode: "#000000", available: true },
                { name: "Brown Leather", hexCode: "#8B4513", available: true }
            ]
        },
        stock: 22,
        averageRating: 4.6,
        totalReviews: 33,
        tags: ["office", "ergonomic", "leather", "executive"],
        isNew: false
    },
    {
        name: "6-Seater Dining Table",
        brand: "Family Furniture",
        category: "Dining",
        price: 3780000,
        originalPrice: 4200000,
        description: "Spacious dining table for large families. Made with solid wood and can comfortably seat 6 people for family meals.",
        shortDescription: "Spacious dining table for large families",
        image: "/src/images/dining.png",
        images: [
            { url: "/src/images/dining.png", alt: "6-Seater Dining Table", isMain: true }
        ],
        sku: "SDT006",
        variants: {
            sizes: [
                { name: "6-Seater", available: true, stock: 7 }
            ],
            colors: [
                { name: "Natural Wood", hexCode: "#DEB887", available: true },
                { name: "Cherry Wood", hexCode: "#722F37", available: true }
            ]
        },
        stock: 10,
        averageRating: 4.7,
        totalReviews: 15,
        tags: ["dining-table", "6-seater", "family", "wood"],
        isNew: true
    },
    {
        name: "King Size Bedroom Set",
        brand: "Sleep Comfort",
        category: "Bedroom",
        price: 6750000,
        originalPrice: 7500000,
        description: "Complete bedroom furniture with wardrobe. Includes king size bed, matching nightstands, dresser, and spacious wardrobe.",
        shortDescription: "Complete bedroom furniture with wardrobe",
        image: "/src/images/bedroom.png",
        images: [
            { url: "/src/images/bedroom.png", alt: "King Size Bedroom Set", isMain: true }
        ],
        sku: "KSB007",
        variants: {
            sizes: [
                { name: "King Size", available: true, stock: 3 }
            ],
            colors: [
                { name: "White", hexCode: "#FFFFFF", available: true },
                { name: "Espresso", hexCode: "#3C2415", available: true }
            ]
        },
        stock: 5,
        averageRating: 4.9,
        totalReviews: 8,
        tags: ["bedroom", "king-size", "complete-set", "wardrobe"],
        isNew: true
    },
    {
        name: "L-Shape Living Sofa",
        brand: "Modern Living",
        category: "Living Room",
        price: 7650000,
        originalPrice: 8500000,
        description: "Spacious L-shaped sofa for large living rooms. Perfect for family gatherings with premium fabric and comfortable cushioning.",
        shortDescription: "Spacious L-shaped sofa for large living rooms",
        image: "/src/images/living.png",
        images: [
            { url: "/src/images/living.png", alt: "L-Shape Living Sofa", isMain: true }
        ],
        sku: "LSS008",
        variants: {
            sizes: [
                { name: "L-Shape Large", available: true, stock: 4 }
            ],
            colors: [
                { name: "Light Gray", hexCode: "#D3D3D3", available: true },
                { name: "Navy Blue", hexCode: "#000080", available: true }
            ]
        },
        stock: 6,
        averageRating: 4.8,
        totalReviews: 12,
        tags: ["l-shape", "sofa", "living-room", "spacious"],
        isNew: false
    },
    {
        name: "Study Desk with Drawers",
        brand: "Student Plus",
        category: "Office",
        price: 1020000,
        originalPrice: 1200000,
        description: "Perfect study desk with storage drawers. Ideal for students and professionals with ample storage space and cable management.",
        shortDescription: "Perfect study desk with storage drawers",
        image: "/src/images/cafe_chair2.png",
        images: [
            { url: "/src/images/cafe_chair2.png", alt: "Study Desk with Drawers", isMain: true }
        ],
        sku: "SDD009",
        variants: {
            sizes: [
                { name: "Standard", available: true, stock: 20 }
            ],
            colors: [
                { name: "White", hexCode: "#FFFFFF", available: true },
                { name: "Oak Wood", hexCode: "#DEB887", available: true }
            ]
        },
        stock: 25,
        averageRating: 4.4,
        totalReviews: 22,
        tags: ["study-desk", "drawers", "storage", "office"],
        isNew: false
    },
    {
        name: "Recliner Chair",
        brand: "Relax Master",
        category: "Living Room",
        price: 3150000,
        originalPrice: 3500000,
        description: "Ultra comfortable recliner with massage feature. Perfect for relaxation with built-in massage function and premium leather upholstery.",
        shortDescription: "Ultra comfortable recliner with massage feature",
        image: "/src/images/sofa.png",
        images: [
            { url: "/src/images/sofa.png", alt: "Recliner Chair", isMain: true }
        ],
        sku: "RC010",
        variants: {
            sizes: [
                { name: "Standard", available: true, stock: 8 }
            ],
            colors: [
                { name: "Black Leather", hexCode: "#000000", available: true },
                { name: "Brown Leather", hexCode: "#8B4513", available: true }
            ]
        },
        stock: 12,
        averageRating: 4.9,
        totalReviews: 17,
        tags: ["recliner", "massage", "leather", "comfort"],
        isNew: true
    },
    {
        name: "Bar Stool Set",
        brand: "Height Plus",
        category: "Dining",
        price: 760000,
        originalPrice: 950000,
        description: "Set of 2 adjustable bar stools. Perfect for kitchen islands and bar counters with adjustable height mechanism.",
        shortDescription: "Set of 2 adjustable bar stools",
        image: "/src/images/cafe_chair1.png",
        images: [
            { url: "/src/images/cafe_chair1.png", alt: "Bar Stool Set", isMain: true }
        ],
        sku: "BSS011",
        variants: {
            sizes: [
                { name: "Adjustable", available: true, stock: 16 }
            ],
            colors: [
                { name: "Black", hexCode: "#000000", available: true },
                { name: "Chrome", hexCode: "#C0C0C0", available: true }
            ]
        },
        stock: 20,
        averageRating: 4.1,
        totalReviews: 11,
        tags: ["bar-stool", "adjustable", "set-of-2", "kitchen"],
        isNew: false
    },
    {
        name: "Coffee Table",
        brand: "Center Stage",
        category: "Living Room",
        price: 1260000,
        originalPrice: 1400000,
        description: "Elegant glass-top coffee table. Perfect centerpiece for modern living rooms with tempered glass top and metal frame.",
        shortDescription: "Elegant glass-top coffee table",
        image: "/src/images/bar_table.jpg",
        images: [
            { url: "/src/images/bar_table.jpg", alt: "Coffee Table", isMain: true }
        ],
        sku: "CT012",
        variants: {
            sizes: [
                { name: "Standard", available: true, stock: 14 }
            ],
            colors: [
                { name: "Clear Glass", hexCode: "#F8F8FF", available: true },
                { name: "Smoked Glass", hexCode: "#708090", available: true }
            ]
        },
        stock: 18,
        averageRating: 4.3,
        totalReviews: 14,
        tags: ["coffee-table", "glass-top", "modern", "centerpiece"],
        isNew: false
    }
];

const addProducts = async () => {
    try {
        // Connect to database
        await connectDB();
        console.log('Connected to database...');
        
        // // Clear existing products (DELETE ALL OLD DATA)
        // console.log('🗑️ Clearing existing products...');
        // const deletedCount = await Product.deleteMany({});
        // console.log(`Deleted ${deletedCount.deletedCount} existing products`);
        
        // Insert new products
        console.log('📦 Adding new products...');
        const insertedProducts = await Product.insertMany(sampleProducts);
        
        console.log(`✅ Successfully added ${insertedProducts.length} products!`);
        
        // Display added products with details
        console.log('\n📋 Added Products Summary:');
        console.log('=' .repeat(80));
        insertedProducts.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name}`);
            console.log(`   SKU: ${product.sku}`);
            console.log(`   Brand: ${product.brand} | Category: ${product.category}`);
            console.log(`   Price: Rp ${product.price.toLocaleString()} (was Rp ${product.originalPrice?.toLocaleString() || 'N/A'})`);
            console.log(`   Stock: ${product.stock} | Rating: ${product.averageRating}/5`);
            console.log(`   Colors: ${product.variants.colors.map(c => c.name).join(', ')}`);
            console.log('   ' + '-'.repeat(50));
        });
        
        // Summary statistics
        console.log('\n📊 Database Summary:');
        console.log('=' .repeat(40));
        console.log(`Total Products: ${insertedProducts.length}`);
        console.log(`Categories: ${[...new Set(insertedProducts.map(p => p.category))].join(', ')}`);
        console.log(`Brands: ${[...new Set(insertedProducts.map(p => p.brand))].join(', ')}`);
        console.log(`Total Stock: ${insertedProducts.reduce((sum, p) => sum + p.stock, 0)} items`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding products:', error);
        process.exit(1);
    }
};

// Run the function
addProducts();