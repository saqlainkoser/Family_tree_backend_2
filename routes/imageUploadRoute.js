// File: routes/imageRoutes.js
const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const convertImage = require('../cloud_image_convert/cloud_image_converter').default;

// Use express-fileupload middleware
router.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  abortOnLimit: true,
  useTempFiles: false, // Don't create temp files
  debug: true // For debugging purposes
}));

// Define route for image upload
router.post('/upload-image', async (req, res) => {
  console.log("Check imageUploadRoute");
  try {
    // Check if files were uploaded
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const imageFile = req.files.image;
    
    // Validate file type
    if (!imageFile.mimetype.startsWith('image/')) {
      return res.status(400).json({ message: 'Not an image! Please upload an image.' });
    }
    
    // Get the image buffer
    const imageBuffer = imageFile.data;
    
    // Upload to Cloudinary
    const cloudinaryImageURL = await convertImage(imageBuffer);
    console.log(cloudinaryImageURL);
    
    res.json({
      imageUrl: cloudinaryImageURL,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Failed to upload image' });
  }
});

module.exports = router;