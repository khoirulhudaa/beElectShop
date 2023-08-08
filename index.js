// Call all library
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const app = express()
const bodyParser = require('body-parser');

// 3 on use start (cors, express.json(), bodyParser.urlencoded)
app.use(cors())

// Get variable environment
const portServer = process.env.PORT_SERVER_RUNNING
// const urlMongoose = process.env.URL_MONGOOSE

// Connected on database ft mongodb
mongoose.connect('mongodb+srv://dragme:HBXrSHZaJqemsDtW@cluster0.oadoa02.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('Successfully connect on database')
})
.catch((error) => {
    console.log(error)
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routers
const shopRouter = require('./src/routes/shopRouters')

app.use('/shop', shopRouter)

// Default route
app.get('/', (req, res) => {
    console.log('ok')
})

// Running test
app.listen(portServer,() => {
    console.log(`Running on port ${portServer}`)
})