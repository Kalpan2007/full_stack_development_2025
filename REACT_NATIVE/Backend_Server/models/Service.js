const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true, index: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
  genderTarget: { type: String, enum: ['male', 'female', 'unisex'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);