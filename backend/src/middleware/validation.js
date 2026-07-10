const { body } = require('express-validator');

const validateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name must not exceed 100 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),

  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),

  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
];

module.exports = { validateProduct };