const { sendError, sendResponse } = require("../../helpers/responseHelper")
const consumerModel = require("../../models/userModel")
const bcyrpt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const getById = require("../../services/getById")

const signUp = async (req, res) => {
    try {
        const { email_consumer, consumer_name, gender, telephone_consumer, password, consumer_id } = req.body
        
        const checkEmail = await consumerModel.findOne({ email_consumer })
        if(checkEmail) return sendResponse(res, 400, email_consumer, 'Email alredy exist!')
        
        const salt = await bcyrpt.genSalt(10)
        const hashPassword = await bcyrpt.hash(password, salt)

        const resultSignin = new consumerModel.create({
            email_consumer,
            password: hashPassword,
            gender,
            consumer_name,
            telephone_consumer,
            consumer_id
        })

        await resultSignin.save()
        return sendResponse(res, 200, resultSignin)
    } catch (error) {
        return sendError(res, error)
    }
}

const signIn = async (req, res) => {
    try {
        const { email_consumer, password } = req.body
        
        const checkEmail = await getById(res, email_consumer, consumerModel)
        if(!checkEmail) return sendError(res, 404, 'Email not found!')

        bcyrpt.compare(password, consumerModel.password, (err, isMatch) => {
            if(err) return sendError(res, 500, err)
            if(!isMatch) return sendError(res, 404, password, 'Password do not match')

            const token = jwt.sign({consumer_id: checkEmail.consumer_id}, 'ElectShop', {expired: '1h'})
            const data = {
                data: checkEmail,
                token
            }
            return sendResponse(res, 200, data, 'Successfully login')
        })

    } catch (error) {
        return sendError(res, error)
    }
}

module.exports = {
    signUp,
    signIn
}