const { body, check } = require('express-validator');

const registerAdminValidation = [
    body("phone").trim().notEmpty().withMessage("Phone no is required").isString().isMobilePhone("en-IN")
];

const loginAdminValidation = [
    body("email").trim().notEmpty().withMessage("Email is required").isString().withMessage("Email should be a string.").escape().isEmail().withMessage("please Enter Valid Email"),

];

module.exports = {registerAdminValidation , loginAdminValidation};
