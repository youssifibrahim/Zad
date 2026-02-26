const express = require('express');
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// AUTHENTICATION SHIELD 
router.use(authMiddleware.protect);

router.route('/')
    .get(cartController.getCart) // Retrieve cart
    .delete(cartController.clearCart); // Delete cart
router.post('/add', cartController.addToCart); // Add item
router.patch('/update-quantity/:productId', cartController.updateCartQuantity); // Update Quantity
router.delete('/product/:productId', cartController.removeFromCart); // Delete item

module.exports = router;