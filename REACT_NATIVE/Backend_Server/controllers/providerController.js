const Provider = require('../models/Provider');

exports.registerSalon = async (req, res) => {
  try {
    const { name, type, size, location, workingHours } = req.body;
    const provider = new Provider({
      ownerId: req.user._id,
      name,
      type,
      size,
      location,
      workingHours
    });
    await provider.save();
    res.json(provider);
  } catch (error) {
    res.status(400).json({ message: 'Salon registration failed' });
  }
};

exports.toggleStatus = async (req, res) => {
  try {
    const { providerId } = req.body;
    const provider = await Provider.findById(providerId);
    if (provider.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    provider.isActive = !provider.isActive;
    await provider.save();
    res.json(provider);
  } catch (error) {
    res.status(400).json({ message: 'Status toggle failed' });
  }
};

exports.getOpenSalons = async (req, res) => {
  try {
    const { area } = req.query;
    const query = { isActive: true };
    if (area) query['location.area'] = area;
    
    const salons = await Provider.find(query).populate('services');
    res.json(salons);
  } catch (error) {
    res.status(400).json({ message: 'Failed to fetch salons' });
  }
};