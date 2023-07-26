const shopModel = require('../models/shopModel')

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
    removeShopById
}