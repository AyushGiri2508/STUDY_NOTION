const express = require("express");
const router = express.Router();

// Import controllers
const {
  capturePayment,
  verifySignature,
} = require("../controllers/Payment");

// Import middleware
const { auth, isStudent } = require("../middlewares/auth");

// ================= Payment Routes =================

// Capture payment
router.post("/capturePayment", auth, isStudent, capturePayment);

// Verify signature
router.post("/verifySignature", verifySignature);

module.exports = router;
