const express = require("express");
const router = express.Router();

// Import controllers
const {
  sendOTP,
  signUp,
  login,
  changePassword,
} = require("../controllers/Auth");

const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/ResetPassword");

// Import middleware
const { auth } = require("../middlewares/auth");

// ================= Authentication Routes =================

// Route for sending OTP to user's email
router.post("/sendotp", sendOTP);

// Route for user signup
router.post("/signup", signUp);

// Route for user login
router.post("/login", login);

// ================= Password Routes =================

// Route for changing password (requires authentication)
router.post("/changepassword", auth, changePassword);

// Route for generating reset password token
router.post("/reset-password-token", resetPasswordToken);

// Route for resetting password after verification
router.post("/reset-password", resetPassword);

module.exports = router;
