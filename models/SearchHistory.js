const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    query: {
        type: String,
        trim: true
    },
    filters: {
        type: mongoose.Schema.Types.Mixed
    },
    resultCount: {
        type: Number,
        required: true
    },
    searchType: {
        type: String,
        enum: ['members', 'archives', 'research_request'],
        required: true
    }
}, {
    timestamps: true
});

// Index for faster queries
searchHistorySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('SearchHistory', searchHistorySchema); 