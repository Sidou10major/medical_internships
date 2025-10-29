const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  specialty: { type: String },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // hospital user id
  startDate: { type: Date },
  endDate: { type: Date },
  slots: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Internship', internshipSchema);
