const mongoose = require('mongoose');
require('dotenv').config();

const lawSchema = new mongoose.Schema({
  section: String,
  title: String,
  description: String,
  category: String,
  keywords: [String]
});

const Law = mongoose.model('Law', lawSchema);

async function verifyRetrieval() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const message = "i killed someone";
    const stopWords = ['i', 'me', 'my', 'the', 'a', 'an', 'someone', 'somebody', 'who', 'how', 'what', 'where', 'when', 'is', 'am', 'are', 'was', 'were', 'to', 'for', 'with', 'in', 'on', 'at'];
    const keywords = message.toLowerCase()
      .split(/\s+/)
      .filter(word => !stopWords.includes(word) && word.length > 2);

    console.log(`Keywords found: ${keywords.join(', ')}`);

    const searchConditions = keywords.map(kw => ({
      $or: [
        { title: { $regex: kw, $options: 'i' } },
        { description: { $regex: kw, $options: 'i' } },
        { keywords: { $in: [new RegExp(kw, 'i')] } }
      ]
    }));

    const relevantLaws = await Law.find({ $or: searchConditions }).limit(5);

    console.log(`\nResults for "${message}":`);
    relevantLaws.forEach(l => {
      console.log(`- Section ${l.section}: ${l.title}`);
    });

    const foundMurder = relevantLaws.some(l => l.section.includes('300') || l.title.toLowerCase().includes('murder'));
    
    if (foundMurder) {
      console.log("\n✅ Success: Correct law (Murder) found using tokenized search.");
    } else {
      console.log("\n❌ Failure: Murder sections not found.");
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

verifyRetrieval();
