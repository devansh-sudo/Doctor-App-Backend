//BOOK APPOINTMENT
const appointmentModel = require("../models/appointmentModel");
const validateToken = require("../middleware/validateTokenHandler");
const asyncHandler = require("express-async-handler");
const {scheduleAppointmentValidation, bookedSlots} = require('../validation/appoinmentValidation');
const {validationResult} = require("express-validator");
const {appointmentStatus} = require('../constants/appoinmentStatus');

const bookAppointmentController = [
    validateToken, scheduleAppointmentValidation,
    asyncHandler(async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({errors: errors.array()});
            }

            const {testId, date, time} = req.body;

            const isAlreadyScheduled= await appointmentModel.findOne({
                date: { $eq: new Date(date) },
                time: { $eq: time },
                user: req.user.id
            });
            console.log(isAlreadyScheduled);
            if(isAlreadyScheduled){
                return res.status(400).send({error: "This Time slot is already scheduled by you. Please select other Time slot.",});
            }

            const appointmentObj = {
                user: req.user.id,
                test: testId,
                date: date,
                time: time,
                status: appointmentStatus.pending
            }

            const createAppointment = await appointmentModel.create(appointmentObj);

            if (!createAppointment) {
                return res.status(400).send({error: "We are having trouble schedule a Appointment. Please try again later.",});
            }

            return res.status(200).send({appointment: createAppointment});
        } catch (error) {
            return res.status(400).send({error: error.message || 'Error While Booking Appointment'});
        }
    }),
];

const bookAppointmentList = [
    validateToken,
    asyncHandler(async (req, res) => {
        try {
            const list= await appointmentModel.find({user: req.user.id}).populate('test');

            return res.status(200).send({appointment: list});
        } catch (error) {
            return res.status(400).send({error: error.message || 'Error While getting Appointment List'});
        }
    }),
];

const bookedSlot = [
    validateToken,bookedSlots,
    asyncHandler(async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({errors: errors.array()});
            }
            const {date} = req.body;
            console.log(new Date(date))
            const slots= await appointmentModel.find({date: { $eq: new Date(date) }, user: req.user.id}, {
                time: 1
            });
            return res.status(200).send({bookedSlot: slots});
        } catch (error) {
            return res.status(400).send({error: error.message || 'Error While getting Appointment List'});
        }
    }),
];

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
    bookAppointmentController,
    bookAppointmentList,
    bookedSlot
};
  