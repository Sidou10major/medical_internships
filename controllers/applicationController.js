const Application = require('../models/Application');
const Internship = require('../models/Internship');
const { createAndEmitNotification } = require('../notificationService');

// ===============================
// STUDENT APPLIES TO INTERNSHIP
// ===============================
exports.applyToInternship = async (req, res, next) => {
  try {
    const { internshipId } = req.params;

    const internship = await Internship.findById(internshipId);
    if (!internship)
      return res.status(404).json({ error: "Internship not found" });

    // prevent multiple applications
    const exists = await Application.findOne({
      internship: internship._id,
      student: req.user._id
    });

    if (exists)
      return res.status(400).json({ error: "You already applied." });

    const newApp = await Application.create({
      internship: internship._id,
      student: req.user._id,
      status: "applied"
    });

    // notify hospital
    await createAndEmitNotification(
      req.app,
      internship.hospital,
      "New internship application",
      `${req.user.name} applied to ${internship.title}`,
      { type: "application", applicationId: newApp._id }
    );

    res.status(201).json(newApp);
  } catch (err) {
    next(err);
  }
};


// ================================
// GET APPLICATIONS FOR STUDENT
// ================================
exports.getApplicationsForStudent = async (req, res, next) => {
  try {
    const apps = await Application.find({ student: req.user._id })
      .populate("internship");

    res.json(apps);
  } catch (err) {
    next(err);
  }
};


// ===========================================
// GET APPLICATIONS FOR HOSPITAL (ITS POSTS)
// ===========================================
exports.getApplicationsForHospital = async (req, res, next) => {
  try {
    const applications = await Application.find()
      .populate({
        path: "internship",
        match: { hospital: req.user._id }
      })
      .populate("student");

    const filtered = applications.filter(app => app.internship !== null);

    res.json(filtered);
  } catch (err) {
    next(err);
  }
};


// ==================================
// HOSPITAL UPDATES APPLICATION STATUS
// ==================================
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const app = await Application.findById(id).populate("internship");

    if (!app)
      return res.status(404).json({ error: "Application not found" });

    // Only hospital owning the internship can update
    if (String(app.internship.hospital) !== String(req.user._id))
      return res.status(403).json({ error: "Not authorized" });

    app.status = status;
    await app.save();

    // notify student
    await createAndEmitNotification(
      req.app,
      app.student,
      "Application status updated",
      `Your application for ${app.internship.title} is now ${status}`,
      { type: "application_status", status }
    );

    res.json(app);
  } catch (err) {
    next(err);
  }
};
