const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, email, bio, location } = req.body;
        
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (bio) user.bio = bio;
        if (location) user.location = location;

        await user.save();
        res.json(user);
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user preferences
exports.updatePreferences = async (req, res) => {
    try {
        const { 
            emailNotifications, 
            pushNotifications, 
            researchUpdates,
            theme,
            language
        } = req.body;

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update preferences
        user.preferences = {
            ...user.preferences,
            emailNotifications,
            pushNotifications,
            researchUpdates,
            theme,
            language
        };

        await user.save();
        res.json(user.preferences);
    } catch (error) {
        console.error('Update preferences error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update subscription
exports.updateSubscription = async (req, res) => {
    try {
        const { plan, paymentMethod } = req.body;

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update subscription
        user.subscription = {
            plan,
            status: 'active',
            paymentMethod,
            updatedAt: new Date()
        };

        await user.save();
        res.json(user.subscription);
    } catch (error) {
        console.error('Update subscription error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Upload profile photo
exports.uploadPhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'profile-photos',
            width: 300,
            height: 300,
            crop: 'fill'
        });

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user's photo
        user.photo = result.secure_url;
        await user.save();

        res.json({ photo: user.photo });
    } catch (error) {
        console.error('Upload photo error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete profile photo
exports.deletePhoto = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.photo) {
            return res.status(400).json({ message: 'No photo to delete' });
        }

        // Delete from Cloudinary
        const publicId = user.photo.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`profile-photos/${publicId}`);

        // Remove photo URL from user
        user.photo = null;
        await user.save();

        res.json({ message: 'Photo deleted successfully' });
    } catch (error) {
        console.error('Delete photo error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}; 