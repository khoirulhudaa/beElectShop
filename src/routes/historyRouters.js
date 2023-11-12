const express = require('express')
const historyController = require('../controllers/historyControllers')
const router = express.Router()

router.get('/:id', historyController.getAllHistory)
router.delete('/:history_id', historyController.removeHistory)

module.exports = router