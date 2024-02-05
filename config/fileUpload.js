import cloudinaryPackage from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from 'dotenv';

dotenv.config();
const cloudinary = cloudinaryPackage.v2; // We are using version 2 of this package

//configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLODINARY_API_KEY,
  api_secret: process.env.CLODINARY_API_SECRET_KEY,
});

//create storage engine for multer
const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpg", "png", "jpeg"],
  params:{
    folder: "Ecommerce-api",
  },
});

//initialize multer with storage engine (receive media from  frontend)
const upload = multer({ 
  storage, 
});

export default upload;