const Message = require('../models/Message');
const User = require('../models/User');
const { createAndEmitNotification } = require('../notificationService');

exports.sendMessage = async (req, res, next) => {
  try {
    const { to, text, internship } = req.body;

    const recipient = await User.findById(to);
    if (!recipient) return res.status(404).json({ error: "Recipient not found" });

    const msg = await Message.create({
      from: req.user._id,
      to,
      text,
      internship: internship || undefined
    });

    await createAndEmitNotification(
      req.app,
      to,
      `New message from ${req.user.name}`,
      text.slice(0, 200),
      { type: "message", messageId: msg._id, from: req.user._id }
    );

    res.status(201).json(msg);
  } catch (err) { next(err); }
};

exports.getConversation = async (req, res, next) => {
  try {
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { from: req.user._id, to: otherUserId },
        { from: otherUserId, to: req.user._id }
      ]
    }).sort('createdAt');

    res.json(messages);
  } catch (err) { next(err); }
};

exports.getInbox = async (req, res, next) => {
  try {
    const inbox = await Message.find({ to: req.user._id })
      .populate("from", "name email role")
      .sort({ createdAt: -1 });

    res.json(inbox);
  } catch (err) { next(err); }
};

exports.markRead = async (req, res, next) => {
  try {
    const id = req.params.id;
    const msg = await Message.findOneAndUpdate(
      { _id: id, to: req.user._id },
      { read: true },
      { new: true }
    );

    if (!msg) return res.status(404).json({ error: "Message not found" });

    res.json(msg);
  } catch (err) { next(err); }
};
