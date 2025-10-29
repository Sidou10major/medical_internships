const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const notif = require('../controllers/notificationController');

router.get('/', protect, notif.getNotifications);
router.put('/read/:id', protect, notif.markRead);
router.post('/', protect, authorizeRoles('admin'), notif.createNotification); // admin can create
module.exports = router;
