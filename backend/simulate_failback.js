const Law = require('./models/Law');
const mongoose = require('mongoose');
require('dotenv').config();

async function simulateQuotaHit() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai_advisor');
    
    // Simulate query that bypasses local intent filter
    const message = "what is the procedure for a murder case";
    
    // Find relevant laws from DB (Simulating Step 1 of queryAdvisor)
    const relevantLaws = await Law.find({
      $or: [
        { title: { $regex: message, $options: 'i' } },
        { description: { $regex: message, $options: 'i' } }
      ]
    }).limit(3);

    // Simulate Step 6: Generation failure with 429
    console.log("--- Simulating AI Core 429 Error ---");
    let aiResponse = "";
    const aiErr = { message: "429 Too Many Requests" };

    if (aiErr.message.includes('429')) {
      aiResponse = `### ⚖️ Professional Legal Insights (Local Failback)\n\nMy AI Core is currently at maximum capacity for the day (Daily Quota Hit). However, I have analyzed your case using our high-speed local database:\n\n---\n\n`;
      
      if (relevantLaws.length > 0) {
        relevantLaws.forEach(law => {
          aiResponse += `**Section ${law.section}: ${law.title}**\n${law.description.substring(0, 300)}...\n\n`;
        });
        aiResponse += `\n---\n\n**Lawyer's Advice**: Based on these sections, you should consult a human attorney immediately for a procedural defense strategy. Please **wait a few minutes** for the AI to reset.`;
      } else {
        aiResponse += `I couldn't find exact matches in our local repository for this specific query. Please try rephrasing or wait for my AI Core to return online.`;
      }
    }

    console.log("Simulated Response:\n", aiResponse);
    await mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
}

simulateQuotaHit();
对比完毕。
