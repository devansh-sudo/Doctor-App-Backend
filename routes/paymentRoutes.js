const express = require("express");
const {
  createPaymentIntent,
  stripeWebhookController
} = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/create-payment-intent", authMiddleware, createPaymentIntent);
router.post('/webhook', stripeWebhookController);
module.exports = router;