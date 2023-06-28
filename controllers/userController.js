const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const textflow = require("textflow.js");
const { body, check, validationResult } = require("express-validator");
const validateToken = require("../middleware/validateTokenHandler");
const authMiddleware = require("../middleware/authMiddleware");
textflow.useKey(
  "P9Ep3DHUBB67WbSdLU4KuAfmtUBS2v48tZn5CGM0LxEh5mTWMsqNwgv6KYIme2mx"
);

//@desc Register a user
//@route POST /api/v1/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, phone } = req.body;

  if (!email && !phone) {
    res.status(400);
    throw new Error("Either email or phone is required.");
  }
  if (email && !password.trim()) {
    res.status(400);
    throw new Error("Password is required!");
  }

  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered!");
  }

  let userPayload = {};

  if (phone) {
    userPayload.phoneNumber = phone;
  } else {
    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password: ", hashedPassword);

    userPayload = {
      email: email,
      password: hashedPassword,
    };
  }

  if (phone && !email) {
    const verificationOptions = {
      service_name: "for doctor appointment app",
      seconds: 600,
    };
    const result = await textflow.sendVerificationSMS(
      phone,
      verificationOptions
    );

    console.log(" ----- sendVerificationSMS result ---", result);
    if (result.status === 400) {
      return res.status(400).send({ message: result.message });
    } else if (!result.ok) {
      return res.status(400).send({
        message:
          "We are having trouble sending otp on your number. Please try again later.",
      });
    }
  }

  const user = await User.create(userPayload);
  console.log(`User created ${user}`);
  const response = { _id: user.id };
  if (user) {
    if (user.email) {
      response.accessToken = jwt.sign(
        {
          user: {
            id: user.id,
          },
        },
        process.env.ACCESS_TOKEN_SECERT,
        { expiresIn: "15m" }
      );
    }

    res.status(201).json(response);
  } else {
    res.status(400);
    throw new Error("User data us not valid");
  }
  res.json({ message: "Register the user" });
});

const onboardController = [
  validateToken,
  body("firstname")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isString()
    .withMessage("First name should be a string.")
    .escape(),
  body("lastname")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isString()
    .withMessage("Last name should be a string.")
    .escape(),
  check("gender")
    .isIn(["male", "female", "other"])
    .withMessage("Invalid gender"),
  check("dob").isDate().withMessage("Invalid date"),
  asyncHandler(async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
      }

      const { firstname, lastname, gender, dob } = req.body;

      const userDoc = await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          $set: { firstname, lastname, gender, dob },
        },
        {
          new: true,
        }
      );

      if (!userDoc) {
        return res.status(400).send({
          error:
            "We are having trouble updating user info. Please try again later.",
        });
      }
      delete userDoc.password;

      return res.status(200).send({ user: userDoc });
    } catch (error) {
      // console.log(" ---- ERROR_ONBOARDING_USER ---- ", error.message);
      return res.status(400).send({ error: error.message });
    }
  }),
];

//@desc Login user
//@route POST /api/v1/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password, phone } = req.body;

  if (!email && !phone) {
    return res
      .status(400)
      .send({ error: "Either email or phone is required." });
  }
  if (email && !password.trim()) {
    return res.status(400).send({ error: "Password is required!" });
  }

  if (phone) {
    const user = await User.findOne({ phoneNumber: phone });

    if (!user) {
      return res.status(400).send({ error: "Phone number is not registered." });
    }
    const verificationOptions = {
      service_name: "for doctor appointment app",
      seconds: 600,
    };
    const result = await textflow.sendVerificationSMS(
      phone,
      verificationOptions
    );
    console.log(" ----- sendVerificationSMS result ---", result);
    if (result.status === 400) {
      return res.status(400).send({ message: result.message });
    } else if (!result.ok) {
      return res.status(400).send({
        message:
          "We are having trouble sending otp on your number. Please try again later.",
      });
    }
  } else {
    const user = await User.findOne({ email });
    //compare password with hashedpassword
    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = jwt.sign(
        {
          user: {
            id: user.id,
          },
        },
        process.env.ACCESS_TOKEN_SECERT,
        { expiresIn: "15m" }
      );
      console.log(`Logged In : ${user}`);
      return res.status(200).json({ accessToken });
    } else {
      return res.status(401).send({ error: "email or password is not valid" });
    }
  }
});

//@desc Current user info
//@route POST /api/v1/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(req.user);
});

//@desc Send OTP
//@route POST /api/v1/send-otp
const sendVerificationCode = async (req, res) => {
  const { phoneNumber } = req.body;
  const verificationOptions = {
    service_name: "for doctor appointment app",
    seconds: 600,
  };
  const result = await textflow.sendVerificationSMS(
    phoneNumber,
    verificationOptions
  );
  return res.status(result.status).json(result.message);
};

const verifyCode = async (req, res) => {
  const { phoneNumber, code } = req.body;

  let result = await textflow.verifyCode(phoneNumber, code);
  if (result.valid) {
    // your server logic
    return res.status(200).json(result.message);
  }
  return res.status(result.status).json(result.message);
};

const userProfile = async (req, res, next) => {
  try {
    const profile = await User.findOne({ user: req.body.userId });

    if (profile) {
      return sendResponse(res, profile);
    } else {
      const userProfile = await User.findOne({ _id: req.body.userId });

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
