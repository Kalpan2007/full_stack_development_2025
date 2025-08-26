const Stylist = require('../models/Stylist');
const Provider = require('../models/Provider');

// Add a new stylist
exports.addStylist = async (req, res) => {
  try {
    const { name, specialities, availability } = req.body;
    const providerId = req.provider.id; // Assuming middleware sets this

    const stylist = new Stylist({
      name,
      provider: providerId,
      specialities,
      availability
    });

    await stylist.save();
    
    // Update provider's stylists array
    await Provider.findByIdAndUpdate(providerId, {
      $push: { stylists: stylist._id }
    });

    res.status(201).json({ success: true, data: stylist });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all stylists for a provider
exports.getStylists = async (req, res) => {
  try {
    const providerId = req.provider.id;
    const stylists = await Stylist.find({ provider: providerId })
      .populate('specialities', 'name price duration');
    
    res.status(200).json({ success: true, data: stylists });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update stylist availability
exports.updateAvailability = async (req, res) => {
  try {
    const { stylistId } = req.params;
    const { availability, isAvailable } = req.body;

    const stylist = await Stylist.findById(stylistId);
    
    if (!stylist) {
      return res.status(404).json({ success: false, message: 'Stylist not found' });
    }

    if (availability) stylist.availability = availability;
    if (typeof isAvailable === 'boolean') stylist.isAvailable = isAvailable;

    await stylist.save();
    
    res.status(200).json({ success: true, data: stylist });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete stylist
exports.deleteStylist = async (req, res) => {
  try {
    const { stylistId } = req.params;
    const providerId = req.provider.id;

    await Stylist.findByIdAndDelete(stylistId);
    
    // Remove stylist from provider's stylists array
    await Provider.findByIdAndUpdate(providerId, {
      $pull: { stylists: stylistId }
    });

    res.status(200).json({ success: true, message: 'Stylist deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
