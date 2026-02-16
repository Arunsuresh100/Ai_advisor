
const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const promoteToAdmin = async (email) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOneAndUpdate(
      { email: email },
      { role: 'admin' },
      { new: true }
    );

    if (user) {
      console.log(`Successfully promoted ${email} to admin.`);
      console.log('User details:', { name: user.name, email: user.email, role: user.role });
    } else {
      console.log(`User with email ${email} not found.`);
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
  }
};

const email = process.argv[2];
if (!email) {
  console.log('Please provide an email address: node promote_admin.js your@email.com');
  process.exit(1);
}

promoteToAdmin(email);
