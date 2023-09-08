const Consumer = require('../models/consumerModel')
const Seller = require('../models/sellerModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const shopModel = require('../models/shopModel')


// Consumer Authentication

const signUpConsumer = async (req, res) => {
    try {
        const { email_consumer, consumer_name, gender, telephone_consumer, password } = req.body
       
        const equalConsumer = await Consumer.findOne({ email_consumer })
        if(equalConsumer) return res.json({ status: 400, message: 'Email already exist!' })
 
        function generateRandomString(length) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
          
            for (let i = 0; i < length; i++) {
              const randomIndex = Math.floor(Math.random() * characters.length);
              result += characters.charAt(randomIndex);
            }
          
            return result;
        }
          
        const randomString = generateRandomString(5);

        const salt = await bcrypt.genSalt(10)
        const passwordHashGenerate = await bcrypt.hash(password, salt)

        const newConsumer = new Consumer({
            consumer_name,
            email_consumer,
            password: passwordHashGenerate,
            gender,
            consumer_id: randomString,
            telephone_consumer
        })

        await newConsumer.save()
        return res.json({ status: 200, message: 'Success Register!' })

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


// Seller Authentication


const signUpSeller = async (req, res) => {
    try {
        const { email_seller, seller_name, gender, telephone_seller, password } = req.body
       
        const equalSeller = await Seller.findOne({ email_seller })
        if(equalSeller) return res.json({ status: 400, message: 'Email already exist!' })

        function generateRandomString(length) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
          
            for (let i = 0; i < length; i++) {
              const randomIndex = Math.floor(Math.random() * characters.length);
              result += characters.charAt(randomIndex);
            }
          
            return result;
        }
          
        const randomString = generateRandomString(5);

        const salt = await bcrypt.genSalt(10)
        const passwordHashGenerate = await bcrypt.hash(password, salt)

        const newSeller = new Seller({
            seller_name,
            email_seller,
            password: passwordHashGenerate,
            gender,
            seller_id: randomString,
            telephone_seller
        })

        await newSeller.save()
        return res.json({ status: 200, message: 'Successfully register!' })

    } catch (error) {
        return res.json({ status: 500, message: 'Failed to signUp', error: error.message });
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


// Delete Account

const removeConsumer = async (req, res) => {
    try {
        const { consumer_id } = req.params

        const equalConsumer = await Consumer.findOne({ consumer_id })
        if(!equalConsumer) return res.json({ status: 404, message: 'User Not Found!' })

        const deleteConsumer = await Consumer.deleteOne({ consumer_id })
        if(!deleteConsumer) return res.json({ status: 500, message: 'Failed to delete user!' })

        return res.json({ status: 200, message: "Successfully to delete user", data: equalConsumer })
    } catch (error) {
        
    }
}

const removeSeller = async (req, res) => {
    try {
        const { seller_id } = req.params

        const equalSeller = await Seller.findOne({ seller_id })
        if(!equalSeller) return res.json({ status: 404, message: 'User Not Found!' })

        const deleteSeller = await Seller.deleteOne({ seller_id })
        if(!deleteSeller) return res.json({ status: 500, message: 'Failed to delete seller!' })

        return res.json({ status: 200, message: "Successfully to delete seller", data: equalSeller })
    } catch (error) {
        return res.json({ status: 500, message: 'Error server', error })
    }
}


// Get users


const getAllConsumer = async (req, res) => {
    try {
        const getConsumer = await Consumer.find()

        return res.json({ status: 200, message: 'Successfully get users', data: getConsumer })

    } catch (error) {
        return res.json({ status: 500, message: 'Error server', error })
    }
}

const getAllSeller = async (req, res) => {
    try {
        const getSeller = await Seller.find()

        return res.json({ status: 200, message: 'Successfully get users', data: getSeller })

    } catch (error) {
        return res.json({ status: 500, message: 'Error server', error })
    }
}

// Kode untuk mengirim pesan email sebelum update password

// const sendEmailConsumer = async (req, res) => {
//     try {
//         const { email_consumer } = req.body
//         const equalEmail = await userModel.findOne(email_consumer)
//         if(!equalEmail) return res.json({ status: 404, message: 'Email not found!' })
//     } catch (error) {
//         return res.json({ status: 500, message: 'Error server', error: error.message })
//     }
// }



// Kode untuk proes pembaharuan password consumer & seller

// const updatePasswordConsumer = async (req, res) => {
//     try {
//         const { email_consumer } = req.params
//         const equalEmail = await userModel.findOne(email_consumer)

//         if(!equalEmail) return res.json({ status: 404, message: 'Email not found!' })

//         const filter = { email_consumer }
//         const setPassword = { password }

//         const updatePassword = await userModel.updateOne(filter, setPassword)
//         if(!updatePassword) return res.json({ status: 500, message: 'Failed to update password!' })

//         return res.json({ status: 200, message: 'Successfully to update password'})
//     } catch (error) {
//         return res.json({ status: 200, message: 'Error server', error: error.message })
//     }
// }

// const updatePasswordSeller = async (req, res) => {
//     try {

//     } catch (error) {
//         return res.json({ status: 500, message: 'Error server', error: error.message })
//     }
// }

module.exports = {
    signUpConsumer,
    signInConsumer,
    signUpSeller,
    signInSeller,
    getAllConsumer,
    getAllSeller,
    removeConsumer,
    removeSeller
}