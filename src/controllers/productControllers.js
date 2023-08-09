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

const createProduct = async (req, res) => {
    try {
        const { product_name, shop_id, product_type, product_color, product_desc, product_foto, product_price, product_size, product_brand, quantity } = req.body  
        
        // Periksa apakah sudah ada data dengan spesifikasi yang sama
        const equalProduct = await productModel.findOne({
            product_id,
            product_name
        }) 

        if(equalProduct) return res.json({ status: 401, message: 'Product already exist!' })
        
        function generateRandomString(length) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
          
            for (let i = 0; i < length; i++) {
              const randomIndex = Math.floor(Math.random() * characters.length);
              result += characters.charAt(randomIndex);
            }
          
            return result;
        }
          
        const randomString = generateRandomString(5);

        // Push data ke schema/database
        const createNewProduct = new productModel({
            shop_id,
            product_id: randomString,
            product_name,
            product_type,
            product_color,
            product_desc,
            product_img,
            product_price,
            product_size,
            product_brand,
            quantity
        })
        await createNewProduct.save()
        
        return res.json({ status: 200, message: 'Successfully add new product!' })

    } catch (error) {
        return res.json({ sratus: 500, message: error })
    }
}

module.exports = {
    getAllProducts,
    removeProductById
}