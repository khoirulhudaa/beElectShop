const shopModel = require('../models/shopModel')
const bcrypt = require('bcryptjs')
const multer = require('multer')
const fs = require('fs')
const path = require('path')


const createShop = async (req, res) => {
    try {
        // Ambil semua data yang dikirim oleh client
        const { seller_name, email_seller, password, telephone_seller } = req.body 
        
        // Cek apakah email sudah ada ?
        const equalEmail = await shopModel.findOne({email_seller})

        if(equalEmail) return res.json({ status: 401, message: 'Email already exist!' })
        if(password.length < 5) return res.json({ status: 500, message: 'Min character length is 6' })

        // Mengubah password menjadi character random
        const salt = await bcrypt.genSalt(10)
        const newPasswordGenerate =  await bcrypt.hash(password, salt)

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

        // Kirim data ke schema mongodb/database
        const create = new shopModel({
            shop_id: randomString,
            seller_name,
            email_seller,
            password: newPasswordGenerate,
            telephone_seller
        })
        await create.save()

        if(create) return res.json({ status: 200, message: 'Successfully', data: create })
        
    } catch (error) {
        return res.json({ status: 500, message: 'Failed to signup', error: error.message });
    }
}

// Periksa apa ada folder /uploads jika tidak maka buat otomatis
const uploadDir = path.join(__dirname, '../uploads');
fs.mkdirSync(uploadDir, { recursive: true });

// menentukan destinasi dan nama file gambar 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const extname = path.extname(file.originalname);
        cb(null, `${Date.now()}${extname}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Batasan ukuran 5MB
    fileFilter: (req, file, cb) => {
      const allowExtensions = ['.jpg', '.jpeg', '.png'];
      const extname = path.extname(file.originalname);
  
      if (allowExtensions.includes(extname)) cb(null, true);
      else {
        const error = new Error('Hanya file dengan ekstensi jpg, jpeg, atau png yang diperbolehkan.');
        cb(error);
      }
    },
  });

const getAllShop = async (req, res) => {
    try {
        const { id_shop } = req.params
        const filter = {}
        if(id_shop) filter.shop_id = shop_id 
        
        const dataShop = await shopModel.find(filter)
        if(!dataShop) return res.json({ status: 404, message: 'Shop not found!' })

        return res.json({ status: 200, data: dataShop })

    } catch (error) {
        return res.json({ status: 500, message: 'Failed to get data', error: error.message });
    }
}

const removeShopById = async (req, res) => {
    try {
        const { shop_id } = req.params

        const equalShopId = await shopModel.findOne({shop_id})
        if(!equalShopId) return res.json({ status: 404, message: 'Shop not found!' })
        
        const dataShopDelete = await shopModel.deleteOne({shop_id})

        if(!dataShopDelete) return res.json({ status: 404, message: 'Shop not found!' })

        return res.json({ status: 200, message: 'Successfully delete shop', data: dataShopDelete })
    } catch (error) {
        return res.json({ status: 500, message: 'Failed to delete shop', error: error.message });
    }
}

const updateShop = async (req, res) => {
    try {
        const { shop_id } = req.params
        const equalProduct = await productModel.findOne(shop_id)

        if(!equalProduct) return res.json({ status: 404, message: 'Product not found!' })

        const filter = { shop_id }
        const set = { 
            shop_id,
            seller_name,
            shop_name,
            email_seller,
            password,
            shop_address,
            image_shop,
            motto_shop,
            description_shop,
            telephone_seller,
            followers
         }
        const update = await shopMOdel.updateOne(filter, set)
        if(!update) return res.json({ status: 500, message: 'Failed to update product!' })

        return res.json({ status: 200, message: 'Successfully to update product!' })

    } catch (error) {
        return res.json({ status: 500, message: 'Failed to update product', error })
    }
}

module.exports = {
    getAllShop,
    removeShopById,
    createShop,
    updateShop,
    upload
}