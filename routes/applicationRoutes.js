const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

// student applies
router.post('/apply/:internshipId', protect, authorizeRoles('student'), applicationController.applyToInternship);

// student's own applications
router.get('/me', protect, authorizeRoles('student'), applicationController.getApplicationsForStudent);

// hospital view apps for its internships
router.get('/hospital', protect, authorizeRoles('hospital','admin'), applicationController.getApplicationsForHospital);

// update status (hospital/admin)
router.put('/:id/status', protect, authorizeRoles('hospital','admin'), applicationController.updateApplicationStatus);

module.exports = router;
