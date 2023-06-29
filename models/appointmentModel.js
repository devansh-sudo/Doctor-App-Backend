const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
  },
  date: Date,
  time: String,
});

const appointmentModel = mongoose.model("appointments", appointmentSchema);

module.exports = appointmentModel;