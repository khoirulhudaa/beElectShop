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

        const response = await RajaOngkir.getCities()
        console.log('list provni: ', response.rajaongkir.results)
        const result = await response.filter(data => data.province_id === id)
        
        if(result === 0 || !result) return res.json({ status: 404, message: 'City not found!' })

        return res.json({ status: 200, message: 'Successfully get data all city', data: result })
    } catch (error) {
        return res.json({ status: 500, message: 'Server error!', error: error.message })
    }
}

module.exports = {
    getProvince,
    getCity
}