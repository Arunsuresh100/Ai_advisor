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

async function enrichKeywords() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Enrich Murder
    await Law.updateOne(
      { section: /300/ },
      { $addToSet: { keywords: { $each: ['kill', 'killed', 'kills', 'murdered', 'slay', 'dead'] } } }
    );

    // Enrich Theft
    await Law.updateOne(
      { section: /378/ },
      { $addToSet: { keywords: { $each: ['stole', 'stolen', 'robbed', 'rob', 'take', 'took'] } } }
    );

    // Enrich Cheating
    await Law.updateOne(
      { section: /420/ },
      { $addToSet: { keywords: { $each: ['scam', 'scammed', 'fraud', 'online', 'cheated'] } } }
    );

    console.log('✅ Keywords enriched successfully.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

enrichKeywords();
