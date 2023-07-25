const { sendError, sendResponse } = require('../helpers/responseHelper')

module.exports = async (res, filter, schema) => {
    try {
        const data = await schema.find(filter)
        return data
    } catch (error) {
        return sendError(res, error)
    }
}