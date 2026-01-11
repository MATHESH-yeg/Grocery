const User = require('../models/User');
const Product = require('../models/Product');

// @route    GET api/cart
// @desc     Get user's cart
// @access   Private
exports.getCart = async (req, res) => {
  try {
    // Only regular users can have carts
    if (req.user.collection === 'admins') {
      return res.status(403).json({ msg: 'Admins cannot have shopping carts' });
    }

    const user = await User.findById(req.user.id).populate('cart.product');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Filter out items where product is null (deleted products)
    const validCart = user.cart.filter(item => item.product !== null);

    if (validCart.length !== user.cart.length) {
      user.cart = validCart;
      await user.save();
    }

    res.json(user.cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route    POST api/cart
// @desc     Add item to cart
// @access   Private
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    // Only regular users can have carts
    if (req.user.collection === 'admins') {
      return res.status(403).json({ msg: 'Admins cannot have shopping carts' });
    }

    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Check if product already in cart
    const cartItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      user.cart.unshift({ product: productId, quantity });
    }

    await user.save();
    // Populate product details for response
    user = await User.findById(req.user.id).populate('cart.product');

    // Filter out items where product is null (deleted products)
    const validCart = user.cart.filter(item => item.product !== null);

    if (validCart.length !== user.cart.length) {
      user.cart = validCart;
      await user.save();
    }

    res.json(user.cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route    PUT api/cart/:productId
// @desc     Update cart item quantity
// @access   Private
exports.updateCartItem = async (req, res) => {
  const { quantity } = req.body;

  try {
    // Only regular users can have carts
    if (req.user.collection === 'admins') {
      return res.status(403).json({ msg: 'Admins cannot have shopping carts' });
    }

    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const cartItem = user.cart.find(
      (item) => item.product.toString() === req.params.productId
    );

    if (!cartItem) {
      return res.status(404).json({ msg: 'Product not in cart' });
    }

    cartItem.quantity = quantity;
    await user.save();
    user = await User.findById(req.user.id).populate('cart.product');
    res.json(user.cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route    DELETE api/cart/:productId
// @desc     Remove item from cart
// @access   Private
exports.removeFromCart = async (req, res) => {
  try {
    // Only regular users can have carts
    if (req.user.collection === 'admins') {
      return res.status(403).json({ msg: 'Admins cannot have shopping carts' });
    }

    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    await user.save();
    user = await User.findById(req.user.id).populate('cart.product');
    res.json(user.cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};




