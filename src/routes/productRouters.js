const express = require('express');
const productControllers = require('../controllers/productControllers');
const router = express.Router();

// Create a new product
router.post('/', productControllers.upload.single('product_image'), productControllers.createProduct);

// Get all products for a shop (if shop_id is provided)
router.get('/:shop_id?', productControllers.getAllProducts);

// Get one products for a product_id
router.get('/Oneproduct/:product_id?', productControllers.getProductById);

// Remove a product by its ID
router.delete('/:product_id', productControllers.removeProductById);

// Update a product by its ID
router.post('/:product_id', productControllers.upload.single('product_image'), productControllers.updateProduct);

module.exports = router;
