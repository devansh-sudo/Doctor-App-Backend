const { body } = require('express-validator');

const payForAppointment = [
    body('testId').notEmpty().withMessage('Test ID is required').isMongoId().withMessage('Invalid Test ID'),
    body('appointmentId').notEmpty().withMessage('Appointment ID is required').isMongoId().withMessage('Invalid Appointment ID'),
];

module.exports = {payForAppointment};