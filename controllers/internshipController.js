const Internship = require('../models/Internship');
const Application = require('../models/Application');

exports.createInternship = async (req, res, next) => {
  try {
    // hospital creates internship
    const data = req.body;
    data.hospital = req.user._id;
    const internship = await Internship.create(data);
    res.status(201).json(internship);
  } catch (err) { next(err); }
};

exports.getAllInternships = async (req, res, next) => {
  try {
    const internships = await Internship.find().populate('hospital', 'hospitalName location name email');
    res.json(internships);
  } catch (err) { next(err); }
};

exports.getInternship = async (req, res, next) => {
  try {
    const internship = await Internship.findById(req.params.id).populate('hospital', 'hospitalName location name email');
    if (!internship) return res.status(404).json({ error: 'Not found' });
    res.json(internship);
  } catch (err) { next(err); }
};

exports.updateInternship = async (req, res, next) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) return res.status(404).json({ error: 'Not found' });
    if (String(internship.hospital) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not allowed' });
    }
    Object.assign(internship, req.body);
    await internship.save();
    res.json(internship);
  } catch (err) { next(err); }
};

exports.deleteInternship = async (req, res, next) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) return res.status(404).json({ error: 'Not found' });
    if (String(internship.hospital) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not allowed' });
    }
    await Application.deleteMany({ internship: internship._id }); // cleanup
    await internship.remove();
    res.json({ msg: 'Deleted' });
  } catch (err) { next(err); }
};
