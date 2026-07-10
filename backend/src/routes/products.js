const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { validateProduct } = require('../middleware/validation');
const validateRequest = require('../middleware/validateRequest');
const { protect, authorize } = require('../middleware/auth');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', protect, authorize('admin'), validateProduct, validateRequest, productController.createProduct);
router.put('/:id', protect, authorize('admin'), validateProduct, validateRequest, productController.updateProduct);
router.delete('/:id', protect, authorize('admin'), productController.deleteProduct);

module.exports = router;
