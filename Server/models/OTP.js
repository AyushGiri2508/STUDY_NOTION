const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 5 * 60,
  },
});

// a function -> to send verification email
async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email from StudyNotion",
      otp
    );
    console.log("Email sent successfully", mailResponse);
  } catch (error) {
    console.log("Error occurred while sending the mail", error);
    throw error;
  }
}

OTPSchema.pre("save", async function () {
  await sendVerificationEmail(this.email, this.otp);
});

module.exports = mongoose.model("OTP", OTPSchema);
