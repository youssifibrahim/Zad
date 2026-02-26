const express = require('express');
const addressController = require('../controllers/addressController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// AUTHENTICATION SHIELD 
router.use(authMiddleware.protect);

router.route('/')
    .post(addressController.addAddress) // Create address  
    .get(addressController.getMyAddresses); // Retrieve all my addresses
router.route('/:id')
    .get(addressController.getSingleAddress) // Retrieve address
    .patch(addressController.updateAddress)  // Update address
    .delete(addressController.deleteAddress); // Delete address

module.exports = router;