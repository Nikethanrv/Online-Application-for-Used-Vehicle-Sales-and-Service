const mongoose = require('mongoose')
const Schema = mongoose.Schema

const carSchema = new Schema({
    model_name: {
        type: String
    },
    price: {
        type: Number
    },
    mileage: {
        type: Number
    },
    specs: {
        fuel_type: { type: String },
        transmission: { type: String} 
    },
    seller_details: {
        name: { type: String },
        location: { type: String }
    }
}, {timestamps: true})

const Car = mongoose.model('Car', carSchema)
module.exports = Car