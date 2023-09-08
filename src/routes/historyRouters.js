const express = require('express')
const historyController = require('../controllers/historyControllers')
const router = express.Router()

router.get('/', historyController.getAllHistory)
router.post('/', historyController.createHistory)
router.delete('/:history_id', historyController.removeHistory)

module.exports = router