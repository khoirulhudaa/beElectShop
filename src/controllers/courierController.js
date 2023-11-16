const dotenv = require('dotenv')
dotenv.config()

const RajaOngkir = require('rajaongkir-nodejs').Starter('c653f4291140d09c83e96169ad19724d');

const getProvince = async (req,  res) => {
    try {    
        const response = await RajaOngkir.getProvinces()
        
        return res.json({ status: 200, message: 'Successfully get data all provincy', data: response })
    } catch (error) {
        return res.json({ status: 500, message: 'Server error!', error: error.message })
        
    }
}

const getCity = async (req, res) => {
    try {
        const { id } = req.params

        const response = await RajaOngkir.getCities(id)
        
        return res.json({ status: 200, message: 'Successfully get data all city', data: response })
    } catch (error) {
        return res.json({ status: 500, message: 'Server error!', error: error.message })
    }
}

module.exports = {
    getProvince,
    getCity
}