const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post('/request', authMiddleware, roleMiddleware(['customer']), bookingController.requestBooking);
router.post('/accept', authMiddleware, roleMiddleware(['owner']), bookingController.acceptBooking);
router.post('/reject', authMiddleware, roleMiddleware(['owner']), bookingController.rejectBooking);
router.get('/history/user/:id', authMiddleware, bookingController.getUserBookingHistory);

module.exports = router;