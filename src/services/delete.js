const { sendError, sendResponse } = require('../helpers/responseHelper')

module.exports = async (res, id, schema) => {
    try {
        const deleteProduct = await schema.findByIdAndRemove(id)
        return deleteProduct
    } catch (error) {
        sendError(res, error)
    }
}