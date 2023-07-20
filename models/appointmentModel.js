const mongoose = require("mongoose");
const {appointmentStatusArray} = require('../constants/appoinmentStatus');

const appointmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    test: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tests',
        required: 'Tests is Required Field'
    },
    date: {
        type: Date,
        required: 'Appointment Date is Required Field'
    },
    time: {
        type: Number,
        required: 'Appointment Time is Required Field'
    },
    status:{
        type: String,
        enum: appointmentStatusArray,
        required: 'Appointment Status is Required Field'
    },
    cashFree: {
        type: Object
    },
    order_details: {
        cf_order_id: {type: String},
        payment_session_id: {type: String},
        order_token: {type: String},
        order_status: {type: String}
    }
});

const appointmentModel = mongoose.model("appointments", appointmentSchema);

module.exports = appointmentModel;
