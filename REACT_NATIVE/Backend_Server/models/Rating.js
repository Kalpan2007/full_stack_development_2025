const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
    required: true
  },
  stylist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stylist'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  feedback: String,
  serviceQuality: {
    type: Number,
    min: 1,
    max: 5
  },
  timeliness: {
    type: Number,
    min: 1,
    max: 5
  },
  cleanliness: {
    type: Number,
    min: 1,
    max: 5
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Rating', ratingSchema);
