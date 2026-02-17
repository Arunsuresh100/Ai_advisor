const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title for the chat'],
    trim: true
  },
  messages: [
    {
      role: {
        type: String,
        enum: ['user', 'ai'],
        required: true
      },
      text: {
        type: String,
        required: true
      },
      attachment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Chat', ChatSchema);
