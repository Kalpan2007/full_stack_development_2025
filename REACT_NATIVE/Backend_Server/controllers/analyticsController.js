const Analytics = require('../models/Analytics');
const Booking = require('../models/Booking');
const moment = require('moment-timezone');

exports.getDailyAnalytics = async (req, res) => {
  try {
    const providerId = req.provider.id;
    const date = req.query.date ? new Date(req.query.date) : new Date();

    let analytics = await Analytics.findOne({
      provider: providerId,
      date: {
        $gte: moment(date).startOf('day'),
        $lte: moment(date).endOf('day')
      }
    }).populate('metrics.popularServices.service');

    if (!analytics) {
      // Generate analytics if not exists
      analytics = await generateDailyAnalytics(providerId, date);
    }

    res.status(200).json({ success: true, data: analytics });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getWeeklyAnalytics = async (req, res) => {
  try {
    const providerId = req.provider.id;
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const analytics = await Analytics.find({
      provider: providerId,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).populate('metrics.popularServices.service');

    // Aggregate weekly data
    const weeklyMetrics = {
      totalBookings: 0,
      completedBookings: 0,
      cancelledBookings: 0,
      noShows: 0,
      averageRating: 0,
      totalRevenue: 0,
      peakHours: Array(24).fill(0),
      popularServices: {}
    };

    analytics.forEach(day => {
      weeklyMetrics.totalBookings += day.metrics.totalBookings;
      weeklyMetrics.completedBookings += day.metrics.completedBookings;
      weeklyMetrics.cancelledBookings += day.metrics.cancelledBookings;
      weeklyMetrics.noShows += day.metrics.noShows;
      weeklyMetrics.totalRevenue += day.metrics.totalRevenue;
      
      // Aggregate peak hours
      day.metrics.peakHours.forEach(hour => {
        weeklyMetrics.peakHours[hour.hour] += hour.count;
      });

      // Aggregate popular services
      day.metrics.popularServices.forEach(service => {
        if (weeklyMetrics.popularServices[service.service._id]) {
          weeklyMetrics.popularServices[service.service._id].count += service.count;
        } else {
          weeklyMetrics.popularServices[service.service._id] = {
            service: service.service,
            count: service.count
          };
        }
      });
    });

    // Calculate average rating
    weeklyMetrics.averageRating = analytics.reduce((acc, day) => 
      acc + day.metrics.averageRating, 0) / analytics.length;

    res.status(200).json({ success: true, data: weeklyMetrics });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

async function generateDailyAnalytics(providerId, date) {
  const startOfDay = moment(date).startOf('day');
  const endOfDay = moment(date).endOf('day');

  const bookings = await Booking.find({
    provider: providerId,
    createdAt: { $gte: startOfDay, $lte: endOfDay }
  }).populate('service');

  const metrics = {
    totalBookings: bookings.length,
    completedBookings: bookings.filter(b => b.status === 'completed').length,
    cancelledBookings: bookings.filter(b => b.status === 'cancelled').length,
    noShows: bookings.filter(b => b.status === 'no-show').length,
    totalRevenue: bookings
      .filter(b => b.status === 'completed')
      .reduce((acc, b) => acc + b.service.price, 0),
    peakHours: [],
    popularServices: []
  };

  // Calculate peak hours
  const hourCounts = Array(24).fill(0);
  bookings.forEach(booking => {
    const hour = moment(booking.scheduledTime).hour();
    hourCounts[hour]++;
  });
  metrics.peakHours = hourCounts.map((count, hour) => ({ hour, count }));

  // Calculate popular services
  const serviceCount = {};
  bookings.forEach(booking => {
    const serviceId = booking.service._id.toString();
    serviceCount[serviceId] = serviceCount[serviceId] 
      ? { service: booking.service, count: serviceCount[serviceId].count + 1 }
      : { service: booking.service, count: 1 };
  });
  metrics.popularServices = Object.values(serviceCount);

  const analytics = new Analytics({
    provider: providerId,
    date,
    metrics
  });

  await analytics.save();
  return analytics;
}
