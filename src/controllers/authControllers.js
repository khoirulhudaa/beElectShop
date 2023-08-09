const Consumer = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const shopModel = require('../models/shopModel')


const signUpConsumer = async (req, res) => {
    try {
        const { email_consumer, consumer_name, gender, telephone_consumer, password, consumer_id} = req.body
       
        const register = await Consumer.findOne({ email_consumer })
        if(register) return res.json({ status: 400, message: 'Email already exist!' })

        const salt = await bcrypt.genSalt(10)
        const passwordHashGenerate = await bcrypt.hash(password, salt)
        const newConsumer = new Consumer({
            consumer_name,
            email_consumer,
            password: passwordHashGenerate,
            gender,
            consumer_id,
            telephone_consumer
        })

        await newConsumer.save()
        return res.json({ status: 200, message: 'Success User!' })

    } catch (error) {
        return res.json({ status: 500, message: 'Failed to signUp', error: error.message });
    }
}

const signInConsumer = async (req, res) => {
    try {
        const {email_consumer, password} = req.body
        const consumer = Consumer.findOne({ email_consumer })
        if(!consumer) return res.json({ status: 404, message: 'User not found!' })

        bcrpt.compare(password, consumer.password, (err, isMatch) => {
            if(err) return res.json({ status: 500, message: 'Internal server error!' })
            if(!isMatch) return res.json({ status: 401, message: 'Wrong password' })

            const token = jwt.sign({ consumer_id: consumer.consumer_id }, 'ElectShop', { expired: '1h' })
            return res.json({ status: 200, token, data: consumer })
        })
        
    } catch (error) {
        return res.json({ status: 500, message: 'Failed to signIn', error: error.message });
    }
} 

const signInSeller = async (req, res) => {
    try {
        const {email_seller, password} = req.body
        const seller = await shopModel.findOne({ email_seller })
        if(!seller) return res.json({ status: 404, message: 'Seller not found!' })

        bcrypt.compare(password, seller.password, (err, isMatch) => {
            if(err) return res.json({ status: 500, message: 'Internal server error!' })
            if(!isMatch) return res.json({ status: 401, message: 'Wrong password' })

            const token = jwt.sign({ shop_id: seller.shop_id }, 'ElectShop', { expired: '1h' })
            return res.json({ status: 200, token, data: seller })
        })
        
    } catch (error) {
        return res.json({ status: 500, message: 'Failed to signIn', error: error.message });
    }
} 

module.exports = {
    signUpConsumer,
    signUpConsumer,
    signInSeller
}