const express = require("express");
const router = express.Router();

// Import controllers
const {
  updateProfile,
  deleteAccount,
  getAllUserDetails,
} = require("../controllers/Profile");

// Import middleware
const { auth } = require("../middlewares/auth");

// ================= Profile Routes =================

// Route for updating profile
router.put("/updateProfile", auth, updateProfile);

// Route for deleting account
router.delete("/deleteProfile", auth, deleteAccount);

// Route for getting all user details
router.get("/getUserDetails", auth, getAllUserDetails);

module.exports = router;
