const express = require('express')
const { signUp, signIn, getAllUsers } = require('../controllers/authControllers')
const router = express.Router()

router.post('/signup', signUp)
router.post('/signin', signIn)
router.get('/', getAllUsers)

module.exports = router