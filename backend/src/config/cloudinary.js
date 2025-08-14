import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Helper para subir imágenes
export function uploadImage(filePath, folder = 'images') {
  return cloudinary.uploader.upload(filePath, {
    resource_type: 'image',
    folder,
  });
}

// Helper para subir videos
export function uploadVideo(filePath, folder = 'videos') {
  return cloudinary.uploader.upload(filePath, {
    resource_type: 'video',
    folder,
    chunk_size: 6000000, // 6MB chunks
    eager: [
      { width: 300, height: 300, crop: 'pad', audio_codec: 'none' }, 
      { width: 160, height: 100, crop: 'crop', gravity: 'south', audio_codec: 'none' }
    ],
    eager_async: true,
  });
}

// Helper para subir PDFs
export function uploadPDF(filePath, folder = 'pdfs') {
  return cloudinary.uploader.upload(filePath, {
    resource_type: 'raw',
    folder,
  });
}

export default cloudinary;
