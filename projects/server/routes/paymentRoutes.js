const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const paymentController = require('../controllers/paymentController');

// @route   POST api/payment/create-intent
// @desc    Create Stripe test PaymentIntent (demo payment)
// @access  Private
router.post('/create-intent', auth, paymentController.createPaymentIntent);
router.post('/create-order', auth, paymentController.createRazorpayOrder);
router.post('/verify', auth, paymentController.verifyRazorpayPayment);

module.exports = router;









