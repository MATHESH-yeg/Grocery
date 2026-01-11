const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const cartController = require('../controllers/cartController');

// @route    GET api/cart
// @desc     Get user's cart
// @access   Private
router.get('/', auth, cartController.getCart);

// @route    POST api/cart
// @desc     Add item to cart
// @access   Private
router.post('/', auth, cartController.addToCart);

// @route    PUT api/cart/:productId
// @desc     Update cart item quantity
// @access   Private
router.put('/:productId', auth, cartController.updateCartItem);

// @route    DELETE api/cart/:productId
// @desc     Remove item from cart
// @access   Private
router.delete('/:productId', auth, cartController.removeFromCart);

module.exports = router;







