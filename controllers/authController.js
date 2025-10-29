const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const User = require('../models/User');

const createToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { role, email, password, name, specialty, preferences, hospitalName, location } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      role,
      email,
      password: hashed,
      name,
      specialty: role === 'student' ? specialty : undefined,
      preferences: role === 'student' ? preferences : undefined,
      hospitalName: role === 'hospital' ? hospitalName : undefined,
      location: role === 'hospital' ? location : undefined,
    });

    await user.save();

    const token = createToken(user);
    res.status(201).json({ token, user: { id: user._id, email: user.email, role: user.role, name: user.name } });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Provide email and password' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = createToken(user);
    res.json({ token, user: { id: user._id, email: user.email, role: user.role, name: user.name } });
  } catch (err) {
    next(err);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const updates = req.body;
    // don't allow role/email change here
    delete updates.role;
    delete updates.email;
    delete updates.password;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    next(err);
  }
};
const { getDB } = require('../config/db');

exports.testConnection = async (req, res) => {
  const db = getDB();
  const users = await db.collection('users').find().toArray();
  res.json(users);
};
