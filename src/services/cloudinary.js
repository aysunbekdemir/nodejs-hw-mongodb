import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const savePhotoToCloudinary = async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath);
  await fs.unlink(filePath);
  return result.secure_url;
};

export const deletePhotoFromCloudinary = async (photoUrl) => {
  const publicId = photoUrl.split('/').pop().split('.')[0];
  await cloudinary.uploader.destroy(publicId);
};
