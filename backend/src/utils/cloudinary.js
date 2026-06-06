import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadOnCloudinary = async (localFilePath, isPdf = false) => {
  try {
    if (!localFilePath) return null;

    const options = isPdf
      ? {
          resource_type: "raw",
          folder: "user-pdf",
          use_filename: true,
          unique_filename: true,
          access_mode: "public",
        }
      : {
          resource_type: "auto",
          folder: "uploads",
          access_mode: "public",
        };

    const response = await cloudinary.uploader.upload(localFilePath, options);
    fs.unlinkSync(localFilePath);
    return response.url;
  } catch (error) {
    console.log("Cloudinary error:", error);
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    return null;
  }
};

export const deleteFromCloudinary = async (url) => {
  try {
    if (!url) return null;

    // Extract public_id from the URL, e.g.
    // https://res.cloudinary.com/<cloud>/image/upload/v123/uploads/myfile.jpg
    // → public_id = "uploads/myfile"
    const parts = url.split("/");
    const filename = parts.at(-1).split(".")[0]; // strip extension
    const folder = parts.at(-2);                 // e.g. "uploads"
    const publicId = `${folder}/${filename}`;

    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.log("Cloudinary delete error:", error);
    return null;
  }
};

export default uploadOnCloudinary;