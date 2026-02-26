const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required']
    },
    image: {
        type: String,
        required: [true, 'Image is required'],
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price must be a positive number']
    },
    unitDetails: {
        unit: {
            type: String,
            required: [true, 'Unit is required (e.g., kg, g, l)'],
            enum: {
                values: ['kg', 'g', 'lb', 'l', 'ml', 'piece'],
                message: 'Invalid unit. Please choose from: kg, g, lb, l, ml, piece'
            }
        },
        value: {
            type: Number,
            default: 1,
            required: [true, 'Please specify the amount per unit (e.g., 2 for 2kg pack)']
        }
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'Product category is required'],
    },
    expiryDate: {
        type: Date
    },
    stock: {
        type: Number,
        required: [true, 'Stock quantity is required'],
        min: [0, 'Stock cannot be less than zero'],
        default: 0
    },
    sold: {
        type: Number,
        default: 0
    },
    isFresh: {
        type: Boolean,
    }
},
    { timestamps: true }
);

// Indexes
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ price: 1 });
productSchema.index({ category: 1 });
productSchema.index({ sold: -1, createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);