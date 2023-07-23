const express = require('express')
const router = express.Router()
const { signUp, signIn } = require('../controllers/authControllers')

router.post('/signup', signUp)
router.get('/signin', signIn)

module.exports = router