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

async function checkLaws() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const laws = await Law.find({});
    console.log(`Total laws found: ${laws.length}`);
    
    laws.forEach(l => {
      console.log(`- Section ${l.section}: ${l.title} (Keywords: ${l.keywords.join(', ')})`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkLaws();
