const express = require('express')
const { removeShopById, getAllShop, createShop } = require('../controllers/shopController')
const router = express.Router()

router.post('/', createShop)
router.get('/', getAllShop)
router.delete('/:id', removeShopById)

module.exports = router