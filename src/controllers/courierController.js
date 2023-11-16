const dotenv = require('dotenv')
dotenv.config()

const RajaOngkir = require('rajaongkir-nodejs').Starter(process.env.RAJAONGKIR_API_KEY);

const getProvince = async (req,  res) => {
    try {    
        const response = RajaOngkir.getProvinces()
        
        return res.json({ status: 200, message: 'Successfully get data all provincy', data: response })
    } catch (error) {
        return res.json({ status: 500, message: 'Server error!', error: error.message })
    }
}

const getCity = async (req, res) => {
    try {
        const { id } = req.params

        const response = RajaOngkir.getCity(id)
        
        return res.json({ status: 200, message: 'Successfully get data all city', data: response })
    } catch (error) {
        return res.json({ status: 500, message: 'Server error!', error: error.message })
    }
}

module.exports = {
    getProvince,
    getCity
}