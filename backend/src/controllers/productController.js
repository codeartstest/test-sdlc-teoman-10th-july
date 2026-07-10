const productService = require('../services/productService');

/**
 * GET /api/products
 * Retrieve all products.
 */
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/products/:id
 * Retrieve a single product by ID.
 */
exports.getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json(product);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/products
 * Create a new product.
 */
exports.createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/products/:id
 * Update an existing product.
 */
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/products/:id
 * Delete a product.
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};