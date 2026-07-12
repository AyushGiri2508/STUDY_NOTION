const User = require("../models/User");
const Course = require("../models/Course");
const Category = require("../models/Category");
const Profile = require("../models/Profile");
const RatingAndReview = require("../models/RatingAndReview");
const CourseProgress = require("../models/CourseProgress");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");

// ─── Get Platform Stats (Admin Dashboard) ───
exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ accountType: "Student" });
    const totalInstructors = await User.countDocuments({ accountType: "Instructor" });
    const totalAdmins = await User.countDocuments({ accountType: "Admin" });
    const totalCourses = await Course.countDocuments();
    const totalCategories = await Category.countDocuments();

    // Total enrollments across all courses
    const enrollmentAgg = await Course.aggregate([
      { $project: { count: { $size: { $ifNull: ["$studentEnrolled", []] } } } },
      { $group: { _id: null, total: { $sum: "$count" } } },
    ]);
    const totalEnrollments = enrollmentAgg[0]?.total || 0;

    // Total revenue (sum of price × enrollments for each course)
    const revenueAgg = await Course.aggregate([
      {
        $project: {
          revenue: {
            $multiply: [
              { $ifNull: ["$price", 0] },
              { $size: { $ifNull: ["$studentEnrolled", []] } },
            ],
          },
        },
      },
      { $group: { _id: null, total: { $sum: "$revenue" } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // Recent users (last 5)
    const recentUsers = await User.find()
      .sort({ _id: -1 })
      .limit(5)
      .select("firstName lastName email accountType image");

    // Recent courses (last 5)
    const recentCourses = await Course.find()
      .sort({ _id: -1 })
      .limit(5)
      .select("courseName thumbnail price status instructor")
      .populate("instructor", "firstName lastName");

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalStudents,
        totalInstructors,
        totalAdmins,
        totalCourses,
        totalCategories,
        totalEnrollments,
        totalRevenue,
        recentUsers,
        recentCourses,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin stats",
      error: error.message,
    });
  }
};

// ─── Get All Users ───
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -token -resetPasswordExpires")
      .populate("additionalDetails")
      .populate("courses", "courseName")
      .sort({ _id: -1 });

    return res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

// ─── Get User By ID ───
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select("-password -token -resetPasswordExpires")
      .populate("additionalDetails")
      .populate({
        path: "courses",
        select: "courseName thumbnail price status studentEnrolled",
      })
      .populate("courseProgress");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user details",
      error: error.message,
    });
  }
};

// ─── Delete User (Admin) ───
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account from admin panel",
      });
    }

    // Remove user's profile
    if (user.additionalDetails) {
      await Profile.findByIdAndDelete(user.additionalDetails);
    }

    // If instructor, remove their courses from categories
    if (user.accountType === "Instructor" && user.courses?.length > 0) {
      for (const courseId of user.courses) {
        await Category.updateMany(
          { courses: courseId },
          { $pull: { courses: courseId } }
        );
      }
    }

    // Remove user from enrolled courses
    await Course.updateMany(
      { studentEnrolled: userId },
      { $pull: { studentEnrolled: userId } }
    );

    // Delete the user
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: `User ${user.firstName} ${user.lastName} deleted successfully`,
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

// ─── Get All Courses (Admin — full details) ───
exports.getAllCoursesAdmin = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("instructor", "firstName lastName email image")
      .populate("category", "name")
      .populate("ratingAndReviews")
      .sort({ _id: -1 });

    return res.status(200).json({
      success: true,
      message: "All courses fetched successfully",
      data: courses,
    });
  } catch (error) {
    console.error("Admin get all courses error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
};

// ─── Delete Course (Admin) ───
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Remove course from category
    if (course.category) {
      await Category.findByIdAndUpdate(course.category, {
        $pull: { courses: courseId },
      });
    }

    // Remove course from instructor's course list
    if (course.instructor) {
      await User.findByIdAndUpdate(course.instructor, {
        $pull: { courses: courseId },
      });
    }

    // Remove course from all enrolled students
    if (course.studentEnrolled?.length > 0) {
      await User.updateMany(
        { _id: { $in: course.studentEnrolled } },
        { $pull: { courses: courseId } }
      );
    }

    // Delete all sections and subsections
    if (course.courseContent?.length > 0) {
      for (const sectionId of course.courseContent) {
        const section = await Section.findById(sectionId);
        if (section?.subSection?.length > 0) {
          await SubSection.deleteMany({ _id: { $in: section.subSection } });
        }
        await Section.findByIdAndDelete(sectionId);
      }
    }

    // Delete ratings
    if (course.ratingAndReviews?.length > 0) {
      await RatingAndReview.deleteMany({ _id: { $in: course.ratingAndReviews } });
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: `Course "${course.courseName}" deleted successfully`,
    });
  } catch (error) {
    console.error("Delete course error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete course",
      error: error.message,
    });
  }
};

// ─── Update Category ───
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (name !== undefined) category.name = name;
    if (description !== undefined) category.description = description;
    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    console.error("Update category error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: error.message,
    });
  }
};

// ─── Delete Category ───
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Remove category reference from all associated courses
    if (category.courses?.length > 0) {
      await Course.updateMany(
        { _id: { $in: category.courses } },
        { $unset: { category: "" } }
      );
    }

    await Category.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: `Category "${category.name}" deleted successfully`,
    });
  } catch (error) {
    console.error("Delete category error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message,
    });
  }
};
