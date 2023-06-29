//BOOK APPOINTMENT
const express = require("express");
const router = express.Router();
const {bookAppointmentController, bookAppointmentList, bookedSlot} = require("../controllers/appointmentController");

// Schedule Appointment API
router.post('/schedule-appointment',bookAppointmentController);
router.get('/list',bookAppointmentList);
router.post('/booked-slot',bookedSlot);




// Get Appointments by Doctor API
// router.get('/doctor-appointments/:doctorId', async (req, res) => {
//   try {
//     const doctorId = req.params.doctorId;
//
//     // Find the doctor
//     const doctor = await Doctor.findById(doctorId);
//     if (!doctor) {
//       return res.status(404).json({ message: 'Doctor not found' });
//     }
//
//     // Find the appointments for the doctor
//     const appointments = await Appointment.find({ doctor: doctorId }).populate('user', 'firstname lastname');
//
//     res.status(200).json({ appointments });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

module.exports = router;