const cron = require('node-cron');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { sendPushNotification } = require('./notificationUtils');
const moment = require('moment');

const scheduleReminders = () => {
  // Run every minute to check for upcoming appointments
  cron.schedule('* * * * *', async () => {
    try {
      const now = moment();
      const bookings = await Booking.find({ 
        status: 'confirmed',
        date: { $gte: now.format('YYYY-MM-DD') }
      }).populate('userId');

      for (const booking of bookings) {
        const bookingDateTime = moment(`${booking.date} ${booking.time}`, 'YYYY-MM-DD HH:mm');
        
        // 1-hour reminder
        const oneHourBefore = bookingDateTime.clone().subtract(1, 'hour');
        if (now.isBetween(oneHourBefore, oneHourBefore.clone().add(1, 'minute')) && booking.userId.deviceToken) {
          await sendPushNotification(
            booking.userId.deviceToken,
            'Appointment Reminder',
            `Your appointment is in 1 hour on ${booking.date} at ${booking.time}.`,
            { bookingId: booking._id.toString() }
          );
        }

        // 30-minute reminder
        const thirtyMinBefore = bookingDateTime.clone().subtract(30, 'minutes');
        if (now.isBetween(thirtyMinBefore, thirtyMinBefore.clone().add(1, 'minute')) && booking.userId.deviceToken) {
          await sendPushNotification(
            booking.userId.deviceToken,
            'Appointment Reminder',
            `Your appointment is in 30 minutes on ${booking.date} at ${booking.time}.`,
            { bookingId: booking._id.toString() }
          );
        }

        // No-show check (10+ minutes late)
        const tenMinAfter = bookingDateTime.clone().add(10, 'minutes');
        if (now.isAfter(tenMinAfter) && booking.status === 'confirmed') {
          await Booking.findByIdAndUpdate(booking._id, { status: 'no-show' });
          await Slot.findByIdAndUpdate(booking.slotId, { status: 'available' });

          if (booking.userId.deviceToken) {
            await sendPushNotification(
              booking.userId.deviceToken,
              'No-Show Alert',
              `You missed your appointment on ${booking.date} at ${booking.time}.`,
              { bookingId: booking._id.toString() }
            );
          }

          // Notify next in queue
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
        }
      }
    } catch (error) {
      console.error('Error in reminder scheduler:', error);
    }
  });
};

module.exports = { scheduleReminders };