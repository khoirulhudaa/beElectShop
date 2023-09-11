const express = require('express')
const accountController = require('../controllers/accountControllers')
const router = express.Router()

// Auth
router.post('signup/seller', accountController.signUpSeller)
router.post('signing/seller', accountController.signInSeller)

module.exports = router