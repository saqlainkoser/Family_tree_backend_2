const cloudinary = require('cloudinary').v2;
const Relationship = require('../models/Relationship');
const express = require('express');
const cors = require('cors');
//hide credentials

const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Add a new family member
exports.addMember = async (req, res) => {
    try {
        const { name, birthDate, deathDate, photo, bio, location } = req.body;
        


        const member = new FamilyMember({
            name,
            birthDate,
            deathDate,
            photo,
            bio,
            location,
            createdBy: req.user.userId
        });

        await member.save();
        res.status(201).json(member);
    } catch (error) {
        console.error('Add member error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all family members
exports.getAllMembers = async (req, res) => {
    try {
        // const members = await FamilyMember.find({ createdBy: req.user.userId });
        const members = await FamilyMember.find();
        res.json(members);
    } catch (error) {
        console.error('Get all members error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a specific family member
exports.getMember = async (req, res) => {
    try {
        const member = await FamilyMember.findOne({
            _id: req.params.id,
            createdBy: req.user.userId
        });

        if (!member) {
            return res.status(404).json({ message: 'Family member not found' });
        }

        res.json(member);
    } catch (error) {
        console.error('Get member error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a family member
exports.updateMember = async (req, res) => {
    try {
        const { name, birthDate, deathDate, photo, bio, location } = req.body;
        
        const member = await FamilyMember.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user.userId },
            { name, birthDate, deathDate, photo, bio, location },
            { new: true }
        );

        if (!member) {
            return res.status(404).json({ message: 'Family member not found' });
        }

        res.json(member);
    } catch (error) {
        console.error('Update member error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a family member
exports.deleteMember = async (req, res) => {
    try {
        const member = await FamilyMember.findOneAndDelete({
            _id: req.params.id,
            createdBy: req.user.userId
        });

        if (!member) {
            return res.status(404).json({ message: 'Family member not found' });
        }

        // Delete all relationships associated with this member
        await Relationship.deleteMany({
            $or: [
                { fromMember: req.params.id },
                { toMember: req.params.id }
            ]
        });

        res.json({ message: 'Family member deleted successfully' });
    } catch (error) {
        console.error('Delete member error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add a relationship between family members
exports.addRelationship = async (req, res) => {
    try {
        const { fromMember, toMember, relationshipType, startDate, endDate } = req.body;

        // Verify both members exist and belong to the user
        const [member1, member2] = await Promise.all([
            FamilyMember.findOne({ _id: fromMember, createdBy: req.user.userId }),
            FamilyMember.findOne({ _id: toMember, createdBy: req.user.userId })
        ]);

        if (!member1 || !member2) {
            return res.status(404).json({ message: 'One or both family members not found' });
        }

        const relationship = new Relationship({
            fromMember,
            toMember,
            relationshipType,
            startDate,
            endDate
        });

        await relationship.save();
        res.status(201).json(relationship);
    } catch (error) {
        console.error('Add relationship error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a relationship
exports.updateRelationship = async (req, res) => {
    try {
        const { relationshipType, startDate, endDate } = req.body;

        // Verify the relationship exists and belongs to the user's family members
        const relationship = await Relationship.findOne({
            _id: req.params.id,
            $or: [
                { fromMember: { $in: await FamilyMember.find({ createdBy: req.user.userId }).select('_id') } },
                { toMember: { $in: await FamilyMember.find({ createdBy: req.user.userId }).select('_id') } }
            ]
        });

        if (!relationship) {
            return res.status(404).json({ message: 'Relationship not found' });
        }

        relationship.relationshipType = relationshipType;
        relationship.startDate = startDate;
        relationship.endDate = endDate;

        await relationship.save();
        res.json(relationship);
    } catch (error) {
        console.error('Update relationship error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a relationship
exports.deleteRelationship = async (req, res) => {
    try {
        const relationship = await Relationship.findOneAndDelete({
            _id: req.params.id,
            $or: [
                { fromMember: { $in: await FamilyMember.find({ createdBy: req.user.userId }).select('_id') } },
                { toMember: { $in: await FamilyMember.find({ createdBy: req.user.userId }).select('_id') } }
            ]
        });

        if (!relationship) {
            return res.status(404).json({ message: 'Relationship not found' });
        }

        res.json({ message: 'Relationship deleted successfully' });
    } catch (error) {
        console.error('Delete relationship error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}; 


const FamilyMember = require('../models/FamilyMember');

exports.createFamilyMember = async (req, res) => {
  try {
    const newMember = new FamilyMember(req.body);
    const savedMember = await newMember.save();
    res.status(201).json(savedMember);
  } catch (err) {
    console.error('Create family member error:', err);
    res.status(400).json({ message: err.message });
  }
};