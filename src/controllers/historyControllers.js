 const historyModel = require('../models/historyModel')

const createHistory = async (req, res) => {
    try {
        const { email_consumer, consumer_id, consumer_name, shop_name, product_id, shop_id, product_name, product_type, product_color, product_category, product_description, product_price, product_size, product_brand, quantity, amount } = req.body  
        
        if(req.file)

        function generateRandomString(length) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
          
            for (let i = 0; i < length; i++) {
              const randomIndex = Math.floor(Math.random() * characters.length);
              result += characters.charAt(randomIndex);
            }
          
            return result;
        }
          
        const randomString = generateRandomString(5);

        const createNewHistory = new historyModel({
            email_consumer,
            consumer_id,
            shop_name,
            consumer_name,
            shop_id,
            product_id,
            history_id: randomString,
            product_name,
            product_type,
            product_color,
            product_description,
            product_price,
            product_size,
            product_brand,
            product_category,
            quantity,
            amount
        })

        await createNewHistory.save()
        return res.json({ status: 200, message: 'Successfully checkout' })

    } catch (error) {  
        return res.json({ status: 500, message:'Failed to checkout', error: error.message })
    }
}

const removeHistory = async (req, res) => {
    try {
        const { history_id } = req.params
        const equalHistory = await historyModel.findOne({ history_id })
        if(!equalHistory) return res.json({ status: 404, message: 'History not found!' })
        

        const deleteHistory = await historyModel.deleteOne({ history_id })
        if(!deleteHistory) return res.json({ status: 404, message: 'Failed for delete history!' })

        return res.json({ status: 200, message: 'Successfully remove history!' })

    } catch (error) {
        return res.json({ status: 500, message:'Failed to remove history!', error })
    }
}

const getAllHistory = async (req, res) => {
    try {  
        const { product_name, product_brand } = req.query
        let filter = {}

        if (product_name) filter.product_name = {$regex: new RegExp(product_name, 'i') }
        if (product_brand) filter.product_brand = product_brand

        const data = await historyModel.find(filter)
        
        return res.json({ status: 200, message: 'Successfully get data history!', data })

    } catch (error) {
        return res.json({ status: 500, message: 'Failed to get history!', error })
    }
}

module.exports = {
    createHistory,
    removeHistory,
    getAllHistory
}