const mongoose = require('mongoose')
const Schema = mongoose.Schema

const carSchema = new Schema({
    id: { type: Number, unique: true },
    make: { type: String },
    model: { type: String },
    year: { type: Number },
    mileage: { type: String },
    transmission: { type: String},
    fuelType: { type: String },
    condition: { type: String },
    location: { type: String },
    price: { type: String }
}, {timestamps: true})

const Car = mongoose.model('Car', carSchema)
module.exports = Car