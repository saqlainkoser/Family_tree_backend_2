const mongoose = require('mongoose');

const relationshipSchema = new mongoose.Schema({
    fromMember: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FamilyMember',
        required: true
    },
    toMember: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FamilyMember',
        required: true
    },
    relationshipType: {
        type: String,
        required: true,
        enum: ['parent', 'child', 'spouse', 'sibling', 'grandparent', 'grandchild', 'aunt', 'uncle', 'niece', 'nephew', 'cousin']
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    }
}, {
    timestamps: true
});

// Index for faster queries
relationshipSchema.index({ fromMember: 1, toMember: 1 }, { unique: true });

module.exports = mongoose.model('Relationship', relationshipSchema); 