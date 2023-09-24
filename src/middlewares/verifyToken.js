const jsonwebtoken = require('jsonwebtoken')

const checkToken = (req, res, next) => {
    try {
        const token = req.headers['Authorization'].split(' ')[1];
    
        if(!token) return res.json({ status: 401, message: 'Token Not Found!', token })
        
        const result = jsonwebtoken.verify(token, 'ElectShop')
        req.user = result
        next()
    } catch (error) {
        return res.json({ status: 500, message: error.message })
    }
}

module.exports = { checkToken } 