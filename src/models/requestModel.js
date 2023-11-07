const mongoose = require('mongoose')

const requestSchema = new mongoose.Schema({
    request_id: {
        type: string,
        required: true
    },
    messageRequest: {
        type: String,
        required: true
    },
    email_consumer: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: new Date()
    }
})

module.exports = mongoose.model('request', requestSchema)