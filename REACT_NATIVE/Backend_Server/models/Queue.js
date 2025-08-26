const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema({
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
    required: true
  },
  bookings: [{
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    },
    position: Number,
    estimatedStartTime: Date,
    estimatedEndTime: Date,
    status: {
      type: String,
      enum: ['waiting', 'in-service', 'completed', 'no-show'],
      default: 'waiting'
    }
  }],
  currentQueueSize: {
    type: Number,
    default: 0
  },
  averageWaitTime: {
    type: Number,  // in minutes
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Queue', queueSchema);
