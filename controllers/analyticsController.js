const User = require('../models/User');
const Internship = require('../models/Internship');
const Application = require('../models/Application');
const Evaluation = require('../models/Evaluation');

exports.basicStats = async (req, res, next) => {
  try {
    // admin-only endpoint (should be protected)
    const totalUsers = await User.countDocuments();
    const students = await User.countDocuments({ role: 'student' });
    const hospitals = await User.countDocuments({ role: 'hospital' });
    const admins = await User.countDocuments({ role: 'admin' });
    const totalInternships = await Internship.countDocuments();
    const openApplications = await Application.countDocuments({ status: 'applied' });

    // average rating
    const agg = await Evaluation.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    const avgRating = agg[0] ? agg[0].avgRating : null;

    res.json({
      totalUsers, students, hospitals, admins,
      totalInternships, openApplications, avgRating
    });
  } catch (err) { next(err); }
};

exports.topHospitalsByRating = async (req, res, next) => {
  try {
    const agg = await Evaluation.aggregate([
      { $group: { _id: '$hospital', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
      { $sort: { avgRating: -1, count: -1 } },
      { $limit: 10 }
    ]);
    // populate hospital info
    const result = await Promise.all(agg.map(async (g) => {
      const hosp = await User.findById(g._id).select('hospitalName name location');
      return { hospital: hosp, avgRating: g.avgRating, reviews: g.count };
    }));
    res.json(result);
  } catch (err) { next(err); }
};
