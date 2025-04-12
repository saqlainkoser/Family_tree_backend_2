const express = require('express');
const router = express.Router();
const { 
    getProfile,
    updateProfile,
    updatePreferences,
    updateSubscription,
    uploadPhoto,
    deletePhoto
} = require('../controllers/profileController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// All routes require authentication
router.use(auth);

// Profile routes
router.get('/', getProfile);
router.put('/', updateProfile);
router.put('/preferences', updatePreferences);
router.put('/subscription', updateSubscription);

// Photo management routes
router.post('/photo', upload.single('photo'), uploadPhoto);
router.delete('/photo', deletePhoto);

module.exports = router; 