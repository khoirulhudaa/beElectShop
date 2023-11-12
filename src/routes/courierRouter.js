const express = require('express')
const router = express.Router()
const courierController = require('../controllers/courierController')

router.get('/province')
router.get('/city')

module.exports = router