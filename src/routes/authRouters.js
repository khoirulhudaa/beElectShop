const express = require('express')
const { getAllUsers, signUp, signIn } = require('../handlers/auth/authHandler')
const router = express.Router()

router.post('/signup', signUp)
router.post('/signin', signIn)
router.get('/', getAllUsers)

module.exports = router