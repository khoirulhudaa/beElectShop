const express = require('express')
const accountController = require('../controllers/accountControllers')
const router = express.Router()

// Sign consumer and seller
router.post('/signup/seller', accountController.signUpSeller)
router.post('/signin/seller', accountController.signInSeller)

router.post('/signup/consumer', accountController.signUpConsumer)
router.post('/signin/consumer', accountController.signInConsumer)

// Get list users
router.get('/list/consumer', accountController.getAllConsumer)
router.get('/list/seller', accountController.getAllSeller)

// Delete Account
router.delete('/consumer/:consumer_id', accountController.removeConsumer)
router.delete('/seller/:seller_id', accountController.removeSeller)

module.exports = router