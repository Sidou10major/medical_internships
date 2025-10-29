const Notification = require('../models/Notification');

exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) { next(err); }
};

exports.markRead = async (req, res, next) => {
  try {
    const id = req.params.id;
    const n = await Notification.findOneAndUpdate({ _id: id, user: req.user._id }, { read: true }, { new: true });
    if (!n) return res.status(404).json({ error: 'Notification not found' });
    res.json(n);
  } catch (err) { next(err); }
};

exports.createNotification = async (req, res, next) => {
  try {
    // Admin-only endpoint to create arbitrary notification
    const { user, title, body, meta } = req.body;
    const notif = await Notification.create({ user, title, body, meta });
    res.status(201).json(notif);
  } catch (err) { next(err); }
};
