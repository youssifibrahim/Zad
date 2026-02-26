const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Order must belong to a user']
    },
    orderItems: [
        {
            product: { type: mongoose.Schema.ObjectId, ref: 'Product', required: true },
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            unitDetails: {
                unit: String,
                value: Number
            }
        }
    ],
    shippingAddress: {
        addressId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Address',
            required: [true, 'Please select a shipping address']
        },
        addressSnapshot: { type: String, required: true }
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['Cash on Delivery', 'Credit Card'],
        default: 'Cash on Delivery'
    },
    totalPrice: { type: Number, required: true, default: 0.0 },
    appliedCoupon: {
        couponId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Coupon'
        },
        code: String,
        discount: Number
    },
    orderStatus: {
        type: String,
        required: true,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: Date,
    deliveredAt: Date
},
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Indexes
orderSchema.index({ user: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ isPaid: 1, createdAt: -1 });
orderSchema.index({ totalPrice: -1 });

module.exports = mongoose.model('Order', orderSchema);