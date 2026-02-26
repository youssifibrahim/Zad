const express = require('express');
const couponController = require('../controllers/couponController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// AUTHENTICATION SHIELD (ADMIN)
router.use(authMiddleware.protect, authMiddleware.restrictTo('admin'));
router.route('/')
    .post(couponController.createCoupon) // Create coupon
    .get(couponController.getAllCoupons); // Retrieve coupons
router.route('/:id')
    .get(couponController.getCoupon) // Retrieve coupon
    .patch(couponController.updateCoupon) // Update coupon
    .delete(couponController.deleteCoupon); // Delete coupon

module.exports = router;