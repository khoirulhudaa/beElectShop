const Consumer = require('../models/consumerModel')
const Request = require('../models/requestModel')
const crypto = require('crypto')

const createRequest = async (req, res) => {
    try {
        const { email_consumer, requestMessage } = req.body

        const user = await Consumer.findOne({ email_consumer })
        if(!user) return res.json({ status: 404, message: 'User not found!' })

        if(!email_consumer || !requestMessage) return res.json({ status: 401, message: 'Incomplete data provided' })

        const request_id = crypto.randomBytes(20).toString('hex')

        const createRequestMessage = new Request({
            request_id,
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