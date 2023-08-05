// Call all library
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const app = express()

// 3 on use start (cors, express.json(), bodyParser.urlencoded)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}))

// Get variable environment
const portServer = process.env.PORT_SERVER_RUNNING
const urlMongoose = process.env.URL_MONGOOSE

// Connected on database ft mongodb
mongoose.connect(urlMongoose, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('Successfully connect on database')
})
.catch((error) => {
    console.log(error)
})

// Gunakan express.urlencoded() sebagai middleware untuk mengurai data x-www-form-urlencoded dari body permintaan
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routers
const authRouter = require('./src/routes/authRouters')
const productRouter = require('./src/routes/productRouters')
const shopRouter = require('./src/routes/shopRouters')
const historyRouter = require('./src/routes/historyRouters')

app.use('/auth', authRouter)
app.use('/product', productRouter)
app.use('/shop', shopRouter)
app.use('/history', historyRouter)


// Default route
app.get('/', (req, res) => {
    res.send('ok')
})


// Running test
app.listen(portServer,() => {
    console.log(`Running on port ${portServer}`)
})