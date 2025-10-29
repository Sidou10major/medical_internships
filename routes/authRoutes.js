const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// register
router.post('/register', [
  body('role').isIn(['student','hospital','admin']).withMessage('Invalid role'),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('name').notEmpty()
], authController.register);

// login
router.post('/login', authController.login);

// profile
router.get('/me', protect, authController.getProfile);
router.put('/me', protect, authController.updateProfile);

module.exports = router;
