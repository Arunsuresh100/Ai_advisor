
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const setupAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'Admin@123';

    let user = await User.findOne({ email: adminEmail });

    if (user) {
      console.log('Admin user found. Updating password and role...');
      user.password = adminPassword;
      user.role = 'admin';
      await user.save();
      console.log('Admin user updated successfully.');
    } else {
      console.log('Admin user not found. Creating new admin...');
      user = await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
      console.log('Admin user created successfully.');
    }

    console.log('Admin details:', {
      email: user.email,
      role: user.role
    });

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
  }
};

setupAdmin();
