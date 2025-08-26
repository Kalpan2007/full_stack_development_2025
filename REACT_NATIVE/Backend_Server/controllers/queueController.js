const Queue = require('../models/Queue');
const Booking = require('../models/Booking');
const { sendNotification } = require('../utils/notificationUtils');

exports.getCurrentQueue = async (req, res) => {
  try {
    const providerId = req.provider.id;
    const queue = await Queue.findOne({ provider: providerId })
      .populate({
        path: 'bookings.booking',
        populate: [
          { path: 'user', select: 'name phone' },
          { path: 'service', select: 'name duration' }
        ]
      });
    
    if (!queue) {
      return res.status(404).json({ success: false, message: 'Queue not found' });
    }

    res.status(200).json({ success: true, data: queue });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateQueueStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const providerId = req.provider.id;

    const queue = await Queue.findOne({ provider: providerId });
    if (!queue) {
      return res.status(404).json({ success: false, message: 'Queue not found' });
    }

    const bookingIndex = queue.bookings.findIndex(b => b.booking.toString() === bookingId);
    if (bookingIndex === -1) {
      return res.status(404).json({ success: false, message: 'Booking not found in queue' });
    }

    queue.bookings[bookingIndex].status = status;

    if (status === 'in-service') {
      // Update all waiting bookings' estimated times
      const currentBooking = await Booking.findById(bookingId).populate('service');
      const serviceDuration = currentBooking.service.duration;
      
      queue.bookings.forEach((b, index) => {
        if (index > bookingIndex && b.status === 'waiting') {
          b.estimatedStartTime = new Date(queue.bookings[index - 1].estimatedEndTime);
          b.estimatedEndTime = new Date(b.estimatedStartTime.getTime() + serviceDuration * 60000);
        }
      });

      // Notify next customer if any
      if (bookingIndex < queue.bookings.length - 1) {
        const nextBooking = await Booking.findById(queue.bookings[bookingIndex + 1].booking)
          .populate('user');
        
        await sendNotification(nextBooking.user.fcmToken, {
          title: 'You\'re next in queue!',
          body: 'Please be ready for your appointment'
        });
      }
    }

    if (status === 'completed' || status === 'no-show') {
      // Remove from queue
      queue.bookings.splice(bookingIndex, 1);
      queue.currentQueueSize--;
    }

    await queue.save();

    res.status(200).json({ success: true, data: queue });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.addToQueue = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const providerId = req.provider.id;

    let queue = await Queue.findOne({ provider: providerId });
    
    if (!queue) {
      queue = new Queue({ provider: providerId, bookings: [] });
    }

    const booking = await Booking.findById(bookingId).populate('service');
    
    // Calculate estimated times
    const lastBooking = queue.bookings[queue.bookings.length - 1];
    const estimatedStartTime = lastBooking 
      ? new Date(lastBooking.estimatedEndTime)
      : new Date();
    
    const estimatedEndTime = new Date(
      estimatedStartTime.getTime() + booking.service.duration * 60000
    );

    queue.bookings.push({
      booking: bookingId,
      position: queue.currentQueueSize + 1,
      estimatedStartTime,
      estimatedEndTime,
      status: 'waiting'
    });

    queue.currentQueueSize++;
    await queue.save();

    res.status(200).json({ success: true, data: queue });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
