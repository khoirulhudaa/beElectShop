const express = require('express')
const router = express.Router()
const paymentController = require('../controllers/paymentControllers')

router.get('/:shop_id', paymentController.getAllPaymentByShop)
router.put('/:shop_id', paymentController.updatePaymentMethod)
router.post('/withdraw', paymentController.disbursementPayment)
router.post('/callback', paymentController.handlePaymentCallback)
router.post('/create', paymentController.createPayment)

module.exports = router