const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware, isCustomer, isProvider } = require('../middlewares/authMiddleware');

// Authentication routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Profile Management
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);

// Password Management
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.put('/change-password', authMiddleware, authController.changePassword);

module.exports = router;