const productModel = require("../models/productModel")
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const getAllProducts = async (req, res) => {
    try {
        const { shop_id, product_size, product_brand, product_price, product_name } = req.query    
        let filter = {}

        if(shop_id) filter.shop_id = shop_id
        if(product_size) filter.product_size = product_size
        if(product_brand) filter.product_brand = product_brand
        if(product_name) filter.product_name = { $regex: new RegExp(product_name, 'i') }

        let productResult = await productModel.find(filter)

        if(product_price === 'asc') productResult = productResult.sort((a, b) => a.product_price - b.product_price)
        if(product_price === 'desc') productResult = productModel.sort((a, b) => b.product_price - a.product_price)

        return res.json({ status: 200, data: productResult, message: 'Data semua produk' })

    } catch (error) {
        return res.json({ status: 500, message: error.message })
    }
}

const removeProductById = async (req, res) => {
    try {
        const { product_id } = req.params
        const equalProductId = await productModel.findOne({product_id})
        if(!equalProductId) return res.json({ status: 404, message: 'Product not found!' })

        const dataProductDelete = await productModel.deleteOne({product_id})

        if(!dataProductDelete) return res.json({ status: 404, message: 'Failed to delete product' })

        return res.json({ status: 200, message: 'Successfully delete product' })
        
    } catch (error) {
        return res.json({ status: 500, message: 'An error occurred while deleting the product' })
    }
} 


const uploadDir = path.join(__dirname, '../uploads')
fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const extname = path.extname(file.originalname);
        const originalFileName = file.originalname;
        const fileNameWithoutExtension = path.parse(originalFileName).name.split(' ').join('');

        cb(null, `${fileNameWithoutExtension}_${Date.now()}${extname}`);
    }
})

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Batasan ukuran 5Mb
    fileFilter: (req, file, cb) => {
        const allowExtensions = ['.jpg', '.png', '.jpeg']
        const extname = path.extname(file.originalname)

        if (allowExtensions.includes(extname)) {
            cb(null, true);
        } else {
            const error = new Error('Hanya file dengan ekstensi jpg, jpeg, atau png yang diperbolehkan.');
            cb(error);
        }
    }
})


const createProduct = async (req, res) => {
    try {
        const { product_name, shop_id, product_type, product_category, product_color, product_description, product_price, product_size, product_brand, quantity } = req.body  

        // Validasi data
        if (!product_name || !shop_id || !product_type || !product_color || !product_description || !product_price || !product_size || !product_brand || !quantity) {
            return res.status(400).json({ status: 400, message: 'Incomplete data provided' });
        }

        // Periksa apakah sudah ada data dengan spesifikasi yang sama
        const equalProduct = await productModel.findOne({product_name}) 

        if(equalProduct) return res.json({ status: 401, message: 'Product already exist!' })
        const product_image = req.file.filename

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
            product_description,
            product_image,
            product_price,
            product_size,
            product_category,
            product_brand,
            quantity,
            
        })
        await createNewProduct.save()
        
        return res.json({ status: 200, message: 'Successfully add new product!' })

    } catch (error) {
        return res.json({ status: 500, message: error })
    }
}


const updateProduct = async (req, res) => {
    try {
        const { product_id } = req.params
        const { product_name, product_type, product_category, product_color, product_description, product_price, product_size, product_brand, quantity } = req.body  
        
        const equalProduct = await productModel.findOne({product_id})
        if(!equalProduct) return res.json({ status: 404, message: 'Product not found!' })
        
        const oldImage = equalProduct.product_image
        const product_image = req.file.filename

        const filter = { product_id }
        const set = { 
            product_name,
            product_type,
            product_color,
            product_description,
            product_image,
            product_price,
            product_brand,
            product_size,
            product_category,
            quantity
         }

        const update = await productModel.updateOne(filter, set)
        if(!update) return res.json({ status: 500, message: 'Failed to update product!' })

        if(oldImage && oldImage !== 'defaultShop.jpg') {
            fs.unlink(`../uploads/${oldImage}`, err => {
                if(err) return res.json({ status: 500, message: 'Error to remove old image!', error: err.message })
            })
        }

        return res.json({ status: 200, message: 'Successfully to update product!' })

    } catch (error) {
        return res.json({ status: 500, message: 'Failed to update product', error })
    }
}


module.exports = {
    getAllProducts,
    createProduct,
    removeProductById,
    updateProduct,
    upload
}