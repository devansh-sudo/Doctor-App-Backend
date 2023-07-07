const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const textflow = require("textflow.js");
const { validationResult} = require("express-validator");
const validateToken = require("../middleware/validateTokenHandler");
const {signToken} = require('../utils/jwt.functions');
const {
    onboardValidation,
    registerUserValidation,
    loginUserValidation,
    sendVerificationCodeValidation,
    VerifyVerificationCodeValidation
} = require('../validation/userValidation');

textflow.useKey(
    "P9Ep3DHUBB67WbSdLU4KuAfmtUBS2v48tZn5CGM0LxEh5mTWMsqNwgv6KYIme2mx"
);


const registerUser = [registerUserValidation, asyncHandler(async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({errors: errors.array()});
        }

        const {phone} = req.body;

        const userAvailable = await User.findOne({phone: phone});
        if (userAvailable) {
            res.status(400);
            throw new Error("User already registered!");
        }

        let userPayload = {
            phone: phone
        };

        // const verificationOptions = {
        //     service_name: "for doctor appointment app",
        //     seconds: 600,
        // };
        // const result = await textflow.sendVerificationSMS(phone, verificationOptions);
        //
        // console.log(" ----- sendVerificationSMS result ---", result);
        // if (result.status === 400) {
        //     return res.status(400).send({message: result.message});
        // } else if (!result.ok) {
        //     return res.status(400).send({
        //         message:
        //             "We are having trouble sending otp on your number. Please try again later.",
        //     });
        // }

        const user = await User.create(userPayload);
        if (user) {
            const response = {
                _id: user.id
            };
            res.status(201).json(response);
        } else {
            res.status(400);
            throw new Error("User data us not valid");
        }
    } catch (e) {
        console.log(e);
        return res.status(400).send({error: e.message});
    }
})];

const onboardController = [
    validateToken,
    onboardValidation,
    asyncHandler(async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({errors: errors.array()});
            }

            const {firstname, lastname, gender, dob, email} = req.body;


            const userAvailable = await User.findOne({email: email});
            if (userAvailable) {
                res.status(400);
                throw new Error("Email is already connected with other account!");
            }

            const userDoc = await User.findOneAndUpdate(
                {_id: req.user.id},
                {
                    $set: {firstname, lastname, gender, dob, email},
                },
                {new: true,}
            );

            if (!userDoc) {
                return res.status(400).send({
                    error:
                        "We are having trouble updating user info. Please try again later.",
                });
            }

            return res.status(200).send({user: userDoc});
        } catch (error) {
            // console.log(" ---- ERROR_ONBOARDING_USER ---- ", error.message);
            return res.status(400).send({error: error.message});
        }
    }),
];

const loginUser = [loginUserValidation, asyncHandler(async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({errors: errors.array()});
    }

    const {phone} = req.body;
    const user = await User.findOne({phone: phone});

    if (!user) {
        return res.status(400).send({error: "Phone number is not registered."});
    }
    const verificationOptions = {
        service_name: "for doctor appointment app",
        seconds: 600,
    };

    // const result = await textflow.sendVerificationSMS(
    //     phone,
    //     verificationOptions
    // );
    //
    // if (result.status === 400) {
    //     return res.status(400).send({message: result.message});
    // } else if (!result.ok) {
    //     return res.status(400).send({
    //         message:
    //             "We are having trouble sending otp on your number. Please try again later.",
    //     });
    // }
    return res.status(200).send({message: 'Verification Code sent successfully'});
})];

const currentUser = [
    validateToken,
    asyncHandler(async (req, res) => {
        try {

            const userDoc = await User.findOne({_id: req.user.id});

            if (!userDoc) {
                return res.status(400).send({
                    error:
                        "We are having trouble getting user info. Please try again later.",
                });
            }

            return res.status(200).send({user: userDoc});
        } catch (error) {
            // console.log(" ---- ERROR_ONBOARDING_USER ---- ", error.message);
            return res.status(400).send({error: error.message});
        }
    }),
];

//@desc Send OTP
//@route POST /api/v1/send-otp
const sendVerificationCode = [sendVerificationCodeValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({errors: errors.array()});
        }

        const {phone} = req.body;

        const userAvailable = await User.findOne({phone: phone});
        if (!userAvailable) {
            res.status(400);
            throw new Error(`${phone} is not registered user!`);
        }

        // const verificationOptions = {
        //     service_name: "for doctor appointment app",
        //     seconds: 600,
        // };
        // const result = await textflow.sendVerificationSMS(
        //     phone,
        //     verificationOptions
        // );
        // return res.status(result.status).json(result.message);

        return res.status(200).send({message: 'Verification Code sent successfully'});

    } catch (e) {
        console.log(e);
        return res.status(400).send({error: e.message});
    }
}];

const verifyCode = [VerifyVerificationCodeValidation, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({errors: errors.array()});
    }

    const {phone, code} = req.body;

    const user = await User.findOne({phone: phone});

    if (!user) {
        return res.status(400).send({error: "Phone number is not registered."});
    }

    // let result = await textflow.verifyCode(phone, code);
    // if (result.valid) {
    //     // your server logic
    //     return res.status(200).json(result.message);
    // }

    const accessToken = signToken(user.id);
    return res.status(200).json({
        user,
        accessToken });

    return res.status(result.status).json(result.message);
}];

const userProfile = async (req, res, next) => {
    try {
        const profile = await User.findOne({user: req.body.userId});

        if (profile) {
            return sendResponse(res, profile);
        } else {
            const userProfile = await User.findOne({_id: req.body.userId});

            if (!userProfile) {
                return sendError(res, "User not found");
            }

            const newProfile = new User({
                user: userProfile._id,
                firstName: userProfile.firstName,
                lastName: userProfile.lastName,
                userName: userProfile.username,
                phone: userProfile.phone,
                country: userProfile.country,
                email: userProfile.email,
                gender: userProfile.gender,
                dob: userProfile.dob,
            });

            const savedProfile = await newProfile.save();
            return sendResponse(res, savedProfile);
        }
    } catch (error) {
        global.logger.error(error);
        sendError(res, error.message);
    }
};

module.exports = {
    registerUser,
    loginUser,
    currentUser,
    sendVerificationCode,
    verifyCode,
    userProfile,
    onboardController,
};
