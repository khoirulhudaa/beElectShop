const historyModelConsumer = require('../models/historyInConsumerModel')
const historyModelSeller = require('../models/historyInSellerModel')

const removeHistoryConsumer = async (req, res) => {
    try {
        const { id } = req.params

        const equalHistory = await historyModelConsumer.findOne({ history_id: id })
        if(equalHistory === 0) return res.json({ status: 404, message: 'History not found!' })

        const deleteHistory = await historyModelConsumer.deleteOne({ history_id })
        if(!deleteHistory) return res.json({ status: 404, message: 'Failed for delete history!' })

        return res.json({ status: 200, message: 'Successfully remove history!' })

    } catch (error) {
        return res.json({ status: 500, message:'Failed to remove history!', error: error.mesage })
    }
}

const removeHistorySeller = async (req, res) => {
    try {
        const { id } = req.params

        const equalHistory = await historyModelSeller.findOne({ history_id: id })
        if(equalHistory === 0) return res.json({ status: 404, message: 'History not found!' })

        const deleteHistory = await historyModelSeller.deleteOne({ history_id })
        if(!deleteHistory) return res.json({ status: 404, message: 'Failed for delete history!' })

        return res.json({ status: 200, message: 'Successfully remove history!' })

    } catch (error) {
        return res.json({ status: 500, message:'Failed to remove history!', error: error.mesage })
    }
}

const getAllHistory = async (req, res) => {
    try {  
        const { id } = req.params
        const filter = {
            $or: [
                { seller_id: id },
                { consumer_id: id }
            ]
        };

        const data = await historyModelConsumer.find(filter)
        
        if(data.length === 0) return res.json({ status: 404, message: 'Data history not found!' })
        
        return res.json({ status: 200, message: 'Successfully get data history!', data })

    } catch (error) {
        return res.json({ status: 500, message: 'Failed to get history!', error: error.message })
    }
}

module.exports = {
    removeHistoryConsumer,
    removeHistorySeller,
    getAllHistory
}