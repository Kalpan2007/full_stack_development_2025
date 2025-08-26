const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  gender: { 
    type: String, 
    enum: ['male', 'female', 'other'] 
  },
  role: { 
    type: String, 
    enum: ['customer', 'provider', 'admin'], 
    default: 'customer'
  },
  phone: { 
    type: String,
    sparse: true
  },
  profileImage: { 
    type: String 
  },
  deviceToken: { 
    type: String,
    sparse: true
  },
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
    sparse: true
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, { 
  timestamps: true 
});

module.exports = mongoose.model('User', userSchema);