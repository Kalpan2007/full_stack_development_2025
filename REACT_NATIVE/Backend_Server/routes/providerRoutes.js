const express = require('express');
const router = express.Router();
const providerController = require('../controllers/providerController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post('/register', authMiddleware, roleMiddleware(['owner']), providerController.registerSalon);
router.post('/toggle', authMiddleware, roleMiddleware(['owner']), providerController.toggleStatus);
router.get('/open', providerController.getOpenSalons);

module.exports = router;