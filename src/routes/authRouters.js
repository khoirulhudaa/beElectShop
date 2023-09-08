const express = require('express')
const authControllers = require('../controllers/authControllers')
const router = express.Router()

// Auth
router.post('/signup/consumer', authControllers.signUpConsumer)
router.post('/signin/consumer', authControllers.signUpConsumer)
router.post('/signup/seller', authControllers.signUpSeller)
router.post('/signin/seller', authControllers.signInSeller)

// Get list users
router.get('/consumer', authControllers.getAllConsumer)
router.get('/seller', authControllers.getAllSeller)

// Delete Account
router.delete('/consumer/:consumer_id', authControllers.removeConsumer)
router.delete('/seller/:seller_id', authControllers.removeSeller)

module.exports = router