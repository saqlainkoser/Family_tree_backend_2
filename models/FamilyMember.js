const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const familyMemberSchema = new Schema({
  _id:{
    type: String,
    default: () => Math.floor(Math.random() * 1000000).toString(),
    unique: true // Make sure ids are unique
  },
  parentId: {
    type: String,
    default: "" // Empty string indicates root node
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: false
  },
  relationship: {
    type: String,
    required: false,
    enum: ['self', 'father', 'mother', 'spouse', 'son', 'daughter', 
           'brother', 'sister', 'grandfather', 'grandmother', 
           'uncle', 'aunt', 'cousin', 'nephew', 'niece', 'other']
  },
  gender: {
    type: String,
    required: false,
    enum: ['male', 'female', 'other']
  },
  image: String,
  dateOfBirth: Date,
  email: String,
  phone: String,
  address: String,
  // spouseId: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'FamilyMember'
  // },
  children: [{
    type: Schema.Types.ObjectId,
    ref: 'FamilyMember'
  }],
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
},{
  // Enable virtuals for toJSON and toObject
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// // Add a virtual property for id that returns _id as a string
// familyMemberSchema.virtual('id').get(function() {
//   return this._id.toString();
// });

module.exports = mongoose.model('FamilyMembersnew1', familyMemberSchema);