const express = require('express')
const historyController = require('../controllers/historyControllers')
const router = express.Router()

router.get('/:id?', historyController.getAllHistory)
router.get('/seller/:id?', historyController.getAllHistoryBySeller)
router.delete('/consumer/:history_id/product/:idCart', historyController.removeHistoryConsumer)
router.delete('/seller/:history_id/product/:idCart', historyController.removeHistorySeller)
router.put('/updateStatus/:history_id', historyController.updateStatusHistory)

module.exports = router