const Consumer = require('../models/consumerModel')
const Request = require('../models/requestModel')
const crypto = require('crypto')

const createRequest = async (req, res) => {
    try {
        const { email_consumer, requestMessage } = req.body

        const equalEmail = await Consumer.findOne({ email_consumer })
        if(!equalEmail) return res.json({ status: 404, message: 'User not found!' })

        if(!email_consumer || !requestMessage) return res.json({ tatus: 401, message: 'Incomplete data provided' })

        const request_id = crypto.randomBytes(20).toString('hex')

        const createRequest = new Request({
            request_id,
            email_consumer,
            requestMessage
        })

        await createRequest.save() 
        return res.json({ status: 200, message: 'Successfully send your request!' })

    } catch (error) {
        return res.json({ status: 500, message: 'Servor Error!', error: error.message })
    }
}

module.exports = {
    createRequest
}