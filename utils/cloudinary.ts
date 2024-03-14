import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "ddruqkbvb",
  api_key: "338895533385715", // Ensure API key is enclosed in quotes as a string
  api_secret: "MvKqZby5Ull7GjINlbYY7fewsI8",
});

export const cloudinaryUploadImage = async (fileUpload: any) => {
  try {
    const data = await cloudinary.uploader.upload(fileUpload, {
      resource_type: "auto",
    });
    return { url: data.secure_url };
  } catch (error) {
    return error;
  }
};
