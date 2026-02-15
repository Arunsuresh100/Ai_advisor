
const mongoose = require('mongoose');

const LawSchema = new mongoose.Schema({
  section: {
    type: String,
    required: [true, 'Please add a section number or name'],
    unique: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  keywords: [String],
  category: {
    type: String,
    enum: ['Criminal', 'Civil', 'Property', 'Cyber', 'Tax', 'General'],
    default: 'General'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for full-text search
LawSchema.index({ title: 'text', description: 'text', keywords: 'text' });

module.exports = mongoose.model('Law', LawSchema);
