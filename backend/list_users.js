
const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const listUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({}, 'name email role');
    console.log('--- User List ---');
    users.forEach(u => {
      console.log(`- ${u.name} (${u.email}) - Role: ${u.role}`);
    });

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
  }
};

listUsers();
