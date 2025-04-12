const express = require('express');
const router = express.Router();
const { 
    searchMembers,
    searchArchives,
    requestResearch,
    getResearchStatus,
    getSearchHistory
} = require('../controllers/searchController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Search routes
router.get('/members', searchMembers);
router.get('/archives', searchArchives);
router.post('/research/request', requestResearch);
router.get('/research/status/:id', getResearchStatus);
router.get('/history', getSearchHistory);

module.exports = router; 