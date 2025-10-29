const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const analytics = require('../controllers/analyticsController');

router.get('/stats', protect, authorizeRoles('admin'), analytics.basicStats);
router.get('/top-hospitals', protect, authorizeRoles('admin'), analytics.topHospitalsByRating);

module.exports = router;
