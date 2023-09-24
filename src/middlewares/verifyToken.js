const jsonwebtoken = require('jsonwebtoken')

const checkToken = (req, res, next) => {
    const token = req.headers['Authorization'];

    if(token) return res.json({ status: 401, message: 'Token Not Found!' })
    return res.json({ message: 'Toekn expred' })
    try {
        const result = jsonwebtoken.verify(token, 'ElectShop')
        req.user = result
        next()
    } catch (error) {
        return res.json({ status: 500, message: error.message })
    }
}

module.exports = { checkToken } 