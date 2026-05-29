const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Create Course handler function
exports.createCourse = async (req, res) => {
  try {
    console.log("=== CREATE COURSE REQUEST ===");
    console.log("Body fields:", Object.keys(req.body));
    console.log("Files:", req.files ? Object.keys(req.files) : "NO FILES");

    // fetch data
    const { courseName, courseDescription, whatYouWillLearn, price, tag, category, instructions, status } =
      req.body;

    // get thumbnail
    const thumbnail = req.files?.thumbnailImage;

    // The category ID can come as 'tag' or 'category' from the frontend
    const categoryId = category || tag;

    console.log("Category ID received:", categoryId);

    // validation
    if (!courseName || !courseDescription || !whatYouWillLearn || !price || !categoryId) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${[
          !courseName && 'courseName',
          !courseDescription && 'courseDescription',
          !whatYouWillLearn && 'whatYouWillLearn',
          !price && 'price',
          !categoryId && 'category',
        ].filter(Boolean).join(', ')}`,
      });
    }

    if (!thumbnail) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail image is required",
      });
    }

    // Validate that categoryId is a valid MongoDB ObjectId
    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID format. Please re-select a category.",
      });
    }

    // check for instructor
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor details not found",
      });
    }

    // check given category is valid or not
    const categoryDetails = await Category.findById(categoryId);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category not found in database. Please run category seeder or select a valid category.",
      });
    }

    console.log("Uploading thumbnail to Cloudinary...");

    // upload image to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    console.log("Thumbnail uploaded:", thumbnailImage.secure_url);

    // create an entry for new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag: Array.isArray(tag) ? tag : [categoryDetails.name],
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      instructions: instructions ? (Array.isArray(instructions) ? instructions : [instructions]) : [],
      status: status || "Draft",
    });

    // add new course to the user schema of instructor
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    // update the category schema
    await Category.findByIdAndUpdate(
      categoryDetails._id,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    console.log("✅ Course created successfully:", newCourse._id);

    // return response
    return res.status(200).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.error("❌ Create course error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create course",
      error: error.message,
    });
  }
};


// Get All Courses handler function
exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();

    return res.status(200).json({
      success: true,
      message: "Data for all courses fetched successfully",
      data: allCourses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot fetch course data",
      error: error.message,
    });
  }
};

// Get Course Details
exports.getCourseDetails = async (req, res) => {
  try {
    // get id
    const { courseId } = req.body;

    // find course details
    const courseDetails = await Course.find({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate({
        path: "ratingAndReviews",
        populate: {
          path: "user",
          select: "firstName lastName",
        },
      })
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    // validation
    if (!courseDetails || courseDetails.length === 0) {
      return res.status(400).json({
        success: false,
        message: `Could not find the course with ${courseId}`,
      });
    }

    // Determine if requesting user is authorized to view video content
    let isAuthorized = false;
    try {
      const token =
        req.header("Authorization")?.replace("Bearer ", "") ||
        req.cookies?.token;
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const course = Array.isArray(courseDetails) ? courseDetails[0] : courseDetails;
        if (course) {
          const isEnrolled = (course.studentEnrolled || []).some(
            (s) => s.toString() === userId.toString()
          );
          const isInstructor =
            course.instructor?._id?.toString() === userId.toString();
          isAuthorized = isEnrolled || isInstructor;
        }
      }
    } catch (_) {
      // Token invalid or missing — user is not authorized for content
    }

    // If not authorized, strip videoUrl from all subSections
    let responseData = courseDetails;
    if (!isAuthorized) {
      responseData = JSON.parse(JSON.stringify(courseDetails));
      const courses = Array.isArray(responseData) ? responseData : [responseData];
      courses.forEach((c) => {
        (c.courseContent || []).forEach((section) => {
          (section.subSection || []).forEach((sub) => {
            sub.videoUrl = undefined;
          });
        });
      });
    }

    // return response
    return res.status(200).json({
      success: true,
      message: "Course details fetched successfully",
      data: responseData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
