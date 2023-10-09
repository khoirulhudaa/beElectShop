// Call all library
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const app = express()
const path = require('path')

// 3 on use start (cors, express.json(), bodyParser.urlencoded)
app.use(cors())

// Get variable environment
const portServer = process.env.PORT_SERVER_RUNNING

// Connected on database ft mongodb
mongoose.connect('mongodb+srv://muhammadkhoirulhuda111:2sGS966OIFyxC2tX@cluster0.vv8acqa.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('Successfully connect on database')
})
.catch((error) => {
    console.log(error)
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

// Routers
const checkToken = require('./src/middlewares/verifyToken')
const shopRouter = require('./src/routes/shopRouters')
const productRouter = require('./src/routes/productRouters')
const accountRouter = require('./src/routes/accountRouters')
const historyRouter = require('./src/routes/historyRouters')

app.use('/account', accountRouter)
app.use('/shop', checkToken, shopRouter)
app.use('/product', checkToken, productRouter)
app.use('/history', checkToken, historyRouter)

app.get('/test', (req, res) => {
    res.send('test success!')   
})

// Running test
app.listen(portServer,() => {
    console.log(`Running on port ${portServer}`)
})
