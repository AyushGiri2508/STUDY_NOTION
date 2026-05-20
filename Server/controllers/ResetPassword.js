const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Reset Password Token
exports.resetPasswordToken = async (req, res) => {
  try {
    // get email from req.body
    const email = req.body.email;

    // check if user exists
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Your email is not registered with us",
      });
    }

    // generate token
    const token = crypto.randomUUID();

    // update user with token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );

    // create url based on dynamic origin or env fallback
    const clientUrl = req.headers.origin || process.env.CLIENT_URL || "http://localhost:3000";
    const url = `${clientUrl}/update-password/${token}`;

    // send email to user
    await mailSender(
      email,
      "Password Reset Link",
      `Click on the link to reset your password: ${url}. This link is valid for 5 minutes.`
    );

    // send response
    return res.status(200).json({
      success: true,
      message:
        "Password reset link has been sent to your email, please check your inbox",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while sending the password reset email, please try again later",
    });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    // get token and new password from req.body
    const { password, confirmPassword, token } = req.body;

    // validate passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // get user details from db using token
    const userDetails = await User.findOne({ token: token });

    // if no entry - invalid token
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "Token is invalid",
      });
    }

    // check token expiration
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Token has expired, please regenerate your token",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // update user with new hashed password
    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );

    // send response
    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while resetting the password, please try again later",
    });
  }
};
