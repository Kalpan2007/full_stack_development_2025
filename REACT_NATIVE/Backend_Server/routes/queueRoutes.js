const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const { isProvider } = require('../middlewares/roleMiddleware');
const {
  getCurrentQueue,
  updateQueueStatus,
  addToQueue
} = require('../controllers/queueController');

// All routes require authentication and provider role
router.use(authMiddleware, isProvider);

router.get('/current', getCurrentQueue);
router.put('/status/:bookingId', updateQueueStatus);
router.post('/add', addToQueue);

module.exports = router;
