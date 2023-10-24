const shopModel = require('../models/shopModel')
const bcrypt = require('bcryptjs')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const extname = path.extname(file.originalname);
        const originalFileName = file.originalname;
        const fileNameWithoutExtension = path.parse(originalFileName).name.split(' ').join('');

        cb(null, `${fileNameWithoutExtension}_${Date.now()}${extname}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        const allowExtensions = ['.jpg', '.jpeg', '.png'];
        const extname = path.extname(file.originalname);

        if (allowExtensions.includes(extname)) {
            cb(null, true);
        } else {
            const error = new Error('Hanya file dengan ekstensi jpg, jpeg, atau png yang diperbolehkan.');
            cb(error);
        }
    },
});

const createShop = async (req, res) => {
    console.log(req)
    try {
        const { 
            seller_name, 
            shop_name, 
            email_seller, 
            telephone_seller, 
            motto_shop, 
            description_shop, 
            shop_address,
            seller_id
        } = req.body 

        // Cek apakah email sudah ada
        const equalEmail = await shopModel.findOne({ email_seller });

        if (equalEmail) {
            return res.json({ status: 401, message: 'Shop already exists' });
        }

        if (!req.file) {
            return res.json({ status: 401, message: 'File Not Found' });
        }

        // Kirim data ke schema mongodb/database
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

        const create = new shopModel({
            shop_id: randomString,
            seller_name,
            seller_id,
            shop_name,
            email_seller,
            shop_address,
            motto_shop,
            image_shop: req.file.filename, 
            telephone_seller,
            description_shop,
            followers: 0
        });

        const created = await create.save();

        if (created) {
            return res.json({ status: 200, message: 'Successfully create shop!' });
        } else {
            return res.json({ status: 500, message: 'Failed to signup!' });
        }
        
    } catch (error) {
        console.log(req)
        console.error(error); // Cetak kesalahan ke konsol
        return res.json({ status: 500, message: 'Failed to signup!', error: error.message  });
    }   
}


const getAllShop = async (req, res) => {
    try {
        const { seller_id } = req.params
        const filter = {}
        if(seller_id) filter.seller_id = seller_id 
        
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

        if(!dataShopDelete) return res.json({ status: 404, message: 'Failed to delete shop' })

        return res.json({ status: 200, message: 'Successfully delete shop', data: equalShopId })
    } catch (error) {
        return res.json({ status: 500, message: 'Failed to delete shop', error: error.message });
    }
}

const updateShop = async (req, res) => {
    try {
        const { shop_id } = req.params
        const { seller_name, shop_name, shop_address, motto_shop, description_shop, telephone_seller, followers } = req.body;
        
        const equalShop = await shopModel.findOne({ shop_id })
        if(!equalShop) return res.json({ status: 404, message: 'Shop not found!' })
        
        const oldImage = equalShop.image_shop; // Ambil oldImage sebelum mengganti image_shop
        const image_shop = req.file ? req.file.filename : undefined;
        
        const filter = { shop_id }
        const set = { 
            seller_name,
            shop_name,
            shop_address,
            image_shop,
            motto_shop,
            description_shop,
            telephone_seller,
            followers
        }
        
        const update = await shopModel.updateOne(filter, set)
        
        if(!update) {
            console.error('Gagal memperbarui data toko:', update);
            return res.json({ status: 500, message: 'Failed to update shop!', img_old: oldImage })
        }
    
        if(oldImage && image_shop) {
            try {
                const imagePath = path.join(__dirname, '..', 'uploads', oldImage);
                await fs.promises.unlink(imagePath);
            } catch(error) {
                return res.json({ status: 500, message: 'Error removing old image!', error: error.message })
            }
        }
        
        return res.json({ status: 200, message: 'Successfully to update product!'})
        // return res.json({ status: 200, message: 'Successfully to update product!'})
    
    } catch (error) {
        return res.json({ status: 500, message: 'Failed to update product', error: error.message })
    }
}


module.exports = {
    getAllShop,
    removeShopById,
    createShop,
    updateShop,
    upload
}