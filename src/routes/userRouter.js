const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// PUBLIC ROUTES
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// AUTHENTICATION SHIELD (ADMIN)
router.use(authMiddleware.protect, authMiddleware.restrictTo('admin'));
router.get('/', userController.getAllUsers); // Get all users
router.route('/:id')
    .get(userController.getUser) // Get user
    .patch(userController.updateUser) // Update user 
    .delete(userController.deleteUser); // Delete user 

module.exports = router;