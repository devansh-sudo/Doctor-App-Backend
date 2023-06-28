const express = require("express");
const {
  registerUser,
  currentUser,
  loginUser,
  sendVerificationCode,
  verifyCode,
  userProfile,
  onboardController,
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/register", registerUser);
router.post("/complete-onboarding", onboardController);
router.post("/login", loginUser);
router.get("/get-started", validateToken, currentUser);

router.post('/send-code', sendVerificationCode);
router.post('/verify-code', verifyCode);
router.post('/profile', userProfile);

module.exports = router;
