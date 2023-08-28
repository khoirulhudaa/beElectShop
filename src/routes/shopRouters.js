const express = require('express')
const router = express.Router()
const shopController = require('../controllers/shopController')

router.post('/', shopController.upload.single('image'), shopController.createShop)
router.get('/', shopController.getAllShop)
router.put('/:shop_id', shopController.updateShop)
router.post('/:shop_id', shopController.removeShopById)

module.exports = router