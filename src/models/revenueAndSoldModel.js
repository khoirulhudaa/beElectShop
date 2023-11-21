const mongoose = require('mongoose')

const revenueSoldSchema = new mongoose.Schema({
    shop_id: {
        type: String,
        required: true
    },
    revenue: {
        type: String,
        required: true
    },
    sold: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('revenueAndSold', revenueSoldSchema)