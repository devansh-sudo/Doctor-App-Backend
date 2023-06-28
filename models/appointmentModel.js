const mongoose = require("mongoose");

// const appointmentSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: String,
//       required: true,
//     },
//     doctorId: {
//       type: String,
//       required: true,
//     },
//     doctorInfo: {
//       type: String,
//       required: true,
//     },
//     userInfo: {
//       type: String,
//       required: true,
//     },
//     date: {
//       type: String,
//       required: true,
//     },
//     status: {
//       type: String,
//       required: true,
//       default: "pending",
//     },
//     time: {
//       type: String,
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

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