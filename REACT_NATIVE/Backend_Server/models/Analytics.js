const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  metrics: {
    totalBookings: {
      type: Number,
      default: 0
    },
    completedBookings: {
      type: Number,
      default: 0
    },
    cancelledBookings: {
      type: Number,
      default: 0
    },
    noShows: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    },
    peakHours: [{
      hour: Number,
      count: Number
    }],
    popularServices: [{
      service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
      },
      count: Number
    }]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Analytics', analyticsSchema);
