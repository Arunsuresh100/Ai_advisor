
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin' && req.user.email === 'admin@gmail.com') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Authorized Super Admin only.'
    });
  }
};

module.exports = admin;
