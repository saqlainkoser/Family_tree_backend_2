const express = require('express');
const router = express.Router();
const { 
    addMember, 
    updateMember, 
    deleteMember, 
    getMember, 
    getAllMembers,
    addRelationship,
    updateRelationship,
    deleteRelationship
} = require('../controllers/treeController');
const { uploadImage, getImage } = require('../controllers/uploadImageController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Member management routes
router.post('/members', addMember);
router.get('/members', getAllMembers);
router.get('/members/:id', getMember);
router.put('/members/:id', updateMember);
router.delete('/members/:id', deleteMember);

// Relationship management routes
router.post('/relationships', addRelationship);
router.put('/relationships/:id', updateRelationship);
router.delete('/relationships/:id', deleteRelationship);

// Image upload routes
router.post('/upload-image', uploadImage);
router.get('/images/:filename', getImage);
module.exports = router;