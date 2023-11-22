const historyConsumeModel = require('../models/historyInConsumerModel');
const historySellerModel = require('../models/historyInSellerModel');
const paymentMethodModel = require('../models/methodePayment');
const revenueModel = require('../models/requestModel')
const crypto = require('crypto')
const dotenv = require('dotenv');
dotenv.config();

const { Payout: PayoutClient, Invoice: InvoiceClient  } = require('xendit-node');
const xenditPayoutClient = new PayoutClient({ secretKey: 'xnd_development_LHt55GITF5Fri0xE3vF5Akd28vtDkpLNs2Y1Xcz4gOLOCPJe4hmTmujzagqY4O7' });
const xenditInvoice = new InvoiceClient({secretKey: 'xnd_development_LHt55GITF5Fri0xE3vF5Akd28vtDkpLNs2Y1Xcz4gOLOCPJe4hmTmujzagqY4O7'})


const handlePaymentCallback = async (req, res) => {
    try {
        const callbackData = req.body;
        console.log('callback payment:', callbackData.status)
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
        revenue_id,
        amount,
        channelCode,
        accountNumber,
        accountHolderName,
      } = req.body;

      const referenceId = crypto.randomBytes(20).toString('hex')

      const data = {
        "amount" : amount,
        "channelProperties" : {
          "accountNumber" : accountNumber.toString(),
          "accountHolderName" : accountHolderName
        },
        "description" : "Withdraw",
        "currency" : "IDR",
        "type" : "DIRECT_DISBURSEMENT",
        "referenceId" : referenceId,
        "channelCode" : channelCode
      }
      
      const response = await xenditPayoutClient.createPayout({
          idempotencyKey: referenceId,
          data
      })

      if(response) {
        const filter = { revenue_id }
        const existingData = await revenueModel.findOne(filter);
        
        if (existingData) {
          const balanceMinus = amount - 3000
          const balanceNow = existingData.balance - balanceMinus

          const set = { 
            $inc: { balance: balanceNow }
          }
          console.log('response withdraw:', response)
          await revenueModel.updateOne(filter, set)
          return res.json({status: 200, message: 'Withdraw successfully!!' , data: response});
        }
      }
      
    } catch (error) {
      console.error('Withdraw Error:', error.message);
      return res.json({ status: 500, error: 'Server Error', message: error.message });
    }
};

const createPayment = async (req, res) => {
  try {

    const {
      amount,
      products, 
      accountHolderName,
      telephone_consumer,
      consumer_id,
      email_consumer,
      post_code,
      description,
      address,
      shop_id
    } = req.body;

    const referenceId = crypto.randomBytes(20).toString('hex')
    
    const data = {
      "amount" : amount,
      "invoiceDuration" : 172800,
      "externalId" : shop_id,
      "description" : description,
      "currency" : "IDR",
      "reminderTime" : 1,
      "successRedirectUrl": "https://elect-shop.vercel.app/successPayment",
    }

    const response = await xenditInvoice.createInvoice({
        data
    })

    if(response) {
      const dataHistory = {
          history_id: referenceId,
          products,
          post_code,
          email_consumer,
          status: 'PENDING',
          address,
          description,
          shop_id,
          consumer_name: accountHolderName,
          telephone_consumer,
          consumer_id
      }

      const consumerHistory = new historyConsumeModel(dataHistory)
      const sellerHistory = new historySellerModel(dataHistory)

      await consumerHistory.save()
      await sellerHistory.save()
      
      return res.json({ status: 200, message: 'Your payment is still pending!', data: response})

    } else {
      return res.json({ status: 500, message: 'Failed create payment!!', data: response})
    }
    
  } catch (error) {
    return res.json({ status: 500, message: 'Server error!', error: error.message})
  }
}
  

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
      const filter = { history_id: external_id };
      const filterRevenue = { revenue_id: external_id };

      const updateData = {
          status: data.status,
      };

      const updateDataRevenue = {
          $inc: {revenue: data.amount},
          $inc: {balance: data.amount}
      };

      let revenue
      
      if(data.status === 'PAID') {
        const result = await revenueModel.updateOne(filterRevenue, updateDataRevenue);
        revenue = result.nModified; 
      }

      const [consumer, seller] = await Promise.all([
        historyConsumeModel.updateOne(filter, updateData),
        historySellerModel.updateOne(filter, updateData),
      ])
      

      if(!consumer.nModified) {
        return res.json({ status: 500, message: 'Failed update history consumer!' })
      }else if(!seller.nModified) {
        return res.json({ status: 500, message: 'Failed update history seller!' })
      }else if(revenue === 0) {
        return res.json({ status: 500, message: 'Failed update revenue!' })
      }

      return res.json({ status: 200, message: 'Success update status payment!' })

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

    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({ status: 400, message: 'Invalid parameter! Expecting an array in the request body.', data: updates });
    }

    const updatePromises = updates.map(async (update) => {
        const { bank_code, account_number, isEnabled } = update;
        const result = await paymentMethodModel.updateOne(
            { shop_id: shop_id, 'payments.bank_code': bank_code },
            { $set: { 
              'payments.$.account_number': account_number ,
              'payments.$.isEnabled': isEnabled ,
            } },
            { new: true }
        );
    
        return result;
    });
  
    const results = await Promise.all(updatePromises);    
      
    if (! results) {
        return res.json({ status: 404, message: 'No payment methods were updated.', data: updates });
    }

    return res.json({ status: 200, message: 'Successfully updated payment methods!', data: updates });

  } catch (error) {
    return res.json({ status: 500, message: 'Error server!', error: error.message });
  }
}

module.exports = {
    handlePaymentCallback,
    cancelOrder,
    createPayment,
    disbursementPayment,
    getAllPaymentByShop,
    updatePaymentMethod
}