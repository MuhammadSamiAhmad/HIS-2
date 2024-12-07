const express = require('express');
const router = express.Router();
const dentistController = require('../controllers/dentistController');

// Reservations Tab Routes
router.get('/reservations', dentistController.getReservations);
router.put('/reservations/:patientId', dentistController.saveMedicalRecord);

// Patients Tab Routes
router.get('/patients', dentistController.getPatients);
router.get('/patients/:patientId/medical-record', dentistController.getMedicalRecord);

module.exports = router;
