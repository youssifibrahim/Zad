const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// PUBLIC ROUTES
router.get('/payment-success', (req, res) => {
    res.status(200).send('<h1>Payment completed successfully! Thank you for your trust.</h1>');
});
router.get('/payment-cancel', (req, res) => {
    res.status(200).send('<h1>The payment was cancelled. You can try again from your shopping cart.</h1>');
});

// AUTHENTICATION SHIELD 
router.use(authMiddleware.protect);

// USER ROUTES
router.post('/checkout-session', orderController.getCheckoutSession);
router.post('/checkout', orderController.createOrderFromCart);
router.get('/my-orders', orderController.getMyOrders);
router.patch('/:id/cancel', orderController.cancelOrder);

// ADMIN ROUTES
router.use(authMiddleware.restrictTo('admin'));
router.get('/combined-stats', orderController.getCombinedStats);
router.get('/monthly-plan/:year', orderController.getMonthlyPlan);
router.get('/:id', orderController.getOrder);
router.patch('/:id/status', orderController.updateOrderStatus);
router.get('/', orderController.getAllOrders);

module.exports = router;