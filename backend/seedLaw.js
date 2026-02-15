
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Law = require('./models/Law');

dotenv.config();

const laws = [
  {
    section: "IPC 378",
    title: "Theft",
    description: "Whoever, intending to take dishonestly any moveable property out of the possession of any person without that person's consent, moves that property in order to such taking, is said to commit theft.",
    keywords: ["theft", "stealing", "moveable property", "dishonestly"],
    category: "Criminal"
  },
  {
    section: "IPC 300",
    title: "Murder",
    description: "Except in the cases hereinafter excepted, culpable homicide is murder, if the act by which the death is caused is done with the intention of causing death.",
    keywords: ["murder", "death", "killing", "intention"],
    category: "Criminal"
  },
  {
    section: "IT Act 66A",
    title: "Cyber Law - Punishment for sending offensive messages",
    description: "Any person who sends, by means of a computer resource or a communication device any information that is grossly offensive or has menacing character.",
    keywords: ["cyber", "online", "offensive", "social media", "internet"],
    category: "Cyber"
  },
  {
    section: "IPC 441",
    title: "Criminal Trespass",
    description: "Whoever enters into or upon property in the possession of another with intent to commit an offence or to intimidate, insult or annoy any person in possession of such property.",
    keywords: ["trespass", "property", "illegal entry", "land"],
    category: "Property"
  }
];

const seedLaws = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Clear existing
    await Law.deleteMany();
    
    // Create Indexes
    await Law.createIndexes();
    
    // Insert new
    await Law.insertMany(laws);
    
    console.log('✅ Legal Guideline Database Seeded Successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ Seeding Error:', err);
    process.exit(1);
  }
};

seedLaws();
