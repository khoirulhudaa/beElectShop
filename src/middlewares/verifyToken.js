const jsonwebtoken = require('jsonwebtoken')

const checkToken = (req, res, next) => {
    const token = req.header('Authorization')

    if(!token) return res.json({ status: 401, message: 'Toekn Not Found!' })

    try {
        jsonwebtoken.verify(token, 'electShop')
        next()
    } catch (error) {
        return res.json({ status: 500, message: error.message })
    }
}

module.exports = checkToken 