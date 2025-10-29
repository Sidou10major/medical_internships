const Application = require('../models/Application');
const Internship = require('../models/Internship');

exports.applyToInternship = async (req, res, next) => {
  try {
    const internshipId = req.params.internshipId;
    const internship = await Internship.findById(internshipId);
    if (!internship) return res.status(404).json({ error: 'Internship not found' });

    // check existing application
    const existing = await Application.findOne({ internship: internshipId, student: req.user._id });
    if (existing) return res.status(400).json({ error: 'Already applied' });

    const application = await Application.create({
      internship: internshipId,
      student: req.user._id,
      status: 'applied'
    });

    res.status(201).json(application);
  } catch (err) { next(err); }
};

exports.getApplicationsForStudent = async (req, res, next) => {
  try {
    const apps = await Application.find({ student: req.user._id }).populate({
      path: 'internship',
      populate: { path: 'hospital', select: 'hospitalName name location' }
    });
    res.json(apps);
  } catch (err) { next(err); }
};

exports.getApplicationsForHospital = async (req, res, next) => {
  try {
    // find internships of this hospital
    const internships = await Internship.find({ hospital: req.user._id }).select('_id');
    const internshipIds = internships.map(i => i._id);
    const apps = await Application.find({ internship: { $in: internshipIds } }).populate('student', 'name email specialty');
    res.json(apps);
  } catch (err) { next(err); }
};

exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params; // application id
    const { status, notes } = req.body;

    const app = await Application.findById(id).populate('internship');
    if (!app) return res.status(404).json({ error: 'Application not found' });

    // only hospital owning internship or admin
    const internship = app.internship;
    if (String(internship.hospital) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not allowed' });
    }

    if (status) app.status = status;
    if (notes) app.notes = notes;
    await app.save();

    res.json(app);
  } catch (err) { next(err); }
};
