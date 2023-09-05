const express = require('express')
const { upload, createProduct, getAllProducts, removeProductById } = require('../controllers/productControllers')
const router = express.Router()

router.post('/', upload.single('product_image'), createProduct)
router.get('/', getAllProducts)
router.delete('/:id', removeProductById)

module.exports = router