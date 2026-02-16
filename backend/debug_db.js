
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const debug = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({}, { name: 1, email: 1 });
    console.log('--- Current Users in DB ---');
    users.forEach(u => {
      console.log(`ID: ${u._id} | Name: ${u.name} | Email: ${u.email}`);
    });

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

debug();
