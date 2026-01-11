const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');

// @route    GET api/users/me
// @desc     Get current user's profile
// @access   Private
router.get('/me', auth, userController.getMe);

// @route    PUT api/users/me
// @desc     Update user profile
// @access   Private
router.put('/me', auth, userController.updateMe);

// @route    PUT api/users/me/addresses
// @desc     Add or update a delivery address
// @access   Private
router.put('/me/addresses', auth, userController.addOrUpdateAddress);

// @route    DELETE api/users/me/addresses/:address_id
// @desc     Delete an address
// @access   Private
router.delete('/me/addresses/:address_id', auth, userController.deleteAddress);

module.exports = router;







