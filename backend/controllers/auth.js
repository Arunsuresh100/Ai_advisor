
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error('--- REGISTRATION ERROR DEBUG ---');
    console.error('Error Code:', err.code);
    console.error('Error Name:', err.name);
    console.error('Error Message:', err.message);
    
    let message = 'Registration failed';
    
    // Most robust check for MongoDB duplicate key error
    const errStr = JSON.stringify(err) || String(err);
    const isDuplicateError = 
      err.code === 11000 || 
      err.code === '11000' || 
      errStr.includes('11000') || 
      (err.message && err.message.includes('11000')) ||
      (err.message && err.message.toLowerCase().includes('duplicate key'));

    if (isDuplicateError) {
      message = 'Email already Exist';
    } else if (err.name === 'ValidationError') {
      message = Object.values(err.errors).map(val => val.message)[0];
    } else {
      message = err.message || 'An unexpected error occurred';
    }
    
    res.status(400).json({ success: false, message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error('--- LOGIN ERROR DEBUG ---');
    console.error('Error Code:', err.code);
    console.error('Error Message:', err.message);
    
    let message = 'Login failed';
    
    // Robust check for duplicate email error
    const errStr = JSON.stringify(err) || String(err);
    const isDuplicateError = 
      err.code === 11000 || 
      err.code === '11000' || 
      errStr.includes('11000') || 
      (err.message && err.message.includes('11000')) ||
      (err.message && err.message.toLowerCase().includes('duplicate key'));

    if (isDuplicateError) {
      message = 'Email already Exist';
    } else if (err.name === 'ValidationError') {
      message = Object.values(err.errors).map(val => val.message)[0];
    } else {
      message = err.message || 'An unexpected error occurred';
    }
    
    res.status(400).json({ success: false, message });
  }
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;

    await user.save();

    res.status(200).json({
      success: true,
      _debug: "v2_standardized",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Update Details Error:', err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    // Check if new password is same as old
    if (await user.matchPassword(req.body.newPassword)) {
      return res.status(400).json({ success: false, message: 'New password cannot be the same as the current password' });
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });

  res
    .status(statusCode)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
};
