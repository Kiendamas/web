import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Helper para subir imágenes con optimización automática
export function uploadImage(filePath, folder = 'images') {
  return cloudinary.uploader.upload(filePath, {
    resource_type: 'image',
    folder,
    // Optimizaciones para reducir peso y mejorar carga
    quality: 'auto:good', // Calidad automática optimizada
    fetch_format: 'auto', // Formato automático (webp cuando sea posible)
    // Transformaciones eager para generar versiones optimizadas inmediatamente
    eager: [
      { width: 1920, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' }, // Desktop
      { width: 1024, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' }, // Tablet
      { width: 640, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' }   // Mobile
    ],
    eager_async: false, // Generar transformaciones antes de retornar
  });
}

// Helper para subir videos con optimización
export function uploadVideo(filePath, folder = 'videos') {
  return cloudinary.uploader.upload(filePath, {
    resource_type: 'video',
    folder,
    chunk_size: 6000000, // 6MB chunks
    quality: 'auto:good', // Calidad automática
    // Transformaciones para versiones optimizadas
    eager: [
      { width: 1920, crop: 'limit', quality: 'auto:good' }, // Desktop
      { width: 1024, crop: 'limit', quality: 'auto:good' }, // Tablet
      { width: 300, height: 300, crop: 'pad', audio_codec: 'none' }, // Thumbnail
      { width: 160, height: 100, crop: 'crop', gravity: 'south', audio_codec: 'none' } // Mini thumbnail
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
