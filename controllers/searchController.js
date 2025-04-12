const FamilyMember = require('../models/FamilyMember');
const SearchHistory = require('../models/SearchHistory');
const ResearchRequest = require('../models/ResearchRequest');

// Search family members
exports.searchMembers = async (req, res) => {
    try {
        const { query, filters } = req.query;
        const searchQuery = { createdBy: req.user.userId };

        // Add search criteria based on query
        if (query) {
            searchQuery.$or = [
                { name: { $regex: query, $options: 'i' } },
                { bio: { $regex: query, $options: 'i' } },
                { location: { $regex: query, $options: 'i' } }
            ];
        }

        // Add filters
        if (filters) {
            const filterObj = JSON.parse(filters);
            Object.keys(filterObj).forEach(key => {
                if (filterObj[key]) {
                    searchQuery[key] = filterObj[key];
                }
            });
        }

        const members = await FamilyMember.find(searchQuery)
            .sort({ createdAt: -1 });

        // Save search to history
        await SearchHistory.create({
            userId: req.user.userId,
            query,
            filters,
            resultCount: members.length,
            searchType: 'members'
        });

        res.json(members);
    } catch (error) {
        console.error('Search members error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Search archives
exports.searchArchives = async (req, res) => {
    try {
        const { query, dateRange, location } = req.query;
        
        // This is a placeholder for archive search functionality
        // In a real application, this would integrate with actual archive databases
        const archiveResults = {
            query,
            dateRange,
            location,
            results: []
        };

        // Save search to history
        await SearchHistory.create({
            userId: req.user.userId,
            query,
            filters: { dateRange, location },
            resultCount: 0,
            searchType: 'archives'
        });

        res.json(archiveResults);
    } catch (error) {
        console.error('Search archives error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Request research service
exports.requestResearch = async (req, res) => {
    try {
        const { 
            researchType, 
            description, 
            targetDate, 
            priority,
            relatedMembers 
        } = req.body;

        const request = new ResearchRequest({
            userId: req.user.userId,
            researchType,
            description,
            targetDate,
            priority,
            relatedMembers,
            status: 'pending'
        });

        await request.save();

        // Save to search history
        await SearchHistory.create({
            userId: req.user.userId,
            query: description,
            filters: { researchType, priority },
            resultCount: 0,
            searchType: 'research_request'
        });

        res.status(201).json(request);
    } catch (error) {
        console.error('Request research error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get research request status
exports.getResearchStatus = async (req, res) => {
    try {
        const request = await ResearchRequest.findOne({
            _id: req.params.id,
            userId: req.user.userId
        });

        if (!request) {
            return res.status(404).json({ message: 'Research request not found' });
        }

        res.json(request);
    } catch (error) {
        console.error('Get research status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user's search history
exports.getSearchHistory = async (req, res) => {
    try {
        const history = await SearchHistory.find({ userId: req.user.userId })
            .sort({ createdAt: -1 })
            .limit(50);

        res.json(history);
    } catch (error) {
        console.error('Get search history error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}; 