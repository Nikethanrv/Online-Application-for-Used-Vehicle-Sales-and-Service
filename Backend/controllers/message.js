const Message = require('../models/message_model');

exports.sendMessage = async (req, res) => {
    try {
        const {
            buyer_id,
            seller_id,
            car_id,
            buyer_name,
            buyer_phone,
            buyer_email,
            buyer_location,
            query,
            price_bargain_range,
            status
        } = req.body;

        if (!buyer_id || !seller_id || !car_id || !query) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newMsg = new Message({
            buyer_id,
            seller_id,
            car_id,
            buyer_name,
            buyer_phone,
            buyer_email,
            buyer_location,
            query,
            price_bargain_range,
            status
        });
        await newMsg.save();
        res.status(200).json(newMsg);
    } catch (err) {
        res.status(500).json({ error: "Failed to send message", details: err.message });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { car_id, seller_id } = req.query;
        
        if (!car_id || !seller_id) {
            return res.status(400).json({ error: "car_id and seller_id are required" });
        }

        const messages = await Message.find({ car_id: car_id, seller_id: seller_id, status: "pending" });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch message", details: error.message });
    }
};

exports.getPendingMessages = async (req, res) => {
    try {
        const { buyer_id } = req.query

        const pendingRequests = await Message.find({buyer_id: buyer_id, status: "pending"})
        res.status(200).json(pendingRequests);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch message", details: error.message });
    }
}

exports.getAcceptedMessages = async (req, res) => {
    try {
        const { buyer_id } = req.query

        const acceptedRequests = await Message.find({buyer_id: buyer_id, status: "accepted"})
        res.status(200).json(acceptedRequests);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch message", details: error.message });
    }
}

exports.getRejectedMessages = async (req, res) => {
    try {
        const { buyer_id } = req.query

        const rejectedRequests = await Message.find({buyer_id: buyer_id, status: "rejected"})
        res.status(200).json(rejectedRequests);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch message", details: error.message });
    }
}

exports.acceptBuyer = async (req, res) => {
    try {
        const { doc_id, car_id } = req.query

        const acceptedRequest = await Message.findOneAndUpdate(
            { _id: doc_id },
            { status: "accepted" },
            { new: true }
        );
        
        await Message.updateMany(
            { car_id: car_id, status: "pending" },
            { status: "rejected" }
        );

        res.status(200).json(acceptedRequest);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch message", details: error.message });
    }
}

exports.rejectBuyer = async (req, res) => {
    try {
        const { doc_id, car_id } = req.query

        const rejectedRequest = await Message.findOneAndUpdate(
            { _id: doc_id, car_id: car_id },
            { status: "rejected" },
            { new: true }
        );

        res.status(200).json(rejectedRequest);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch message", details: error.message });
    }
}