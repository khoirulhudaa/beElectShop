const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true
    },
    id_product: {
        type: String,
        required: true
    },
    id_shop: {
        type: String,
        required: true
    },
    product_type: {
        type: String,
        required: true,
        default: 'New product'
    },
    product_color: {
        type: String,
        required: true,
        default: 'random'
    },
    product_description: {
        type: String,
        required: true
    },
    product_foto: {
        type: String,
        required: true,
        default: 'default.jpg'
    },
    product_price: {
        type: Number,
        required: true,
        default: 0
    },
    product_size: {
        type: Array,
        required: true,
        default: 'normal'
    },
    product_brand: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
})

module.exports = mongoose.model('product', productSchema)