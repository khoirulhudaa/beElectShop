const express = require('express')
const { getAllProducts, removeProductById } = require('../controllers/productControllers')
const router = express.Router()

router.get('/', getAllProducts)
router.delete('/:id', removeProductById)

module.exports = router