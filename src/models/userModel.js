const mongoose = require('mongoose')

const ConsumerSchema = new mongoose.Schema({
    consumer_name: {
        type: String,
        required: true
    },
    email_consumer: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(value) {
                // Use a regular expression to validate the email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
            },
            message: 'Invalid email format',
        }
    },
    password: {
        type: String,
        required: true
    },
    consumer_id: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        default: 'Male'
    },
})

module.exports = mongoose.model('consumer', ConsumerSchema)