const Consumer = require('../models/consumerModel')
const RequestModel = require('../models/requestModel')
const crypto = require('crypto')

const createRequest = async (req, res) => {
    try {
        const { email_consumer, requestMessage } = req.body
        
        if(!email_consumer || !requestMessage) return res.json({ status: 401, message: 'Incomplete data provided' })

        const user = await Consumer.findOne({ email_consumer })
        if(!user) return res.json({ status: 404, message: 'User not found!' })

        // const request_id = crypto.randomBytes(20).toString('hex')
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

        const createRequestMessage = new RequestModel({
            request_id: randomString,
            email_consumer,
            requestMessage
        })

        await createRequestMessage.save() 
        return res.json({ status: 200, message: 'Successfully send your request!' })

    } catch (error) {
        return res.json({ status: 500, message: 'Server Error!', error: error.message })
    }
}

module.exports = {
    createRequest
}