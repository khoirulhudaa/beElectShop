const express = require('express')
const subscribeController = require('../controllers/subsribeControllers')
const router = express.Router()

router.post('/', subscribeController.subscribe)

module.exports = router