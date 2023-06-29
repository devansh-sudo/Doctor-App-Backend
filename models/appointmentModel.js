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
    latitude:{
        type: String,
    },
    longitude:{
        type: String,
    },
    status:{
        type: String,
        enum: appointmentStatusArray,
        required: 'Appointment Status is Required Field'
    }
});

const appointmentModel = mongoose.model("appointments", appointmentSchema);

module.exports = appointmentModel;