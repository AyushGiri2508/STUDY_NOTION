const Section = require("../models/Section");
const Course = require("../models/Course");

// Create Section
exports.createSection = async (req, res) => {
  try {
    // data fetch
    const { sectionName, courseId } = req.body;

    // data validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing properties",
      });
    }

    // create section
    const newSection = await Section.create({ sectionName });

    // update course with section ObjectId
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    // return response
    return res.status(200).json({
      success: true,
      message: "Section created successfully",
      updatedCourseDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to create section",
      error: error.message,
    });
  }
};

// Update Section
exports.updateSection = async (req, res) => {
  try {
    // data input
    const { sectionName, sectionId } = req.body;

    // data validation
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Missing properties",
      });
    }

    // update data
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    // return response
    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update section",
      error: error.message,
    });
  }
};

// Delete Section
exports.deleteSection = async (req, res) => {
  try {
    // get id
    const sectionId = req.body.sectionId || req.params.sectionId || req.query.sectionId;
    console.log("=== DELETE SECTION ===");
    console.log("Received sectionId:", sectionId);

    // Remove section reference from any courses
    const courseUpdate = await Course.updateMany(
      { courseContent: sectionId },
      { $pull: { courseContent: sectionId } }
    );
    console.log("Course pull result:", courseUpdate);

    // Find section to delete its subsections
    const section = await Section.findById(sectionId);
    if (section) {
      if (section.subSection && section.subSection.length > 0) {
        const SubSection = require("../models/SubSection");
        const subSecDelete = await SubSection.deleteMany({ _id: { $in: section.subSection } });
        console.log("Deleted subsections:", subSecDelete);
      }
      // delete section
      const secDelete = await Section.findByIdAndDelete(sectionId);
      console.log("Deleted section:", secDelete);
    } else {
      console.log("Section not found in db");
    }

    // return response
    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
    });
  } catch (error) {
    console.error("Delete section error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete section",
      error: error.message,
    });
  }
};
