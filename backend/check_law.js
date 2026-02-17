const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Law = require('./models/Law');

dotenv.config();

const checkCount = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const count = await Law.countDocuments();
    console.log('COUNT:' + count);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkCount();
