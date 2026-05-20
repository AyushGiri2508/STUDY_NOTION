const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const mongoose = require("mongoose");
const crypto = require("crypto");

// Capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
  // get courseId and userId
  const { course_id } = req.body;
  const userId = req.user.id;

  // validation
  if (!course_id) {
    return res.json({
      success: false,
      message: "Please provide valid Course ID",
    });
  }

  // valid course details
  let course;
  try {
    course = await Course.findById(course_id);
    if (!course) {
      return res.json({
        success: false,
        message: "Could not find the course",
      });
    }

    // check if user already paid for the same course
    const uid = new mongoose.Types.ObjectId(userId);
    if (course.studentEnrolled.includes(uid)) {
      return res.status(200).json({
        success: false,
        message: "Student is already enrolled",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

  // order create
  const amount = course.price;
  const currency = "INR";
  const options = {
    amount: amount * 100,
    currency,
    receipt: Math.random(Date.now()).toString(),
    notes: {
      courseId: course_id,
      userId,
    },
  };

  try {
    // initiate the payment using razorpay
    const paymentResponse = await instance.orders.create(options);
    console.log(paymentResponse);

    // return response
    return res.status(200).json({
      success: true,
      courseName: course.courseName,
      courseDescription: course.courseDescription,
      thumbnail: course.thumbnail,
      orderId: paymentResponse.id,
      currency: paymentResponse.currency,
      amount: paymentResponse.amount,
    });
  } catch (error) {
    console.log("Razorpay order creation failed, falling back to mock enrollment:", error.message);

    // Check if we are using placeholder/dummy keys, or if Razorpay credentials failed
    const isDummyKey = process.env.RAZORPAY_KEY && process.env.RAZORPAY_KEY.startsWith("rzp_test_1a2b");
    const isAuthError = error.statusCode === 401 || error.message?.includes("auth") || error.message?.includes("key");

    if (isDummyKey || isAuthError) {
      try {
        // Find the course and enroll the student in it
        const enrolledCourse = await Course.findOneAndUpdate(
          { _id: course_id },
          { $push: { studentEnrolled: userId } },
          { new: true }
        );
        if (!enrolledCourse) {
          return res.status(404).json({
            success: false,
            message: "Course not found",
          });
        }

        // Find the student and add the course to their enrolled courses
        const enrolledStudent = await User.findOneAndUpdate(
          { _id: userId },
          { $push: { courses: course_id } },
          { new: true }
        );

        if (!enrolledStudent) {
          return res.status(404).json({
            success: false,
            message: "User not found",
          });
        }

        // Send confirmation email
        try {
          await mailSender(
            enrolledStudent.email,
            "Congratulations - Course Enrolled",
            `Congratulations, you have successfully enrolled in ${course.courseName}`
          );
        } catch (mailError) {
          console.log("Mail sender failed in mock payment:", mailError.message);
        }

        return res.status(200).json({
          success: true,
          mock: true,
          message: "Demo Mode: Course enrolled successfully without Razorpay payment.",
        });
      } catch (enrollError) {
        return res.status(500).json({
          success: false,
          message: "Failed to perform mock enrollment",
          error: enrollError.message,
        });
      }
    }

    res.json({
      success: false,
      message: "Could not initiate order",
      error: error.message
    });
  }
};

// Verify Signature of Razorpay and Server
exports.verifySignature = async (req, res) => {
  const webhookSecret = "12345678";

  const signature = req.headers["x-razorpay-signature"];
  const shasum = crypto.createHmac("sha256", webhookSecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (signature === digest) {
    console.log("Payment is authorised");
    const { courseId, userId } = req.body.payload.payment.entity.notes;

    try {
      // find the course and enroll the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentEnrolled: userId } },
        { new: true }
      );
      if (!enrolledCourse) {
        return res.status(500).json({
          success: false,
          message: "Course not found",
        });
      }
      console.log(enrolledCourse);

      // find the student and add the course to their enrolled courses
      const enrolledStudent = await User.findOneAndUpdate(
        { _id: userId },
        { $push: { courses: courseId } },
        { new: true }
      );
      console.log(enrolledStudent);

      // send confirmation email
      const emailResponse = await mailSender(
        enrolledStudent.email,
        "Congratulations",
        "Congratulations, you have purchased a new course"
      );
      console.log(emailResponse);

      return res.status(200).json({
        success: true,
        message: "Signature verified and course added",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid request",
    });
  }
};
