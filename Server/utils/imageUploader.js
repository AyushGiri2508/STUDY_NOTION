const cloudinary = require("cloudinary").v2;

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
  const options = { folder };
  if (height) {
    options.height = height;
  }
  if (quality) {
    options.quality = quality;
  }
  
  // Set resource_type to 'raw' for PDFs and documents to bypass default delivery restrictions
  const fileName = file.name ? file.name.toLowerCase() : "";
  const isRaw = fileName.endsWith(".pdf") || 
                fileName.endsWith(".doc") || 
                fileName.endsWith(".docx") || 
                fileName.endsWith(".zip") || 
                fileName.endsWith(".txt") ||
                fileName.endsWith(".csv");

  if (isRaw) {
    options.resource_type = "raw";
  } else {
    options.resource_type = "auto";
  }

  return await cloudinary.uploader.upload(file.tempFilePath, options);
};
