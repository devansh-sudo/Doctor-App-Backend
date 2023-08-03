const { body, check } = require('express-validator');

const registerAdminValidation = [
    body("phone").trim().notEmpty().withMessage("Phone no is required").isString().isMobilePhone("en-IN")
];

const loginAdminValidation = [
    body("email").trim().notEmpty().withMessage("Email is required").isString().withMessage("Email should be a string.").escape().isEmail().withMessage("please Enter Valid Email"),
    body("password").trim().notEmpty().withMessage("Password is required").isString().withMessage("Password should be a string.").escape(),

];

const appoinmentCancelValidation = [
body("_id").trim().notEmpty().withMessage("appoinment id is required").isString().withMessage("appoinment id should be a object id.").escape(),
];

const appoinmentShow = [
    body("_id").trim().notEmpty().withMessage("appoinment id is required").isString().withMessage("appoinment id should be a object id.").escape(),
    ];

const appointmentEditValidation = [
    body("registrationFees").trim().notEmpty().withMessage("RegistrationFees is required").isString().withMessage("RegistrationFees should be a string.").escape(),
    body("content").trim().notEmpty().withMessage("Content is required").isString().withMessage("Content should be a string.").escape(),
]

module.exports = {registerAdminValidation , loginAdminValidation , appoinmentCancelValidation , appointmentEditValidation , appoinmentShow};
