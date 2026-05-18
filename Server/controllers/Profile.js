const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    // get data
    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;

    // get user id
    const id = req.user.id;

    // validation
    if (!contactNumber || !gender || !id) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // find profile
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    // update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;
    await profileDetails.save();

    // return response
    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      profileDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Display Picture (Profile Photo)
exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;

    if (!displayPicture) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    // Upload to Cloudinary
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );

    console.log("Profile image uploaded:", image.secure_url);

    // Update user's image field in DB
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    ).populate("additionalDetails");

    return res.status(200).json({
      success: true,
      message: "Image updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Update display picture error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Account
exports.deleteAccount = async (req, res) => {
  try {
    // get id
    const id = req.user.id;

    // validation
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // delete profile
    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });

    // TODO: Unenroll user from all enrolled courses

    // delete user
    await User.findByIdAndDelete({ _id: id });

    // return response
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User cannot be deleted successfully",
    });
  }
};

// Get All User Details
exports.getAllUserDetails = async (req, res) => {
  try {
    // get id
    const id = req.user.id;

    // get user details
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    // return response
    return res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
