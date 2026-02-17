
const Law = require('../models/Law');
const Chat = require('../models/Chat');

// @desc    Get AI Advisor Response
// @route   POST /api/chat/query
// @access  Private
exports.queryAdvisor = async (req, res, next) => {
  try {
    const { message } = req.body;
    console.log('Chat Query Received:', message);

    if (!message) {
      return res.status(400).json({ success: false, message: 'Please provide a message' });
    }

    // 1. Search database for relevant legal sections (Regex fallback for low disk space)
    const relevantLaws = await Law.find({
      $or: [
        { title: { $regex: message, $options: 'i' } },
        { description: { $regex: message, $options: 'i' } },
        { keywords: { $in: [new RegExp(message, 'i')] } }
      ]
    }).limit(3);

    let aiResponse = "";

    if (relevantLaws.length > 0) {
      aiResponse = `Based on my legal database, here is some information that might help:\n\n`;
      relevantLaws.forEach(law => {
        aiResponse += `**Section ${law.section}: ${law.title}**\n${law.description}\n\n`;
      });
      aiResponse += `*Disclaimer: This is for informational purposes only. Please consult a professional lawyer for legal actions.*`;
    } else {
      aiResponse = "I couldn't find a specific legal section matching your query in my database yet. Could you please specify the topic (e.g., 'theft', 'property', or 'cyber law')? I'm continuously learning!";
    }

    // 2. Persistent Storage: Save messages to the chat session
    if (req.body.chatId) {
      const chat = await Chat.findById(req.body.chatId);
      if (chat && chat.user.toString() === req.user.id) {
        chat.messages.push({ role: 'user', text: message });
        chat.messages.push({ role: 'ai', text: aiResponse });
        await chat.save();
      }
    }

    res.status(200).json({
      success: true,
      data: aiResponse,
      sources: relevantLaws.map(l => l.section)
    });

  } catch (err) {
    res.status(500).json({ success: false, message: 'AI processing error: ' + err.message });
  }
};
// @desc    Get Chat History
// @route   GET /api/chat/history
// @access  Private
exports.getChatHistory = async (req, res) => {
  try {
    const history = await Chat.find({ user: req.user.id }).select('title createdAt').sort('-createdAt');
    res.status(200).json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create New Chat Session
// @route   POST /api/chat/new
// @access  Private
exports.createNewChat = async (req, res) => {
  try {
    const { title } = req.body;
    const newChat = await Chat.create({
      user: req.user.id,
      title: title || 'New Legal Consultation',
      messages: []
    });
    res.status(201).json({ success: true, data: newChat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get Messages for a Specific Chat
// @route   GET /api/chat/:id
// @access  Private
exports.getChatMessages = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat || chat.user.toString() !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }
    res.status(200).json({ success: true, data: chat.messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
