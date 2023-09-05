const express = require('express')
const router = express.Router()
const shopController = require('../controllers/shopController')

router.post('/', shopController.createShop)
router.get('/', shopController.getAllShop)
router.put('/:shop_id', shopController.upload.single('image_shop'), shopController.updateShop)
router.delete('/:shop_id', shopController.removeShopById)

module.exports = router