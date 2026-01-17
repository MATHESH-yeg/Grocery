const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

// @route    GET api/products
// @desc     Get all products with optional filter, search, and sort
// @access   Public
exports.getProducts = async (req, res) => {
  try {
    const query = {};
    const { category, search, sortBy } = req.query;

    if (category) {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' }; // Case-insensitive search
    }

    let products = Product.find(query);

    if (sortBy) {
      if (sortBy === 'price_asc') {
        products = products.sort({ price: 1 });
      } else if (sortBy === 'price_desc') {
        products = products.sort({ price: -1 });
      } else if (sortBy === 'createdAt_desc') {
        products = products.sort({ createdAt: -1 });
      }
    }

    const allProducts = await products;
    res.json(allProducts);
  } catch (err) {
    console.error(err.message);
    const logPath = path.join(__dirname, '../error.log');
    const logMessage = `${new Date().toISOString()} - Error in getProducts: ${err.stack}\n`;
    fs.appendFileSync(logPath, logMessage);
    res.status(500).send('Server Error');
  }
};

// @route    GET api/products/:id
// @desc     Get product by ID
// @access   Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route    POST api/products
// @desc     Create a product
// @access   Private/Admin
exports.createProduct = async (req, res) => {
  const { name, description, price, category, imageUrl, stock } = req.body;

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      imageUrl,
      stock,
    });

    const product = await newProduct.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route    PUT api/products/:id
// @desc     Update a product
// @access   Private/Admin
exports.updateProduct = async (req, res) => {
  const { name, description, price, category, imageUrl, stock } = req.body;

  // Build product object
  const productFields = {};
  if (name) productFields.name = name;
  if (description) productFields.description = description;
  if (price) productFields.price = price;
  if (category) productFields.category = category;
  if (imageUrl) productFields.imageUrl = imageUrl;
  if (stock) productFields.stock = stock;

  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    product = await Product.findOneAndUpdate(
      { _id: req.params.id },
      { $set: productFields },
      { new: true }
    );

    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route    DELETE api/products/:id
// @desc     Delete a product
// @access   Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    await Product.deleteOne({ _id: req.params.id });

    res.json({ msg: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};







