const { body, check } = require('express-validator');

const registerUserValidation = [
    body("phone").trim().notEmpty().withMessage("Phone no is required").isString().isMobilePhone("en-IN")
];

const loginUserValidation = [
    body("phone").trim().notEmpty().withMessage("Phone no is required").isString().isMobilePhone("en-IN")
];

const sendVerificationCodeValidation = [
    body("phone").trim().notEmpty().withMessage("Phone no is required").isString().isMobilePhone("en-IN")
];

const VerifyVerificationCodeValidation = [
    body("phone").trim().notEmpty().withMessage("Phone no is required").isString().isMobilePhone("en-IN"),
    body("code").trim().notEmpty().withMessage("Verification Code is required").isString().withMessage("Verification Code should be a string.").escape()
];

const onboardValidation = [
    body("email").trim().notEmpty().withMessage("Email is required").isString().withMessage("Email should be a string.").escape().isEmail().withMessage("please Enter Valid Email"),
    body("firstname").trim().notEmpty().withMessage("First name is required").isString().withMessage("First name should be a string.").escape(),
    body("lastname").trim().notEmpty().withMessage("Last name is required").isString().withMessage("Last name should be a string.").escape(),
    check("gender").isIn(["male", "female", "other"]).withMessage("Invalid gender"),
    check("dob").isDate().withMessage("Invalid date")
]

module.exports = {registerUserValidation, onboardValidation, loginUserValidation, sendVerificationCodeValidation, VerifyVerificationCodeValidation};
