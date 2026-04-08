const express = require("express");
const router = express.Router();

// Import controllers
const {
  createCourse,
  getAllCourses,
  getCourseDetails,
} = require("../controllers/Course");

const {
  createCategory,
  showAllCategory,
  categoryPageDetails,
} = require("../controllers/Category");

const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section");

const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/Subsection");

const {
  createRating,
  getAverageRating,
  getAllRating,
} = require("../controllers/RatingAndReview");

// Import middleware
const {
  auth,
  isInstructor,
  isStudent,
  isAdmin,
} = require("../middlewares/auth");

// ================= Course Routes =================

// Courses can only be created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse);

// Get all registered courses
router.get("/getAllCourses", getAllCourses);

// Get details for a specific course
router.post("/getCourseDetails", getCourseDetails);

// ================= Section Routes =================

// Add a section to a course
router.post("/addSection", auth, isInstructor, createSection);

// Update a section
router.post("/updateSection", auth, isInstructor, updateSection);

// Delete a section
router.post("/deleteSection", auth, isInstructor, deleteSection);

// ================= SubSection Routes =================

// Add a sub section to a section
router.post("/addSubSection", auth, isInstructor, createSubSection);

// Update a sub section
router.post("/updateSubSection", auth, isInstructor, updateSubSection);

// Delete a sub section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);

// ================= Category Routes (Admin only) =================

// Create a category
router.post("/createCategory", auth, isAdmin, createCategory);

// Get all categories
router.get("/showAllCategories", showAllCategory);

// Get category page details
router.post("/getCategoryPageDetails", categoryPageDetails);

// ================= Rating and Review Routes =================

// Create a rating
router.post("/createRating", auth, isStudent, createRating);

// Get average rating
router.get("/getAverageRating", getAverageRating);

// Get all reviews
router.get("/getReviews", getAllRating);

module.exports = router;
