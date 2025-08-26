const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const User = require('../models/User');
const Provider = require('../models/Provider');
const { sendPushNotification } = require('../utils/notificationUtils');

exports.requestBooking = async (req, res) => {
  try {
    const { providerId, serviceId, slotId, date, time } = req.body;
    
    const slot = await Slot.findById(slotId);
    if (!slot || slot.status !== 'available') {
      return res.status(400).json({ message: 'Slot not available' });
    }

    const booking = new Booking({
      userId: req.user._id,
      providerId,
      serviceId,
      slotId,
      date,
      time,
      status: 'pending'
    });

    await booking.save();
    await Slot.findByIdAndUpdate(slotId, { status: 'reserved' });

    // Notify salon owner of new booking request
    const provider = await Provider.findById(providerId).populate('ownerId');
    if (provider.ownerId.deviceToken) {
      await sendPushNotification(
        provider.ownerId.deviceToken,
        'New Booking Request',
        `A new booking request for ${date} at ${time} has been received.`,
        { bookingId: booking._id.toString() }
      );
    }

    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: 'Booking request failed' });
  }
};

exports.acceptBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: 'confirmed' },
      { new: true }
    ).populate('userId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await Slot.findByIdAndUpdate(booking.slotId, { status: 'booked' });

    // Notify customer of booking acceptance
    if (booking.userId.deviceToken) {
      await sendPushNotification(
        booking.userId.deviceToken,
        'Booking Confirmed',
        `Your booking for ${booking.date} at ${booking.time} has been confirmed.`,
        { bookingId: booking._id.toString() }
      );
    }

    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: 'Booking acceptance failed' });
  }
};

exports.rejectBooking = async (req, res) => {
  try {
    const { bookingId, rejectionReason } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: 'rejected', rejectionReason },
      { new: true }
    ).populate('userId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await Slot.findByIdAndUpdate(booking.slotId, { status: 'available' });

    // Notify customer of booking rejection
    if (booking.userId.deviceToken) {
      await sendPushNotification(
        booking.userId.deviceToken,
        'Booking Rejected',
        `Your booking for ${booking.date} at ${booking.time} was rejected. Reason: ${rejectionReason}`,
        { bookingId: booking._id.toString() }
      );
    }

    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: 'Booking rejection failed' });
  }
};

exports.getUserBookingHistory = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.id })
      .populate('providerId')
      .populate('serviceId');
    res.json(bookings);
  } catch (error) {
    res.status(400).json({ message: 'Failed to fetch booking history' });
  }
};

exports.markNoShow = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: 'no-show' },
      { new: true }
    ).populate('userId').populate('providerId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await Slot.findByIdAndUpdate(booking.slotId, { status: 'available' });

    // Notify customer of no-show
    if (booking.userId.deviceToken) {
      await sendPushNotification(
        booking.userId.deviceToken,
        'No-Show Alert',
        `You missed your booking for ${booking.date} at ${booking.time}.`,
        { bookingId: booking._id.toString() }
      );
    }

    // Notify next customer in queue (simplified logic, assumes queue is managed)
    const nextBooking = await Booking.findOne({
      providerId: booking.providerId,
      status: 'confirmed',
      date: booking.date,
    }).sort({ time: 1 }).populate('userId');

    if (nextBooking && nextBooking.userId.deviceToken) {
      await sendPushNotification(
        nextBooking.userId.deviceToken,
        'Queue Update',
        `Your appointment is next! Please arrive on time for ${nextBooking.date} at ${nextBooking.time}.`,
        { bookingId: nextBooking._id.toString() }
      );
    }

    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: 'No-show marking failed' });
  }
};