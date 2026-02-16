
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');

// @desc    Send a new message
// @route   POST /api/messages
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { fullName, email, subject, message } = req.body;

    const newMessage = await Message.create({
      fullName,
      email,
      subject,
      message,
      user: req.user.id
    });

    res.status(201).json({
      success: true,
      data: newMessage
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const messages = await Message.find().sort('-createdAt').populate('user', 'name email');

    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @desc    Get all users (for Admin Dashboard)
// @route   GET /api/messages/users
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @desc    Reply to a message
// @route   POST /api/messages/:id/reply
// @access  Private/Admin
router.post('/:id/reply', protect, admin, async (req, res) => {
  try {
    const { reply } = req.body;
    let message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    message.replies.push({ text: reply });
    message.isReplied = true;
    message.userSeen = false; // Set to false when admin replies
    await message.save();

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @desc    Delete a user
// @route   DELETE /api/messages/users/:id
// @access  Private/Admin
router.delete('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting the super admin itself
    if (user.email === 'admin@gmail.com') {
      return res.status(400).json({
        success: false,
        message: 'Super Admin account cannot be deleted.'
      });
    }

    // Delete all messages associated with this user
    await Message.deleteMany({ user: req.params.id });

    // Delete the user
    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User and associated data deleted successfully'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    await message.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Message removed from system archives'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @desc    Get unread message count for user
// @route   GET /api/messages/unread-count
router.get('/unread-count', protect, async (req, res) => {
  try {
    const count = await Message.countDocuments({ user: req.user.id, userSeen: false });
    res.status(200).json({
      success: true,
      unreadCount: count
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @desc    Get user's own messages
// @route   GET /api/messages/my-messages
// @access  Private
router.get('/my-messages', protect, async (req, res) => {
  try {
    const messages = await Message.find({ user: req.user.id }).sort('-createdAt');
    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @desc    Mark message as seen by user
// @route   PUT /api/messages/:id/seen
// @access  Private
router.put('/:id/seen', protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Ensure it's the user's message
    if (message.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    message.userSeen = true;
    await message.save();

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;
