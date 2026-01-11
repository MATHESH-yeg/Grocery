const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const admin = require('../middlewares/adminMiddleware');
const orderController = require('../controllers/orderController');

// @route    POST api/orders
// @desc     Place a new order
// @access   Private
router.post('/', auth, orderController.placeOrder);

// @route    GET api/orders/me
// @desc     Get all orders for the current user
// @access   Private
router.get('/me', auth, orderController.getMyOrders);

// @route    GET api/orders
// @desc     Get all orders (Admin only)
// @access   Private/Admin
router.get('/', auth, admin, orderController.getAllOrders);

// @route    PUT api/orders/:id/status
// @desc     Update order status (Admin only)
// @access   Private/Admin
router.put('/:id/status', auth, admin, orderController.updateOrderStatus);

// @route    PUT api/orders/:id/paymentstatus
// @desc     Update order payment status (Admin only)
// @access   Private/Admin
router.put('/:id/paymentstatus', auth, admin, orderController.updatePaymentStatus);

module.exports = router;







