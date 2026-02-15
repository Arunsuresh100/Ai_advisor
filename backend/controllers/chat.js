
const Law = require('../models/Law');

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

    res.status(200).json({
      success: true,
      data: aiResponse,
      sources: relevantLaws.map(l => l.section)
    });

  } catch (err) {
    res.status(500).json({ success: false, message: 'AI processing error: ' + err.message });
  }
};
