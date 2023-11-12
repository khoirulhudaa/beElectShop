const historyConsumeModel = require('../models/historyInConsumerModel');
const historySellerModel = require('../models/historyInSellerModel');
const Xendit = require('xendit-node')
const dotenv = require('dotenv');
dotenv.config();

const x = new Xendit({
  secretKey: process.env.XENDIT_API_KEY,
});

const { Disbursement } = x
const disbursement = new Disbursement({});

const handlePaymentCallback = async (req, res) => {
    try {
        const callbackData = req.body;
        console.log('callback:', callbackData)

        await updateDatabase(callbackData.external_id, callbackData)
    
        return res.json({ status: 200, data: callbackData });

    } catch (error) {
        return res.json({ status: 500, message: 'Payment failed!', error: error.message })    
    }
}
  
const disbursementPayment = async (req, res) => {
    try {
      const {
        externalID,
        amount,
        bankCode,
        accountHolderName,
        accountNumber,
        disbursementDescription,
        products, 
      } = req.body;
    
      const createDisbursementParams = {
        externalID,
        amount,
        bankCode,
        accountHolderName,
        accountNumber,
        disbursementDescription,
        items: products,
      };
    
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

      const response = await disbursement.createDisbursement(createDisbursementParams);
      if(response) {
        const dataHistory = {
            history_id: randomString,
            products
        }

        const consumerHistory = new historyConsumeModel(dataHistory)
        const sellerHistory = new historySellerModel(dataHistory)

        await consumerHistory.save()
        await sellerHistory.save()

        return res.json({status: 200, message: 'Your payment is pending, complete it immediately!' , data: response});
      } else {
        return res.json({ status: 500, error: 'Error payment!' });
      }
      
    } catch (error) {
      console.error('Disbursement Error:', error);
      return res.json({ status: 500, error: 'Server Error', message: error.message });
    }
};
  

const cancelOrder = async (req, res) => {
  try {
    const { external_id } = req.params;
    const status = 'CANCEL'

    updateDatabase(external_id, status)

    res.status(200).json({ message: 'Order canceled successfully' });
  } catch (error) {
    console.error('Cancellation Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateDatabase = async (external_id, data) => {
  try {
      const filter = { external_id };
      const updateData = {
          status: data.status,
          date: new Date(),
      };

      const [resultInConsumer, resultInSeller] = await Promise.all([
          HistoryInConsumer.updateOne(filter, updateData),
          HistoryInSeller.updateOne(filter, updateData),
      ]);

      return res.json({ status: 200, message: 'Success update database!',
          data: {
            resultInConsumer,
            resultInSeller,
          },
      });
  } catch (error) {
      return res.json({ status: 500, message: 'Error server!', error: error.message });
  }
};

module.exports = {
    handlePaymentCallback,
    cancelOrder,
    disbursementPayment,
}