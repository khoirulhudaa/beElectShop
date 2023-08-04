const shopModel = require('../models/shopModel')
const bcrypt = require('bcryptjs')

const createShop = async (req, res) => {
    try {
        // Ambil semua data yang dikirim oleh client
        const { seller_name, email_seller, password, telephone_seller } = req.body 
        
        // Cek email apakah sudah ada ?
        const equalEmail = await shopModel.findOne(email)

        if(equalEmail) return res.json({ status: 401, message: 'Email already exist!' })
        if(password.length < 5) return res.json({ status: 500, message: 'Mnn character length is 6' })

        // Mengubah password menjadi character random
        const hash = await bcrypt.genSalt(10)
        const newPasswordGenerate =  await bcrypt.hash(password, hash)

        // Kirim data ke schema mongodb/database
        const create = await new shopModel({
            seller_name,
            email_seller,
            password: newPasswordGenerate,
            telephone_seller
        })

        if(create) return res.josn({ status: 200, message: 'Successfully', data: create })
        
    } catch (error) {
        return res.json({ status: 500, mesage: error.message })
    }
}

const getAllShop = async (req, res) => {
    try {
        const { id_shop } = req.params
        const filter = {}
        if(id_shop) filter.id_shop = id_shop 
        
        const dataShop = await shopModel.find(filter)
        if(!dataShop) return res.json({ status: 404, message: 'Shop not found!' })

        return res.json({ status: 200, data: dataShop })

    } catch (error) {
        return res.json({ status: 500, message: error.message })
    }
}

const removeShopById = async (req, res) => {
    try {
        const { id_shop } = req.query
        const dataShopDelete = await shopModel.findByIdAndRemove(id_shop)

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