const express = require('express')
const historyController = require('../controllers/historyControllers')
const router = express.Router()

router.get('/:id?', historyController.getAllHistory)
router.delete('/consumer/:id', historyController.removeHistoryConsumer)
router.delete('/seller/:id', historyController.removeHistorySeller)

module.exports = router