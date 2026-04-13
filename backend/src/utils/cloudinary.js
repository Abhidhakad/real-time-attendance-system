import { v2 as cloudinary } from 'cloudinary';
import config from '../config/index.js';
import logger from '../config/logger.js';

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret
});

export const uploadToCloudinary = async (base64Image, folder = 'attendance') => {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder,
      resource_type: 'image',
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto' }
      ]
    });
    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    logger.error(`Cloudinary upload error: ${error.message}`);
    throw new Error('Failed to upload image');
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    logger.error(`Cloudinary delete error: ${error.message}`);
  }
};

export default cloudinary;
