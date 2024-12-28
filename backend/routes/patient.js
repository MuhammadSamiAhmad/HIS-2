const express = require("express");
const patientsController = require("../controllers/patientController");
const router = express.Router();

router
  .route("/bookAppointment")
  .post(patientsController.bookAppointment)
  .get(patientsController.bookAppointmentDentistsOptions);
router
  .route("/editAppointment")
  .get(patientsController.bookAppointmentDentistsOptions)
  .post(patientsController.editAppointments);

router.get("/appointments", patientsController.getAppointments);

router.delete(
  "/appointments/cancelAppointment/:id",
  patientsController.cancelAppointment
);

router.delete(
  "/appointments/deleteAppointment/:id",
  patientsController.deleteAppointment
);

router.get("/records", patientsController.getMedicalRecords);
// router.get("/prescriptions", patientsController.getPrescriptions);
router.get("/invoices", patientsController.getInvoices);

router.patch("/patientSettings/:patientId", patientsController.updatePatient);
router.get("/profileSettings", patientsController.getPatientProfile);

router.post("/exportReports", patientsController.exportReports);

module.exports = router;
