const shopModel = require('../models/shopModel')
const bcrypt = require('bcryptjs')

const createShop = async (req, res) => {
    try {
        // Ambil semua data yang dikirim oleh client
        const { seller_name, email_seller, password, telephone_seller } = req.body 
        
        // Cek email apakah sudah ada ?
        
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
        return res.json({ status: 500, message: error })
    }
}

const getAllShop = async (req, res) => {
    try {
        const { id_shop } = req.params
        const filter = {}
        if(id_shop) filter.shop_id = shop_id 
        
        const dataShop = await shopModel.find(filter)
        if(!dataShop) return res.json({ status: 404, message: 'Shop not found!' })

        return res.json({ status: 200, data: dataShop })

    } catch (error) {
        return res.json({ status: 500, message: error})
    }
}

const removeShopById = async (req, res) => {
    try {
        const { shop_id } = req.query
        const dataShopDelete = await shopModel.findByIdAndRemove(shop_id)

        if(!dataShopDelete) return res.json({ status: 404, message: 'Shop not found!' })

        return res.json({ status: 200, message: 'Successfully delete shop' })
    } catch (error) {
        return res.json({ status: 500, message: 'Failed delete shop!' })
    }
}

module.exports = {
    getAllShop,
    removeShopById,
    createShop
}