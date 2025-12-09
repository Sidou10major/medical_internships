const Evaluation = require('../models/Evaluation');
const Internship = require('../models/Internship');
const { createAndEmitNotification } = require('../notificationService');

exports.createEvaluation = async (req, res, next) => {
  try {
    const { internshipId, studentId, rating, feedback } = req.body;

    const internship = await Internship.findById(internshipId);
    if (!internship) return res.status(404).json({ error: "Internship not found" });

    const evalDoc = await Evaluation.create({
      internship: internshipId,
      student: studentId,
      hospital: req.user._id,
      rating,
      feedback
    });

    await createAndEmitNotification(
      req.app,
      studentId,
      "New internship evaluation",
      `Rating: ${rating} — ${feedback ? feedback.slice(0, 200) : ""}`,
      { type: "evaluation", evaluationId: evalDoc._id }
    );

    res.status(201).json(evalDoc);
  } catch (err) { next(err); }
};

exports.getEvaluationsForStudent = async (req, res, next) => {
  try {
    const studentId = req.params.studentId || req.user._id;

    const evals = await Evaluation.find({ student: studentId }).populate("hospital");
    res.json(evals);
  } catch (err) { next(err); }
};

exports.getEvaluationsForInternship = async (req, res, next) => {
  try {
    const evals = await Evaluation.find({
      internship: req.params.internshipId
    }).populate("student");

    res.json(evals);
  } catch (err) { next(err); }
};
