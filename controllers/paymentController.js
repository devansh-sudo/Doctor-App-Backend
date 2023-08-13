const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const appointmentModel = require("../models/appointmentModel");
const asyncHandler = require("express-async-handler");
const Tests = require("../models/TestModel");
const User = require("../models/userModel");
const { validationResult } = require("express-validator");
const { payForAppointment } = require('../validation/payment-intent');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = [
    validateToken,
    payForAppointment,
    asyncHandler(async (req, res) => {
        try {
            const { testId } = req.body;

            if (!req?.user?.id)
                return res.status(400).send({ message: 'User not found. Please login.' });

            const userDetails = await User.findOne({ _id: req.user?.id });
            let customerId = userDetails?.secrets?.stripeCustomerId || '';

            if (!customerId) {
                const customer = await stripe.customers.create();
                customerId = customer.id;
                await User.findOneAndUpdate({ _id: req.user?.id },  { $set: { 'secrets.stripeCustomerId': customerId }})
            }

            const testDetails = await Tests.findOne({
                _id: testId
            });

            if (!testDetails) {
                return res.status(400).send({ message: "Test details not found." })
            }

            const ephemeralKey = await stripe.ephemeralKeys.create(
                { customer: customerId },
                { apiVersion: '2022-11-15' }
            );
            const paymentIntent = await stripe.paymentIntents.create({
                amount: testDetails.price,
                currency: 'inr',
                customer: customerId,
                automatic_payment_methods: {
                    enabled: true,
                },
            });


            const result = await appointmentModel.findOneAndUpdate({
                _id: req.body.appointmentId
            }, {
                $set: {
                    paymentIntent: paymentIntent.id
                }
            }, {
                new: true
            })

            return res.status(200).send({
                paymentIntent: paymentIntent.client_secret,
                ephemeralKey: ephemeralKey.secret,
                customer: customerId,
            });
        } catch (error) {
            return res.status(400).send({ error: error.message || 'Error While Booking Appointment' });
        }
    }),
];

const endpointSecret = 'whsec_7b040d3150a5d37521188b143e3bb0402d166dc93fd7b726205c4e795983db04'
const stripeWebhookController = [
    express.raw(),
    asyncHandler(async (request, response) => {
        const sig = String(request.headers['stripe-signature']);
      
        let event;
        try {
            event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
        } catch (err) {
            console.log(" >>>>>>>>>> ERROR ", err);
          response.status(400).send(`Webhook Error: ${err.message}`);
          return;
        }


        console.log(" 👉 ",  event.type, event);
        // Handle the event
        const paymentIntentId = event.data.object.payment_intent;
        switch (event.type) {
          case 'charge.succeeded':
            // Then define and call a function to handle the event payment_intent.succeeded
            await appointmentModel.findOneAndUpdate({ paymentIntent: paymentIntentId}, { $set: { status: "completed"}})
            break;
          case 'charge.failed':
            await appointmentModel.findOneAndUpdate({ paymentIntent: paymentIntentId}, { $set: { status: "failed"}})
            break;
          case 'charge.refunded':
            await appointmentModel.findOneAndUpdate({ paymentIntent: paymentIntentId}, { $set: { status: "refunded"}})
            break;
          default:
            console.log(`Unhandled event type ${event.type}`);
        }
      
        // Return a 200 response to acknowledge receipt of the event
        response.send();
      })
]

module.exports = {
    createPaymentIntent,
    stripeWebhookController
};
