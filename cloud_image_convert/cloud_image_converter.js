// File: cloud_image_convert/cloud_image_converter.js
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import streamifier from 'streamifier';

dotenv.config();

const convertImage = async (buffer) => {
    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    
    // Create a promise that will be resolved with the upload result
    return new Promise((resolve, reject) => {
        // Create a Cloudinary upload stream
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "familyTree",
                public_id: `${Math.random().toString(36).substring(2, 10)}`,
            },
            (error, result) => {
                if (error) {
                    console.log("Upload error:", error);
                    reject(error);
                    return;
                }
                
                console.log("Upload Result:", result);
                
                // Optimize delivery by resizing and applying auto-format and auto-quality
                const optimizeUrl = cloudinary.url(result.public_id, {
                    fetch_format: 'auto',
                    quality: 'auto'
                });
                
                console.log("Optimize URL:", optimizeUrl);
                
                // Transform the image: auto-crop to square aspect_ratio
                const autoCropUrl = cloudinary.url(result.public_id, {
                    crop: 'auto',
                    gravity: 'auto',
                    width: 500,
                    height: 500,
                });
                
                console.log("Auto Crop URL:", autoCropUrl);
                
                resolve(autoCropUrl);
            }
        );
        
        // Convert buffer to stream and pipe it to the upload stream
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

export default convertImage;