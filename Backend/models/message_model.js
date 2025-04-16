const mongoose = require('mongoose')
const Schema = mongoose.Schema

{/*
const messageSchema = new Schema({
    carId: { type: Schema.Types.ObjectId, ref: "Car", required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String },
    fileUrl: { type: String },
    fileType: { type: String }
},
{ timestamps: true }
)*/}

const messageSchema = new Schema({
    buyer_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    seller_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    car_id: { type: Schema.Types.ObjectId, ref: "Car", required: true },
    buyer_name: { type: String, required: true },
    buyer_phone: { type: String, required: true },
    buyer_email: { type: String, required: true },
    buyer_location: { type: String, required: true },
    query: { type: String, required: true },
    price_bargain_range: { type: Number, required: true },
    status: { type: String, required: true }
},
{ timestamps: true }
)
module.exports = mongoose.model("Message", messageSchema)
