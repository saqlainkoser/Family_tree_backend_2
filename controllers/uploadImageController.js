const multer = require('multer');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
require('dotenv').config();

const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Initialize GridFS
let gfs;
const conn = mongoose.connection;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('images');
});

// Configure multer storage
const storage = new multer.memoryStorage();
const upload = multer({ storage });

module.exports = {
    uploadImage: async (req, res) => {
        console.log("Check");
        console.log(process.env.CLOUDINARY_CLOUD_NAME);
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No image file provided' });
            }
            l

            const uploadResult = await cloudinary.uploader
                   .upload(
                       req.file, {
                        folder: "familyTree",
                        public_id: req.file.filename,
                       }
                   )
                   .catch((error) => {
                       console.log(error);
                   });
            
            console.log(uploadResult);

            // Optimize delivery by resizing and applying auto-format and auto-quality
                const optimizeUrl = cloudinary.url('kitty', {
                    fetch_format: 'auto',
                    quality: 'auto'
                });
                
                console.log(optimizeUrl);

            const autoCropUrl = cloudinary.url('kitty', {
                        crop: 'auto',
                        gravity: 'auto',
                        width: 500,
                        height: 500,
                    });
                console.log(autoCropUrl); 
            
            // Return URL that can be used to retrieve the image
            res.json({
                imageUrl: optimizeUrl
            });

        } catch (error) {
            console.error('Error uploading image:', error);
            res.status(500).json({ message: 'Error uploading image' });
        }
    },
    getImage: async (req, res) => {
        try {
            const { filename } = req.params;
            
            // Get file metadata
            const file = await gfs.files.findOne({ filename });
            if (!file) {
                return res.status(404).json({ message: 'File not found' });
            }

            // Set content type
            res.set('Content-Type', file.contentType);
            
            // Create and send read stream
            const readstream = gfs.createReadStream({ filename });
            readstream.pipe(res);
        } catch (error) {
            console.error('Error getting image:', error);
            res.status(500).json({ message: 'Error retrieving image' });
        }
    }
};