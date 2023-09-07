const express = require('express')
const productControllers = require('../controllers/productControllers')
const router = express.Router()

router.post('/', productControllers.upload.single('product_image'), productControllers.createProduct)
router.get('/', productControllers.getAllProducts)
router.delete('/:product_id', productControllers.removeProductById)
router.post('/:product_id', productControllers.upload.single('product_image') , productControllers.updateProduct)

module.exports = router