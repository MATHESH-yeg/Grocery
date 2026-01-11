const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const admin = require('../middlewares/adminMiddleware');
const productController = require('../controllers/productController');

// @route    GET api/products
// @desc     Get all products
// @access   Public
router.get('/', productController.getProducts);

// @route    GET api/products/:id
// @desc     Get product by ID
// @access   Public
router.get('/:id', productController.getProductById);

// @route    POST api/products
// @desc     Create a product
// @access   Private/Admin
router.post('/', auth, admin, productController.createProduct);

// @route    PUT api/products/:id
// @desc     Update a product
// @access   Private/Admin
router.put('/:id', auth, admin, productController.updateProduct);

// @route    DELETE api/products/:id
// @desc     Delete a product
// @access   Private/Admin
router.delete('/:id', auth, admin, productController.deleteProduct);

module.exports = router;







