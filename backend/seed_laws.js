const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Law = require('./models/Law');

dotenv.config();

const laws = [
  {
    section: "IPC 378",
    title: "Theft",
    description: "Whoever, intending to take dishonestly any moveable property out of the possession of any person without that person's consent, moves that property in order to such taking, is said to commit theft.",
    keywords: ["theft", "stealing", "moveable property", "dishonesty"],
    category: "Criminal"
  },
  {
    section: "IPC 300",
    title: "Murder",
    description: "Except in the cases hereinafter excepted, culpable homicide is murder, if the act by which the death is caused is done with the intention of causing death, or with the intention of causing such bodily injury as the offender knows to be likely to cause the death of the person to whom the harm is caused.",
    keywords: ["murder", "death", "culpable homicide", "killing"],
    category: "Criminal"
  },
  {
    section: "IPC 304A",
    title: "Causing death by negligence",
    description: "Whoever causes the death of any person by doing any rash or negligent act not amounting to culpable homicide, shall be punished with imprisonment of either description for a term which may extend to two years, or with fine, or with both.",
    keywords: ["negligence", "accident", "death", "rash act"],
    category: "Criminal"
  },
  {
    section: "IPC 498A",
    title: "Husband or relative of husband of a woman subjecting her to cruelty",
    description: "Whoever, being the husband or the relative of the husband of a woman, subjects such woman to cruelty shall be punished with imprisonment for a term which may extend to three years and shall also be liable to fine.",
    keywords: ["cruelty", "harassment", "dowry", "domestic violence"],
    category: "Criminal"
  },
  {
    section: "IPC 403",
    title: "Dishonest misappropriation of property",
    description: "Whoever dishonestly misappropriates or converts to his own use any moveable property, shall be punished with imprisonment of either description for a term which may extend to two years, or with fine, or with both.",
    keywords: ["property", "misappropriation", "dishonesty"],
    category: "Property"
  },
  {
    section: "IT Act 66A",
    title: "Punishment for sending offensive messages",
    description: "Any person who sends, by means of a computer resource or a communication device any information that is grossly offensive or has menacing character; or any information which he knows to be false...",
    keywords: ["cyber crime", "offensive messages", "internet", "social media"],
    category: "Cyber"
  },
  {
    section: "IPC 420",
    title: "Cheating and dishonestly inducing delivery of property",
    description: "Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, or anything which is signed or sealed, and which is capable of being converted into a valuable security, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.",
    keywords: ["cheating", "fraud", "scam", "deception"],
    category: "Criminal"
  }
];

const seedLaws = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Clear existing laws
    await Law.deleteMany();
    console.log('🗑️ Existing laws cleared');

    // Insert new laws
    await Law.insertMany(laws);
    console.log(`✅ successfully seeded ${laws.length} laws`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding laws:', err.message);
    process.exit(1);
  }
};

seedLaws();
