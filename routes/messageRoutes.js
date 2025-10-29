const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const messageController = require('../controllers/messageController');

router.post('/', protect, messageController.sendMessage);               // send message
router.get('/inbox', protect, messageController.getInbox);              // list messages to me
router.get('/conversation/:userId', protect, messageController.getConversation); // conversation with user
router.put('/read/:id', protect, messageController.markRead);          // mark message as read

module.exports = router;
