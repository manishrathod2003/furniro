const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    // Existing fields (keeping exactly same)
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },

    // New optional fields for single product page (all optional to maintain compatibility)
    sku: {
        type: String,
        default: function() { return `SKU${Date.now()}`; }
    },
    originalPrice: {
        type: Number
    },
    images: [{
        url: String,
        alt: String,
        isMain: { type: Boolean, default: false }
    }],
    shortDescription: {
        type: String
    },
    variants: {
        sizes: [{
            name: String,
            available: { type: Boolean, default: true },
            stock: { type: Number, default: 0 }
        }],
        colors: [{
            name: String,
            hexCode: String,
            available: { type: Boolean, default: true }
        }]
    },
    stock: {
        type: Number,
        default: 10
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'out_of_stock'],
        default: 'active'
    },
    averageRating: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    tags: [String],
    isNew: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
    if (this.originalPrice && this.originalPrice > this.price) {
        return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
    }
    return 0;
});

// Ensure virtuals are included in JSON
productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);