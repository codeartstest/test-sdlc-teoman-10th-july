const Product = require('../models/Product');
const AppError = require('../utils/AppError');

const ALLOWED_FIELDS = ['name', 'description', 'price', 'category', 'image', 'stock'];

/**
 * Filters an object to only include whitelisted fields.
 * Prevents mass assignment attacks (e.g., setting createdAt or _id).
 * @param {Object} data - The raw input data.
 * @returns {Object} Filtered object containing only allowed fields.
 */
const filterAllowedFields = (data) => {
  const filtered = {};
  for (const field of ALLOWED_FIELDS) {
    if (data[field] !== undefined) {
      filtered[field] = data[field];
    }
  }
  return filtered;
};

/**
 * Retrieve all products from the database.
 * @returns {Promise<Array>} Array of product documents.
 */
const getAllProducts = async () => {
  return Product.find();
};

const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

const getAllProductsPaginated = async (page = DEFAULT_PAGE, limit = DEFAULT_LIMIT) => {
  const pageNum = Math.max(1, parseInt(page) || DEFAULT_PAGE);
  const limitNum = Math.min(MAX_LIMIT, Math.max(1, parseInt(limit) || DEFAULT_LIMIT));
  const skip = (pageNum - 1) * limitNum;

  const [products, totalItems] = await Promise.all([
    Product.find().skip(skip).limit(limitNum),
    Product.countDocuments(),
  ]);

  return {
    data: products,
    pagination: {
      page: pageNum,
      limit: limitNum,
      totalItems,
      totalPages: Math.ceil(totalItems / limitNum),
      hasNext: pageNum < Math.ceil(totalItems / limitNum),
      hasPrev: pageNum > 1,
    },
  };
};

/**
 * Retrieve a single product by its ID.
 * @param {string} id - The MongoDB ObjectId of the product.
 * @returns {Promise<Object>} The product document.
 * @throws {AppError} 404 if product is not found.
 */
const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  return product;
};

/**
 * Create a new product.
 * Only whitelisted fields are accepted to prevent mass assignment.
 * @param {Object} data - The product data from the request body.
 * @returns {Promise<Object>} The newly created product document.
 */
const createProduct = async (data) => {
  const filteredData = filterAllowedFields(data);
  const product = new Product(filteredData);
  return product.save();
};

/**
 * Update an existing product by ID.
 * Only whitelisted fields are accepted to prevent mass assignment.
 * @param {string} id - The MongoDB ObjectId of the product.
 * @param {Object} data - The update data from the request body.
 * @returns {Promise<Object>} The updated product document.
 * @throws {AppError} 404 if product is not found.
 */
const updateProduct = async (id, data) => {
  const filteredData = filterAllowedFields(data);
  const product = await Product.findByIdAndUpdate(
    id,
    filteredData,
    { new: true, runValidators: true }
  );
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  return product;
};

/**
 * Delete a product by ID.
 * @param {string} id - The MongoDB ObjectId of the product.
 * @returns {Promise<Object>} The deleted product document.
 * @throws {AppError} 404 if product is not found.
 */
const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  return product;
};

module.exports = {
  getAllProducts,
  getAllProductsPaginated,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  filterAllowedFields,
};