const sendResponse = (res, status, data, message) => {
    return res.status(status).json({data, message})
}

const sendError = (res, status, error, message) => {
    if(error.code = 'ECONNREFUSED') {
        return res.status(status).json({ message: 'Service Unavailable!' })
    }

    if(error.response !== undefined) {
        const { status } = error.response
        return res.status(status).json({ message })
    }

    res.status(500).json({ message: 'Failed action!' })
}

module.exports = {
    sendResponse,
    sendError
}