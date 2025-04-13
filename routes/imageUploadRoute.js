const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { default: convertImage } = require('../cloud_image_convert/cloud_image_converter');


// Define route for image upload
router.post('/upload-image', upload.single('image'), async (req, res) => {
  console.log("Check imageUploadRoute");
  try {
    // The file is already uploaded to Cloudinary via multer-storage-cloudinary
    // The result is stored in req.file
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded ' });
    }

    // Return the secure URL of the uploaded image
    const cludinaryImageURL=await convertImage(req.file.path)
    console.log(cludinaryImageURL);
    
    res.json({
      imageUrl: cludinaryImageURL,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Failed to upload image' });
  }
});


// Get image with transformations
// router.get('/images/transform/:publicId', (req, res) => {
//   try {
//     const { publicId } = req.params;
//     const { width, height, crop } = req.query;
    
//     // Build transformation options
//     const transformations = {};
//     if (width) transformations.width = parseInt(width);
//     if (height) transformations.height = parseInt(height);
//     if (crop) transformations.crop = crop;
    
//     // Generate URL with transformations
//     const imageUrl = cloudinary.url(publicId, transformations);
    
//     res.json({
//       publicId,
//       imageUrl,
//       transformations
//     });
//   } catch (error) {
//     console.error('Error generating transformed URL:', error);
//     res.status(500).json({ message: 'Failed to generate image URL' });
//   }
// });

// // Delete an image from Cloudinary
// router.delete('/images/:publicId', async (req, res) => {
//   try {
//     const { publicId } = req.params;
    
//     // Delete the image from Cloudinary
//     const result = await cloudinary.uploader.destroy(publicId);
    
//     if (result.result === 'ok') {
//       res.json({ message: 'Image deleted successfully' });
//     } else {
//       res.status(400).json({ message: 'Failed to delete image', result });
//     }
//   } catch (error) {
//     console.error('Error deleting image:', error);
//     res.status(500).json({ message: 'Error deleting image' });
//   }
// });

module.exports = router;