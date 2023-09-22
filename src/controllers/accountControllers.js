const Consumer = require('../models/consumerModel')
const Seller = require('../models/sellerModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


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
        return res.json({ status: 500, message: 'Failed to signUp', error: error });
    }
}

const signInConsumer = async (req, res) => {
    try {
        const {email_consumer, password} = req.body
        const consumer = await Consumer.findOne({ email_consumer })
        if(!consumer) return res.json({ status: 404, message: 'User not found!' })

        const isMatch = await bcrypt.compare(password, consumer.password);

        if (!isMatch) {
            return res.json({ status: 401, message: 'Incorrect password' });
        }

        const token = jwt.sign({ consumer_id: consumer.consumer_id }, 'ElectShop', { expiresIn: '1h' });
        return res.json({ status: 200, token, data: consumer });
        
    } catch (error) {
        return res.json({ status: 500, message: 'Failed to signIn', error: error.message });
    }
} 


// Seller Authentication


const signUpSeller = async (req, res) => {
    try {
        const { email_seller, seller_name, gender, telephone_seller, password } = req.body
        
        if (!email_seller || !seller_name || !gender || !telephone_seller || !password) {
            return res.status(401).json({ status: 401, message: 'Fields are missing!', data: req.body });
        }

        const equalSeller = await Seller.findOne({ email_seller })
        if(equalSeller) return res.json({ status: 401, message: 'Email already exist!' })

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

        const create = await newSeller.save()
        
        if(!create) return res.json({ status: 401, message: 'Failed create account seller!', data: req.body })
        return res.json({ status: 200, message: 'Successfully register!', data: req.body })

    } catch (error) {
        return res.json({ status: 500, message: 'Failed to signUp', data: req.body });
    }
}

const signInSeller = async (req, res) => {
    try {
        const {email_seller, password} = req.body
        const seller = await Seller.findOne({ email_seller })
        if(!seller) return res.json({ status: 404, message: 'Seller not found!' })

        const isMatch = await bcrypt.compare(password, seller.password)
        if(!isMatch) return res.json({ status: 401, message: 'Incorrect password' })

        const token = jwt.sign({ seller_id: seller.seller_id }, 'ElectShop', { expiresIn: '1h' })
        if(!token) res.json({ status: 500, message: 'Error in token' })
        return res.json({ status: 200, token, data: seller })
        
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

module.exports = {
    signUpConsumer,
    signInConsumer,
    signUpSeller,
    signInSeller,
    removeConsumer,
    removeSeller,
    getAllConsumer,
    getAllSeller
}