const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  body: { type: String },
  read: { type: Boolean, default: false },
  meta: { type: Object, default: {} }, // optional metadata (e.g., { applicationId, internshipId })
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
