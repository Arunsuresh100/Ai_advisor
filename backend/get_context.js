const mongoose = require('mongoose');
const Law = require('./models/Law');
require('dotenv').config();

async function getContext() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connected");
    
    const message = "What is the punishment for theft?";
    const relevantLaws = await Law.find({
      $or: [
        { title: { $regex: message, $options: 'i' } },
        { description: { $regex: message, $options: 'i' } }
      ]
    }).limit(3);

    console.log("CONTEXT_START");
    console.log(relevantLaws.map(law => `Section: ${law.section}\nTitle: ${law.title}\nDescription: ${law.description}`).join('\n\n'));
    console.log("CONTEXT_END");
    
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

getContext();
