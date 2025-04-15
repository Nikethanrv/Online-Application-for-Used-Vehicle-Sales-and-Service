const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan')
// Since Frontend (react) and backend (express) are running on different ports
const cors = require('cors')

const user_route = require('./routes/user_route')
const car_route = require('./routes/car_route')
const message_route = require('./routes/message_route')

mongoose.connect('mongodb://localhost:27017/UsedCarsDB', {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection

db.on('error', (err) => {
    console.log(err)
})

db.once('open', () => {
    console.log('Database connection established')
})

const app = express()

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

app.use('/api/user', user_route)
app.use('/api/car', car_route)
app.use('/api/messages', message_route)