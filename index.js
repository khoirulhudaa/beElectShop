// Call all library
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const app = express()

// 3 on use start (cors, express.json(), bodyParser.urlencoded)
app.use(cors())

// Get variable environment
const portServer = process.env.PORT_SERVER_RUNNING

// Connected on database ft mongodb
mongoose.connect('mongodb+srv://dragme:HBXrSHZaJqemsDtW@cluster0.oadoa02.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('Successfully connect on database')
})
.catch((error) => {
    console.log(error)
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routers
const shopRouter = require('./src/routes/shopRouters')
const productRouter = require('./src/routes/productRouters')

app.use('/shop', shopRouter)
app.use('/product', productRouter)


// Default route
app.get('/', (req, res) => {
    res.json({message: 'Working'})
})

app.get('/test', (req, res) => {
    res.json({message: 'Testing'})
})


// Running test
app.listen(portServer,() => {
    console.log(`Running on port ${portServer}`)
})
