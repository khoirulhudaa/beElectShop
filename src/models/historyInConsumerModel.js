const mongoose = require('mongoose')

const HistorySchema = new mongoose.Schema({
    history_id: {
        type: String,
        required: true
    },
    products: [
        {
            consumer_name: {
                type: String,
                required: true
            },
            consumer_id: {
                type: String,
                required: true
            },
            shop_name: {
                type: String,
                required: true
            },
            email_consumer: {
                type: String,
                required: true
            },
            shop_id: {
                type: String,
                required: true
            },
            product_image: {
                type: String,
                required: true
            },
            product_id: {
                type: String,
                required: true
            },
            product_name: {
                type: String,
                required: true
            },
            product_type: {
                type: String,
                required: true
            },
            product_price: {
                type: Number,
                required: true
            },
            product_description: {
                type: String,
                required: true
            },
            product_brand: {
                type: String,
                required: true
            },
            quantity: {
                type: String,
                required: true
            },
            product_size: {
                type: String,
                required: true
            },
            product_color: {
                type: String,
                required: true
            },
            product_category: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: new Date()
            },
            total_amount: {
                type: Number,
                required: true
            },
            status: {
                type: String,
                require: true
            },
            date: {
                type: Date,
                default: new Date()
            }
        }
    ]
})

module.exports = mongoose.model('HistoryConsumer', HistorySchema)