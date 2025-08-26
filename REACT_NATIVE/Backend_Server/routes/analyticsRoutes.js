const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const { isProvider } = require('../middlewares/roleMiddleware');
const {
  getDailyAnalytics,
  getWeeklyAnalytics
} = require('../controllers/analyticsController');

// All routes require authentication and provider role
router.use(authMiddleware, isProvider);

router.get('/daily', getDailyAnalytics);
router.get('/weekly', getWeeklyAnalytics);

module.exports = router;
