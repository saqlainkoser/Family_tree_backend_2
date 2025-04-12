const mongoose = require('mongoose');

const researchRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    researchType: {
        type: String,
        enum: ['genealogy', 'document', 'photo', 'location', 'custom'],
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    targetDate: {
        type: Date
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    relatedMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FamilyMember'
    }],
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    notes: [{
        content: {
            type: String,
            required: true
        },
        addedBy: {
            type: String,
            enum: ['user', 'researcher'],
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    results: {
        type: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true
});

// Index for faster queries
researchRequestSchema.index({ userId: 1, status: 1 });
researchRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ResearchRequest', researchRequestSchema); 