const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Create SubSection
exports.createSubSection = async (req, res) => {
  try {
    // fetch data from req body
    const { sectionId, title, timeDuration, description } = req.body;

    // extract file/video
    const video = req.files.videoFile;

    // validation
    if (!sectionId || !title || !timeDuration || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // upload video to cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    // create a subsection
    const subSectionDetails = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });

    // update section with this subsection
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $push: {
          subSection: subSectionDetails._id,
        },
      },
      { new: true }
    ).populate("subSection");

    // return response
    return res.status(200).json({
      success: true,
      message: "Sub section created successfully",
      updatedSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// TODO: Update SubSection
exports.updateSubSection = async (req, res) => {
  try {
    const { subSectionId, title, timeDuration, description } = req.body;

    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    if (title !== undefined) subSection.title = title;
    if (timeDuration !== undefined) subSection.timeDuration = timeDuration;
    if (description !== undefined) subSection.description = description;

    if (req.files && req.files.videoFile) {
      const video = req.files.videoFile;
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      );
      subSection.videoUrl = uploadDetails.secure_url;
    }

    await subSection.save();

    return res.status(200).json({
      success: true,
      message: "Sub section updated successfully",
      data: subSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update sub section",
      error: error.message,
    });
  }
};

// TODO: Delete SubSection
exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.params;

    // remove subsection reference from section
    await Section.findByIdAndUpdate(sectionId, {
      $pull: { subSection: subSectionId },
    });

    // delete subsection
    await SubSection.findByIdAndDelete(subSectionId);

    return res.status(200).json({
      success: true,
      message: "Sub section deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete sub section",
      error: error.message,
    });
  }
};
