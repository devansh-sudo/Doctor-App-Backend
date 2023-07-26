const express = require("express");
const {
  registerUser,
  currentUser,
  loginUser,
  sendVerificationCode,
  verifyCode,
  userProfile,
  onboardController,
    photoUpload
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/register", registerUser);
router.post("/complete-onboarding", onboardController);
router.post("/login", loginUser);
router.get("/profile/me", currentUser);

router.post('/send-code', sendVerificationCode);
router.post('/verify-code', verifyCode);
router.post('/profile', userProfile);
router.post('/photo-upload', photoUpload);

module.exports = router;
