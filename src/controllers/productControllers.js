const productModel = require("../models/productModel")

const getAllProducts = async (req, res) => {
    try {
        const { id_shop, product_size, product_brand, product_price, product_name } = req.query    
        let filter = {}

        if(id_shop) filter.id_shop = id_shop
        if(product_size) filter.product_size = product_size
        if(product_brand) filter.product_brand = product_brand
        if(product_name) filter.product_name = { $regex: new RegExp(product_name, 'i') }

        let productResult = await productModel.find(filter)

        if(product_price === 'asc') productResult = productResult.sort((a, b) => a.product_price - b.product_price)
        if(product_price === 'desc') productResult = productModel.sort((a, b) => b.product_price - a.product_price)

        return res.json({ status: 200, data: productResult })

    } catch (error) {
        return res.json({ status: 500, message: error.message })
    }
}

const removeProductById = async (req, res) => {
    try {
        const { id_product } = req.query
        const productDelete = await productModel.findByIdAndRemove(id_product)

        if(!productDelete) return res.json({ status: 404, message: 'Product not found!' })

        return res.json({ status: 200, message: 'Successfully delete product' })
    } catch (error) {
        return res.json({ status: 500, message: 'An error occurred while deleting the product' })
    }
} 

module.exports = {
    getAllProducts,
    removeProductById
}