const express = require('express')
const accountController = require('../controllers/accountControllers')
const router = express.Router()

// Sign consumer and seller
router.post('signup/seller', accountController.signUpSeller)
router.post('signin/seller', accountController.signInSeller)

router.post('/signup/consumer', authControllers.signUpConsumer)
router.post('/signin/consumer', authControllers.signInConsumer)

// Get list users
router.get('/list/consumer', authControllers.getAllConsumer)
router.get('/list/seller', authControllers.getAllSeller)

// Delete Account
router.delete('/consumer/:consumer_id', authControllers.removeConsumer)
router.delete('/seller/:seller_id', authControllers.removeSeller)

module.exports = router