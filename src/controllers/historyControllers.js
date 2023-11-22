const historyModelConsumer = require('../models/historyInConsumerModel')
const historyModelSeller = require('../models/historyInSellerModel')

const removeHistoryConsumer = async (req, res) => {
    try {
        const { history_id, idCart } = req.params

        const history = await historyModelConsumer.findOne({ history_id })
        if(history === 0) return res.json({ status: 404, message: 'History not found!' })

        const indexProducts = history.products.findIndex(data => data.idCart === idCart)
        if (indexProducts === -1) {
            return res.json({ status: 404, message: 'Product not found in history!' });
        }

        if (history.products.length === 1) {
            await historyModelConsumer.deleteOne({ history_id });
            return res.json({ status: 200, message: 'Successfully removed history document!' });
        } else {
            history.products.splice(indexProducts, 1)
            await history.save();
            return res.json({ status: 200, message: `Successfully removed product with idCart: ${idCart} from history!` });
        }

    } catch (error) {
        return res.json({ status: 500, message:'Failed to remove history!', error: error.message })
    }
}

const removeHistorySeller = async (req, res) => {
    try {
        const { history_id, idCart } = req.params

        const history = await historyModelSeller.findOne({ history_id })
        if(history === 0) return res.json({ status: 404, message: 'History not found!' })

        const indexProducts = history.products.findIndex(data => data.idCart === idCart)
        if (indexProducts === -1) {
            return res.json({ status: 404, message: 'Product not found in history!' });
        }

        history.products.splice(indexProducts, 1)
        await history.save();

        return res.json({ status: 200, message: `Successfully remove history by idCart: ${idCart}!` })

    } catch (error) {
        return res.json({ status: 500, message:'Failed to remove history!', error: error.message })
    }
}

const getAllHistory = async (req, res) => {
    try {  
        const { id } = req.params
        const filter = {
            $or: [
                { shop_id: id },
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