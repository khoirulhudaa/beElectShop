const express = require('express')
const { removeShopById, getAllShop } = require('../controllers/shopController')
const router = express.Router()

router.get('/', getAllShop)
router.delete('/:id', removeShopById)

module.exports = router