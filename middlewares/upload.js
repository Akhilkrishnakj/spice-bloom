import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

console.log("✅ Upload middleware loaded!");


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'spice-bloom-products',
    allowed_formats: ['jpg', 'jpeg', 'png']
  }
});

const upload = multer({ storage });

export default upload;
