const express = require('express')
const router = express.Router()
const paymentController = require('../controllers/paymentControllers')

router.post('/checkout', paymentController.disbursementPayment)
router.post('/callback', paymentController.handlePaymentCallback)
router.post('/cancel/:external_id', paymentController.cancelOrder)

module.exports = router