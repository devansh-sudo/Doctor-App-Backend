//BOOK APPOINTMENT
const userModel = require("../models/userModel");
const appointmentModel = require("../models/appointmentModel");
const moment = require("moment");

// const bookeAppointmnetController = async (req, res) => {
//     try {
//       req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
//       req.body.time = moment(req.body.time, "HH:mm").toISOString();
//       req.body.status = "pending";
//       const newAppointment = new appointmentModel(req.body);
//       await newAppointment.save();
//       const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
//       user.notifcation.push({
//         type: "New-appointment-request",
//         message: `A nEw Appointment Request from ${req.body.userInfo.name}`,
//         onCLickPath: "/user/appointments",
//       });
//       await user.save();
//       res.status(200).send({
//         success: true,
//         message: "Appointment Book succesfully",
//       });
//     } catch (error) {
//       console.log(error);
//       res.status(500).send({
//         success: false,
//         error,
//         message: "Error While Booking Appointment",
//       });
//     }
//   };
  
//   // booking bookingAvailabilityController
//   const bookingAvailabilityController = async (req, res) => {
//     try {
//       const date = moment(req.body.date, "DD-MM-YY").toISOString();
//       const fromTime = moment(req.body.time, "HH:mm")
//         .subtract(1, "hours")
//         .toISOString();
//       const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
//       const doctorId = req.body.doctorId;
//       const appointments = await appointmentModel.find({
//         doctorId,
//         date,
//         time: {
//           $gte: fromTime,
//           $lte: toTime,
//         },
//       });
//       if (appointments.length > 0) {
//         return res.status(200).send({
//           message: "Appointments not Availibale at this time",
//           success: true,
//         });
//       } else {
//         return res.status(200).send({
//           success: true,
//           message: "Appointments available",
//         });
//       }
//     } catch (error) {
//       console.log(error);
//       res.status(500).send({
//         success: false,
//         error,
//         message: "Error In Booking",
//       });
//     }
//   };
  
//   const userAppointmentsController = async (req, res) => {
//     try {
//       const appointments = await appointmentModel.find({
//         userId: req.body.userId,
//       });
//       res.status(200).send({
//         success: true,
//         message: "Users Appointments Fetch SUccessfully",
//         data: appointments,
//       });
//     } catch (error) {
//       console.log(error);
//       res.status(500).send({
//         success: false,
//         error,
//         message: "Error In User Appointments",
//       });
//     }
//   };
  
  module.exports = {
    bookeAppointmnetController,
    bookingAvailabilityController,
    userAppointmentsController,
  };
  