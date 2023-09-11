const mongoose = require('mongoose')

const SellerSchema = new mongoose.Schema({
    seller_name: {
        type: String,
        required: true
    },
    email_seller: {
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
    seller_id: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        default: 'Male'
    },
    telephone_seller: {
        type: String,
        required: true,
        maxLength: 13
    }
})

module.exports = mongoose.model('seller', SellerSchema)