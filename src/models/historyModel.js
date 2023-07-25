const mongoose = require('mongoose')

const HistorySchema = new mongoose.Schema({
    consumer_name: {
        type: String,
        required: true
    },
    seller_name: {
        type: String,
        required: true
    },
    shop_name: {
        type: String,
        required: true
    },
    id_shop: {
        type: String,
        required: true
    },
    id_consumer: {
        type: String,
        required: true
    },
    id_product: {
        type: String,
        required: true
    },
    rpoduct_price: {
        type: Number,
        required: true
    },
    description_product: {
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
    }
})

module.exports = mongoose.model('history', HistorySchema)