const { show, remove } = require("../../services")
const productModel = require('../../models/productModel')
const { sendError, sendResponse } = require("../../helpers/responseHelper")

const getAllProducts = async (req, res) => {
    try {
        // Ambil paramenters dari URL
        const { id_shop, product_name, product_size, product_brand, price } = req.query
        let filter = {}

        // Filter product berdasarkan kriteria nya
        if(id_shop) filter.id_shop = id_shop
        if(product_name) filter.product_name = product_name
        if(product_size) filter.product_size = product_size
        if(product_brand) filter.product_brand = product_brand

        // Panggil service untuk ambi data product dari schema
        const resultProducts = await show(res, filter, productModel)

        // Jika data ditemukan makan error 404
        if(!resultProducts) sendError(res, 404, 'Product not found!')

        // Urutkan product berdasarkan harga
        // Murah - Mahal
        if(price === 'asc') resultProducts = resultProducts.filter((a, b) => {
            a.product_price - b.product_price
        })
        // Mahal - Murah
        if(price === 'desc') resultProducts = resultProducts.filter((a, b) => {
            b.product_price - a.product_price
        })

        // Kirim data product yang didapatkan
        sendResponse(res, 200, resultProducts)

    } catch (error) {
        sendError(res, 500, error)
    }
}

const removeProducts = async (req, res) => {
    try {
        const { id_product } = req.params

        // Parameter 1 = res | parameter 2 = req | parameter 3 = schema/database mongodb
        const deleteProduct = await remove(req, id_product, schema) 

        if(!deleteProduct) sendError(res, 404, 'Product not found!')
        
        sendResponse(res, 200, id_product)
    } catch (error) {
        sendError(res, error)
    }
}

module.exports = {
    getAllProducts,
    removeProducts
}