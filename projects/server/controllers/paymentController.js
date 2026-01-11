const Stripe = require('stripe');
const Razorpay = require('razorpay');
const crypto = require('crypto');

let stripe;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = Stripe(process.env.STRIPE_SECRET_KEY);
} else {
  console.warn('STRIPE_SECRET_KEY is missing. Stripe functionality will cause errors.');
}

let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
} else {
  console.warn('RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing. Razorpay functionality will cause errors.');
}

// @route   POST /api/payment/create-intent
// @desc    Create Stripe test PaymentIntent (demo payment)
// @access  Private
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ msg: 'Invalid amount' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'inr', // change to 'usd' if you prefer
      automatic_payment_methods: { enabled: true },
    });

    return res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error('Stripe error:', err.message);
    return res.status(500).json({ msg: 'Payment initialization failed' });
  }
};

// @route   POST /api/payment/create-order
// @desc    Create Razorpay Order
// @access  Private
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body; // amount in smallest currency unit (paise)

    if (!amount || amount <= 0) {
      return res.status(400).json({ msg: 'Invalid amount' });
    }

    const options = {
      amount: amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).json({ msg: 'Some error occured' });
    }

    res.json(order);
  } catch (error) {
    console.error('Razorpay create order error:', error);
    res.status(500).json({
      msg: 'Error creating Razorpay order',
      error: error.message,
      details: error.error || error.description || 'No additional details'
    });
  }
};

// @route   POST /api/payment/verify
// @desc    Verify Razorpay Payment Signature
// @access  Private
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpay_signature) {
      return res.status(400).json({ msg: 'Transaction not legit!' });
    }

    res.json({
      msg: 'Payment verified successfully',
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error('Razorpay verify error:', error);
    res.status(500).json({ msg: 'Error verifying payment' });
  }
};
