//BOOK APPOINTMENT
const express = require("express");
const router = express.Router();

const Doctor = require('../models/doctorModel');
const Appointment = require('../models/appointmentModel');
// const {
//     bookeAppointmnetController,
//     bookingAvailabilityController,
//     userAppointmentsController,
//   } = require("../controllers/appointmentController");

// const authMiddleware = require("../middleware/authMiddleware");

// router.post("/book-appointment", authMiddleware, bookeAppointmnetController);

// //Booking Avliability
// router.post(
//   "/booking-availbility",
//   authMiddleware,
//   bookingAvailabilityController
// );

// //Appointments List
// router.get("/user-appointments", authMiddleware, userAppointmentsController);

// Send Notification to User
function sendNotificationToUser(userId, notification) {
  // Implement your logic to send a notification to the user
  console.log(`Notification sent to user ${userId}: ${notification}`);
}

// Send Notification to Doctor
function sendNotificationToDoctor(doctorId, notification) {
  // Implement your logic to send a notification to the doctor
  console.log(`Notification sent to doctor ${doctorId}: ${notification}`);
}

// Schedule Appointment API
router.post('/schedule-appointment', async (req, res) => {
  try {
    const { userId, doctorId, date, time } = req.body;

    // Find the doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Implement your logic to schedule the appointment
    // Save the appointment details to your database
    const appointment = new Appointment({
      user: userId,
      doctor: doctorId,
      date,
      time,
    });

    // Save the appointment to the database
    const savedAppointment = await appointment.save();

    // Send notification to user
    sendNotificationToUser(userId, `Your appointment with Dr. ${doctor.name} is scheduled on ${date} at ${time}`);

    // Send notification to doctor
    sendNotificationToDoctor(doctorId, `You have a new appointment scheduled on ${date} at ${time}`);

    res.status(200).json({ message: 'Appointment scheduled successfully', appointment: savedAppointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get Appointments by Doctor API
router.get('/doctor-appointments/:doctorId', async (req, res) => {
  try {
    const doctorId = req.params.doctorId;

    // Find the doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Find the appointments for the doctor
    const appointments = await Appointment.find({ doctor: doctorId }).populate('user', 'firstname lastname');

    res.status(200).json({ appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;