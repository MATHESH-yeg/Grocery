const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// @route    POST api/orders
// @desc     Place a new order
// @access   Private
exports.placeOrder = async (req, res) => {
  const { address, paymentStatus, paymentReference, deliveryInstructions } = req.body;

  try {
    // Only regular users can place orders
    if (req.user.collection === 'admins') {
      return res.status(403).json({ msg: 'Admins cannot place orders' });
    }

    const user = await User.findById(req.user.id).populate('cart.product');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.cart.length === 0) {
      return res.status(400).json({ msg: 'Cart is empty' });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of user.cart) {
      const product = await Product.findById(item.product._id);
      if (!product) {
        return res.status(404).json({ msg: `Product ${item.product._id} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ msg: `Not enough stock for ${product.name}` });
      }

      orderItems.push({
        product: item.product._id,
        quantity: item.quantity,
        price: product.price, // Store current price at time of order
      });
      totalAmount += product.price * item.quantity;

      // Decrease product stock
      product.stock -= item.quantity;
      await product.save();
    }

    const newOrder = new Order({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      address,
      paymentStatus: paymentStatus || 'pending',
      paymentReference,
      deliveryInstructions,
    });

    const order = await newOrder.save();

    // Clear user cart after successful order
    user.cart = [];
    await user.save();

    res.status(201).json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route    GET api/orders/me
// @desc     Get all orders for the current user
// @access   Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('user', 'name email').populate('items.product', 'name imageUrl');
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route    GET api/orders
// @desc     Get all orders (Admin only)
// @access   Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').populate('items.product', 'name imageUrl');
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route    PUT api/orders/:id/status
// @desc     Update order status (Admin only)
// @access   Private/Admin
exports.updateOrderStatus = async (req, res) => {
  const { orderStatus } = req.body;

  try {
    let order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    order.orderStatus = orderStatus;
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route    PUT api/orders/:id/paymentstatus
// @desc     Update order payment status (Admin only)
// @access   Private/Admin
exports.updatePaymentStatus = async (req, res) => {
  const { paymentStatus } = req.body;

  try {
    let order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    order.paymentStatus = paymentStatus;
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};




