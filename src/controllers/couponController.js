const Coupon = require('../models/Coupon');
const AppError = require('../utils/AppError');
const messages = require('../utils/errorMessages');

// Create coupon
exports.createCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.create(req.body);
        res.status(201).json({
            status: 'success',
            data: { coupon }
        });
    } catch (err) {
        next(err);
    }
};

// Retrieve all 
exports.getAllCoupons = async (req, res, next) => {
    try {
        const coupons = await Coupon.find();
        res.status(200).json({
            status: 'success',
            results: coupons.length,
            data: { coupons }
        });
    } catch (err) {
        next(err);
    }
};

// Retrieve single coupon 
exports.getCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) {
            return next(new AppError(messages.INVALID_COUPON, 404));
        }
        res.status(200).json({
            status: 'success',
            data: { coupon }
        });
    } catch (err) {
        next(err);
    }
};

// Update coupon 
exports.updateCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!coupon) {
            return next(new AppError(messages.INVALID_COUPON, 404));
        }
        res.status(200).json({
            status: 'success',
            data: { coupon }
        });
    } catch (err) {
        next(err);
    }
};

// Delete coupon 
exports.deleteCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) return next(new AppError(messages.INVALID_COUPON, 404));
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        next(err);
    }
};