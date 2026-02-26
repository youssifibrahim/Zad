const express = require('express');
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// PUBLIC ROUTES
router.get('/', categoryController.getAllCategories); // Retrieve categories
router.get('/:id', categoryController.getCategory); // Retrieve category

// AUTHENTICATION SHIELD (ADMIN)
router.use(authMiddleware.protect, authMiddleware.restrictTo('admin'));
router.post('/', categoryController.createCategory); // Create category
router.route('/:id')
    .patch(categoryController.updateCategory) // Update category
    .delete(categoryController.deleteCategory); // Delete category

module.exports = router;