const express = require('express')
const router = express.Router()

const messageController = require("../controllers/message")

router.post("/send", messageController.sendMessage)
router.get("/getMessages", messageController.getMessages)
router.get("/getPendingRequests", messageController.getPendingMessages)
router.get("/getAcceptedRequests", messageController.getAcceptedMessages)
router.get("/getRejectedRequests", messageController.getRejectedMessages)
router.get("/acceptBuyer", messageController.acceptBuyer)
router.get("/rejectBuyer", messageController.rejectBuyer)

module.exports = router