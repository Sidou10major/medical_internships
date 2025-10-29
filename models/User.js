const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  role: { type: String, enum: ['student', 'hospital', 'admin'], required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, required: true },

  // student fields
  specialty: { type: String },
  preferences: { type: [String], default: [] },

  // hospital fields
  hospitalName: { type: String },
  location: { type: String },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
