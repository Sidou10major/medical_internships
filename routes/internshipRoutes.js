const express = require('express');
const router = express.Router();
const internshipController = require('../controllers/internshipController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

// public list + get
router.get('/', internshipController.getAllInternships);
router.get('/:id', internshipController.getInternship);

// hospital creates internship
router.post('/', protect, authorizeRoles('hospital','admin'), internshipController.createInternship);

// update / delete
router.put('/:id', protect, authorizeRoles('hospital','admin'), internshipController.updateInternship);
router.delete('/:id', protect, authorizeRoles('hospital','admin'), internshipController.deleteInternship);

module.exports = router;
