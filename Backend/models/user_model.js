const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userProfileSchema = new Schema({
    full_name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    phone_number: { 
        type: String 
    },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zip_code: { type: String }
    }
}, {timestamps: true})

const UserProfile = mongoose.model('UserProfile', userProfileSchema)
module.exports = UserProfile