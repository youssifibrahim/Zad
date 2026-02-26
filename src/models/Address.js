const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Address must belong to a user']
    },
    alias: {
        type: String,
        required: [true, 'Please give a name to this address (e.g., Home, Work)'],
        trim: true
    },
    details: { type: String, required: true },
    city: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
},
    { timestamps: true }
);

module.exports = mongoose.model('Address', addressSchema);