const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userProfileSchema = new Schema({
    uname: {
        type: String
    },
    pwd: {
        type: String
    }
}, {timestamps: true})

const UserProfile = mongoose.model('UserProfile', userProfileSchema)
module.exports = UserProfile