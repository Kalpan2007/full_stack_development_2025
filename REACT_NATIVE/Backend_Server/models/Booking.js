const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true, index: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true },
  stylistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stylist' },
  date: { type: String, required: true, index: true },
  time: { type: String, required: true },
  scheduledTime: { type: Date, required: true },
  rating: { type: mongoose.Schema.Types.ObjectId, ref: 'Rating' },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rejected', 'no-show'], 
    default: 'pending',
    index: true 
  },
  rejectionReason: { type: String },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// TTL index for old bookings (optional, e.g., delete after 90 days)
bookingSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

module.exports = mongoose.model('Booking', bookingSchema);