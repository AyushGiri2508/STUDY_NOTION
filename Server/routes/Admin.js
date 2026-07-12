const express = require("express");
const router = express.Router();

// Import controllers
const {
  getAdminStats,
  getAllUsers,
  getUserById,
  deleteUser,
  getAllCoursesAdmin,
  deleteCourse,
  updateCategory,
  deleteCategory,
} = require("../controllers/Admin");

// Import middleware
const { auth, isAdmin } = require("../middlewares/auth");

// ================= Admin Routes =================
// All routes require authentication + Admin role

// Platform analytics
router.get("/stats", auth, isAdmin, getAdminStats);

// User management
router.get("/users", auth, isAdmin, getAllUsers);
router.get("/users/:userId", auth, isAdmin, getUserById);
router.delete("/users/:userId", auth, isAdmin, deleteUser);

// Course management
router.get("/courses", auth, isAdmin, getAllCoursesAdmin);
router.delete("/courses/:courseId", auth, isAdmin, deleteCourse);

// Category management
router.put("/categories/:id", auth, isAdmin, updateCategory);
router.delete("/categories/:id", auth, isAdmin, deleteCategory);

module.exports = router;
