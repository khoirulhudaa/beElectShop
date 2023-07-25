const express = require('express')
const { getAllProducts, removeProducts } = require('../handlers/product/productHandler')
const router = express.Router()

router.get('/', getAllProducts)
router.delete('/:id', removeProducts)

module.exports = router