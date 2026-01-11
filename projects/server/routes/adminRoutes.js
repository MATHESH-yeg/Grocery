const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const admin = require('../middlewares/adminMiddleware');
const adminController = require('../controllers/adminController');

// @route    GET api/admin/stats
// @desc     Get admin dashboard statistics
// @access   Private/Admin
router.get('/stats', auth, admin, adminController.getStats);

// @route    GET api/admin/users
// @desc     Get all users
// @access   Private/Admin
router.get('/users', auth, admin, adminController.getAllUsers);

// @route    DELETE api/admin/users/:id
// @desc     Delete a user
// @access   Private/Admin
router.delete('/users/:id', auth, admin, adminController.deleteUser);

// @route    GET api/admin/admins
// @desc     Get all admins
// @access   Private/Admin
router.get('/admins', auth, admin, adminController.getAllAdmins);

// @route    DELETE api/admin/admins/:id
// @desc     Delete an admin
// @access   Private/Admin
router.delete('/admins/:id', auth, admin, adminController.deleteAdmin);

module.exports = router;



