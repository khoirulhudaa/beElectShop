const historyConsumeModel = require('../models/historyInConsumerModel');
const historySellerModel = require('../models/historyInSellerModel');
const paymentMethodModel = require('../models/methodePayment');
const crypto = require('crypto')
const dotenv = require('dotenv');
dotenv.config();

const { Payout: PayoutClient } = require('xendit-node');

const xenditPayoutClient = new PayoutClient({ secretKey: process.env.XENDIT_API_KEY });

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
        amount,
        channelCode,
        accountHolderName,
        accountNumber,
        description,
        products, 
      } = req.body;

      const referenceId = crypto.randomBytes(20).toString('hex')

      const data = {
        amount,
        channelProperties: {
          accountNumber,
          accountHolderName,
        },
        description,
        currency: "IDR",
        type: "DIRECT_DISBURSEMENT",
        referenceId,
        channelCode
      }
      

      const response = await xenditPayoutClient.createPayout({
          idempotencyKey: referenceId,
          data
      })

      if(response) {
        const dataHistory = {
            history_id: referenceId,
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
  
const getAllPaymentByShop = async (req, res) => {
  try {
      const { shop_id } = req.params
      
      const getPayment = await paymentMethodModel.findOne({ shop_id })
      
      if(getPayment === 0) return res.json({ status: 404, message: 'Data payment not found!' })

      return res.json({ status: 200, message: 'All data payment method', data: getPayment })

  } catch (error) {
      return res.json({ status: 500, message: 'Error server!', error: error.message });
  }
}

const updatePaymentMethod = async (req, res) => {
  try {
    const { shop_id } = req.params
    const updates = req.body;

    if(!updates) return res.json({ status: 200, message: 'Invalid parameter!', data: updates })

    const updatePromises = updates.map(async (update) => {
        const { bank_code, account_cumber } = update;
        
        return paymentMethodModel.findOneAndUpdate(
            { shop_id: shop_id, 'payments.bank_code': bank_code },
            { $set: { 
              'payments.$.account_number': account_cumber 
            } },
            { new: true }
        );
    });

    await Promise.all(updatePromises);    
    return res.json({ status: 200, message: 'Successfully update payment method!' })

  } catch (error) {
    return res.json({ status: 500, message: 'Error server!', error: error.message });
  }
}

module.exports = {
    handlePaymentCallback,
    cancelOrder,
    disbursementPayment,
    getAllPaymentByShop,
    updatePaymentMethod
}