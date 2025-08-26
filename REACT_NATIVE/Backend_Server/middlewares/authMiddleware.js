const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    req.user = {
      userId: user._id,
      email: user.email,
      role: user.role
    };
    next();
  } catch (error) {
    res.status(401).json({
      success: false, 
      message: 'Authentication failed'
    });
  }
};

// Role-based middleware
const isProvider = (req, res, next) => {
  if (req.user.role !== 'provider') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Provider role required.'
    });
  }
  next();
};

const isCustomer = (req, res, next) => {
  if (req.user.role !== 'customer') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Customer role required.'
    });
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.'
    });
  }
  next();
};

module.exports = {
  authMiddleware,
  isProvider,
  isCustomer,
  isAdmin
};