const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  internship: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  feedback: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Evaluation', evaluationSchema);
