const Evaluation = require('../models/Evaluation');
const Application = require('../models/Application');
const Internship = require('../models/Internship');

exports.createEvaluation = async (req, res, next) => {
  try {
    const { internshipId, studentId, rating, feedback } = req.body;
    if (!internshipId || !studentId || !rating) return res.status(400).json({ error: 'internshipId, studentId and rating required' });

    // Only hospital owning internship or admin can evaluate
    const internship = await Internship.findById(internshipId);
    if (!internship) return res.status(404).json({ error: 'Internship not found' });

    if (String(internship.hospital) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not allowed to evaluate' });
    }

    const evalDoc = await Evaluation.create({
      internship: internshipId,
      student: studentId,
      hospital: req.user._id,
      rating,
      feedback,
    });

    // Optionally add notification to student
    const Notification = require('../models/Notification');
    await Notification.create({
      user: studentId,
      title: `Evaluation received for ${internship.title || 'your internship'}`,
      body: `Rating: ${rating} — ${feedback ? feedback.slice(0, 200) : ''}`,
      meta: { type: 'evaluation', evaluationId: evalDoc._id, internshipId }
    });

    res.status(201).json(evalDoc);
  } catch (err) { next(err); }
};

exports.getEvaluationsForStudent = async (req, res, next) => {
  try {
    const studentId = req.params.studentId || req.user._id;
    const evals = await Evaluation.find({ student: studentId }).populate('hospital', 'name hospitalName');
    res.json(evals);
  } catch (err) { next(err); }
};

exports.getEvaluationsForInternship = async (req, res, next) => {
  try {
    const internshipId = req.params.internshipId;
    const evals = await Evaluation.find({ internship: internshipId }).populate('student', 'name email specialty');
    res.json(evals);
  } catch (err) { next(err); }
};
