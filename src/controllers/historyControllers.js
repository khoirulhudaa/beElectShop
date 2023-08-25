 const historyModel = require('../models/historyModel')

const createHistory = async (req, res) => {
    try {
        const { email_consumer, product_name, shop_id, product_type, product_color, product_desc, product_image, product_price, product_size, product_brand, quantity } = req.body  
        
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
            shop_id,
            history_id: randomString,
            product_id,
            product_name,
            product_type,
            product_color,
            product_desc,
            product_image,
            product_price,
            product_size,
            product_brand,
            quantity,
            product_image
        })

        await createNewHistory.save()
        return res.json({ status: 200, message: 'Succesfully add history' })

    } catch (error) {  
        return res.json({ status: 500, message:'Failed to add history!', error })
    }
}

const removeHistory = async (req, res) => {
    try {
        const { history_id } = req.params
        const equalHistory = await historyModel.findByIdAndRemove(history_id)

        if(!equalHistory) return res.json({ status: 404, message: 'History not found!' })

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