// Generic role middleware
exports.hasRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Unauthorized access' });
  }
  next();
};

// Specific middleware for provider routes
exports.isProvider = async (req, res, next) => {
  try {
    if (req.user.role !== 'provider') {
      return res.status(403).json({ message: 'Only providers can access this route' });
    }
    
    // Add provider info to request
    req.provider = {
      id: req.user.providerId
    };
    
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking provider role' });
  }
};

// Specific middleware for customer routes
exports.isCustomer = (req, res, next) => {
  if (req.user.role !== 'customer') {
    return res.status(403).json({ message: 'Only customers can access this route' });
  }
  next();
};