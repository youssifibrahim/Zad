const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            product: { type: mongoose.Schema.ObjectId, ref: 'Product', required: true },
            name: String,
            quantity: { type: Number, default: 1 },
            price: Number,
            unitDetails: {
                unit: String,
                value: Number
            }
        }
    ],
    totalPrice: { type: Number, default: 0 }
},
    { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);