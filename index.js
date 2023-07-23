// Call all library
const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const app = express()


// Get variable environment
const portServer = process.env.PORT_SERVER_RUNNING
const urlMongose = process.env.URL_MONGOOSE


// Connected on database ft mongodb
mongoose.connect(urlMongose, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('Successfuly connect on database')
})
.catch((error) => {
    console.log(error)
})


// 3 on use start (cors, express.json(), bodyParser.urlencoded)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Autorization']
}))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))


// Router
app.get('/', (req, res) => {
    res.send('ok')
})

const authRouter = require('./src/routes/authRouters')
app.use('/auth', authRouter)


// Running test
app.listen(portServer,() => {
    console.log(`Running on port ${portServer}`)
})