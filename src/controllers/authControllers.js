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

        bcrypt.compare(password, consumer.password, (err, isMatch) => {
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
        return res.json({ status: 500, message: 'Error server', error: error.message });
    }
} 


// Kode untuk mengirim pesan email sebelum update password

const sendEmailConsumer = async (req, res) => {
    try {
        const { email_consumer } = req.body
        const equalEmail = await userModel.findOne(email_consumer)
        if(!equalEmail) return res.json({ status: 404, message: 'Email not found!' })
    } catch (error) {
        return res.json({ status: 500, message: 'Error server', error: error.message })
    }
}



// Kode untuk proes pembaharuan password consumer & seller

const updatePasswordConsumer = async (req, res) => {
    try {
        const { email_consumer } = req.params
        const equalEmail = await userModel.findOne(email_consumer)

        if(!equalEmail) return res.json({ status: 404, message: 'Email not found!' })

        const filter = { email_consumer }
        const setPassword = { password }

        const updatePassword = await userModel.updateOne(filter, setPassword)
        if(!updatePassword) return res.json({ status: 500, message: 'Failed to update password!' })

        return res.json({ status: 200, message: 'Successfully to update password'})
    } catch (error) {
        return res.json({ status: 200, message: 'Error server', error: error.message })
    }
}

const updatePasswordSeller = async (req, res) => {
    try {

    } catch (error) {
        return res.json({ status: 500, message: 'Error server', error: error.message })
    }
}

module.exports = {
    signUpConsumer,
    signUpConsumer,
    signInSeller,
    signInConsumer,
    updatePasswordConsumer,
    updatePasswordSeller
}