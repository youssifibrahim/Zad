const express = require('express');
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const { upload } = require('../config/cloudinary');
const router = express.Router();

// PUBLIC ROUTES
router.get('/', productController.getAllProducts); // Get all products
router.get('/:id', productController.getProduct); // Get product by ID

// AUTHENTICATION SHIELD (ADMIN)
router.use(authMiddleware.protect, authMiddleware.restrictTo('admin'));
router.post('/', upload.single('image'), productController.createProduct); // Create product
router.route('/:id')
    .patch(upload.single('image'), productController.updateProduct) // Update product
    .delete(productController.deleteProduct); // Delete product

module.exports = router;