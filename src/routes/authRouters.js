const express = require('express')
const authControllers = require('../controllers/authControllers')
const router = express.Router()

// Auth
router.post('/seller', authControllers.signUpSeller)
router.post('/seller', authControllers.signInSeller)
// router.post('/signup/consumer', authControllers.signUpConsumer)
// router.post('/signin/consumer', authControllers.signInConsumer)

// Get list users
// router.get('/list/consumer', authControllers.getAllConsumer)
// router.get('/list/seller', authControllers.getAllSeller)

// Delete Account
// router.delete('/consumer/:consumer_id', authControllers.removeConsumer)
// router.delete('/seller/:seller_id', authControllers.removeSeller)

module.exports = router