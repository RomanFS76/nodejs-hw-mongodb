import cloudinary from 'cloudinary';
import { env } from './env.js';
import { unlink } from 'node:fs/promises';

const cloud_name = env('CLOUD_NAME');
const api_key = env('API_KEY');
const api_secret = env('API_SECRET');

cloudinary.v2.config({
  cloud_name,
  api_key,
  api_secret,
});

export const saveFileToCloudinary = async (file, folder) => {
  const response = await cloudinary.v2.uploader.upload(file.path, { folder });

  await unlink(file.path);

  return response.secure_url;
};
