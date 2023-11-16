const express = require('express')
const router = express.Router()
const courierController = require('../controllers/courierController')

router.get('/province', courierController.getProvince)
router.get('/city', courierController.getCity)

module.exports = router