const dotenv = require('dotenv')
dotenv.config()

const RajaOngkir = require('rajaongkir-nodejs')

const getProvince = async (req,  res) => {
    try {    
        const response = await RajaOngkir.getProvinces(process.env.RAJAONGKIR_API_KEY)
        console.log(process.env.RAJAONGKIR_API_KEY)
        return res.json({ status: 200, message: 'Successfully get data all provincy', data: response })
    } catch (error) {
        return res.json({ status: 500, message: 'Server error!', error: error.message })
    }
}

const getCity = async (req, res) => {
    try {
        const { id } = req.params

        const response = RajaOngkir.getCities(process.env.RAJAONGKIR_API_KEY, id)
        
        return res.json({ status: 200, message: 'Successfully get data all city', data: response })
    } catch (error) {
        return res.json({ status: 500, message: 'Server error!', error: error.message })
    }
}

module.exports = {
    getProvince,
    getCity
}