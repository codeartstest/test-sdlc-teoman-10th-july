const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { validateProduct } = require('../middleware/validation');
const validateRequest = require('../middleware/validateRequest');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', validateProduct, validateRequest, productController.createProduct);
router.put('/:id', validateProduct, validateRequest, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
