const { body } = require('express-validator');

const scheduleAppointmentValidation = [
    body('testId').notEmpty().withMessage('Test ID is required').isMongoId().withMessage('Invalid Test ID'),
    body('date').notEmpty().withMessage('Date is required').isDate().withMessage('Invalid date format'),
    body('time').notEmpty().withMessage('Time is required').isInt().withMessage('Time must be an integer'),
    body('latitude').optional().isNumeric().withMessage('Latitude must be a numeric value'),
    body('longitude').optional().isNumeric().withMessage('Longitude must be a numeric value')
];

const bookedSlots = [
    body('date').notEmpty().withMessage('Date is required').isDate().withMessage('Invalid date format'),
]

module.exports = {scheduleAppointmentValidation, bookedSlots};