const express = require('express')
const router = express.Router()
const shopController = require('../controllers/shopController')

router.post('/', shopController.createShop)
router.get('/', shopController.getAllShop)
router.post('/:shop_id', shopController.removeShopById)

module.exports = router