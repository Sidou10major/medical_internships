const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  internship: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['applied', 'accepted', 'rejected', 'withdrawn'], default: 'applied' },
  appliedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  notes: { type: String },
});

applicationSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Application', applicationSchema);
