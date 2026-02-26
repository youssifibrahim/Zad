const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Coupon code is required'],
        unique: true,
        uppercase: true,
    },
    expiry: {
        type: Date,
        required: [true, 'Expiry date is required']
    },
    discount: {
        type: Number,
        required: [true, 'Discount percentage is required'],
        min: [1, 'Discount must be at least 1%'],
        max: [100, 'Discount cannot exceed 100%']
    },
    usedBy: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]
},
    { timestamps: true }
);

module.exports = mongoose.model('Coupon', couponSchema);