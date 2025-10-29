// routes/evaluationRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const evalCtrl = require('../controllers/evaluationController');

router.post('/', protect, authorizeRoles('hospital','admin'), evalCtrl.createEvaluation);

// two separate endpoints instead of :studentId?
router.get('/student', protect, authorizeRoles('admin','hospital','student'), evalCtrl.getEvaluationsForStudent);
router.get('/student/:studentId', protect, authorizeRoles('admin','hospital','student'), evalCtrl.getEvaluationsForStudent);

router.get('/internship/:internshipId', protect, evalCtrl.getEvaluationsForInternship);

module.exports = router;
