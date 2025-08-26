const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['Men', 'Women', 'Unisex'], required: true },
  size: { type: Number, required: true },
  location: {
    address: { type: String, required: true },
    area: { type: String, required: true, index: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  isActive: { type: Boolean, default: false },
  workingHours: {
    open: { type: String, required: true },
    close: { type: String, required: true }
  },
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
  stylists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Stylist' }],
  currentQueue: { type: mongoose.Schema.Types.ObjectId, ref: 'Queue' },
  analytics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Analytics' }],
  autoAccept: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

providerSchema.index({ 'location.area': 1 });

module.exports = mongoose.model('Provider', providerSchema);