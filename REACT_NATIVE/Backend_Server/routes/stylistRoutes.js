const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const { isProvider } = require('../middlewares/roleMiddleware');
const {
  addStylist,
  getStylists,
  updateAvailability,
  deleteStylist
} = require('../controllers/stylistController');

// All routes require authentication and provider role
router.use(authMiddleware, isProvider);

router.post('/', addStylist);
router.get('/', getStylists);
router.put('/:stylistId/availability', updateAvailability);
router.delete('/:stylistId', deleteStylist);

module.exports = router;
