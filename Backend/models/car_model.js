const mongoose = require('mongoose')
const Schema = mongoose.Schema

const carSchema = new Schema({
    make: { type: String },
    model: { type: String },
    year: { type: String },
    mileage: { type: Number },
    transmission: { type: String},
    fuelType: { type: String },
    condition: { type: String },
    price: { type: String },
    image: { type: String },
    name: { type: String },
    phone: { type: String },
    email: { type: String },
    location: { type: String },
    seller_id: { type: String }
}, {timestamps: true})

const Car = mongoose.model('Car', carSchema)
module.exports = Car