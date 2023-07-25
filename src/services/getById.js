const { sendError } = require('../helpers/responseHelper')

module.exports = async (res, filter, schema) => {
    try {
        const resultById = await schema.findOne(filter)
        return resultById
    } catch (error) {
        sendError(res, error)
    }
}