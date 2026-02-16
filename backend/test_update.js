
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const jwt = require('jsonwebtoken');

dotenv.config();

const test = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find a test user (demo@gmail.com)
    const user = await User.findOne({ email: 'demo@gmail.com' });
    if (!user) {
      console.log('User not found');
      process.exit(1);
    }
    console.log('Found User:', user.name, user._id);

    // Simulate the updateDetails logic
    const fieldsToUpdate = { name: 'Arun Suresh Updated' };
    const updatedUser = await User.findByIdAndUpdate(user._id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    console.log('Updated User in DB:', updatedUser.name);

    if (updatedUser.name === 'Arun Suresh Updated') {
      console.log('SUCCESS: Database updated correctly.');
    } else {
      console.log('FAILURE: Database did not update.');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

test();
