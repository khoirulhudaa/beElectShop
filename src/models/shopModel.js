const mongoose = require('mongoose')

const ShopSchema = new mongoose.Schema({
    seller_name: {
        type: String,
        required: true
    },
    shop_name: {
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
            message: 'Invalid email format'
        }
    },
    password: {
        type: String,
        required: true
    },
    shop_address: {
        type: String,
        required: true
    },
    foto_shop: {
        type: String,
        required: true,
        default: 'defaultShop.jpg'
    },
    motto_shop: {
        type: String,
        required: true
    },
    description_shop: {
        type: String,
        required: true
    },
    telephone_seller: {
        type: String,
        required: true
    },
    followers: {
        type: Number,
        default: 0
    },
})

const shopModel = mongoose.model('shop', ShopSchema)
module.exports = shopModel