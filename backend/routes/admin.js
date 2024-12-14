const express = require("express");
const router = express.Router();
const adminsControllers = require('../controllers/adminsController');

router.route('/patients')
    .get(adminsControllers.getAllPatients)
    .post(adminsControllers.createNewPatient)
    .put(adminsControllers.updatePatient)

router.route('/patients/:patientId')
    .delete(adminsControllers.deletePatient);

router.route('/doctors')
    .get(adminsControllers.getAllDoctors)
    .post(adminsControllers.createNewDoctor)
    .put(adminsControllers.updateDoctor)
    .delete(adminsControllers.deleteDoctor);

router.route('/appointments')
    .get(adminsControllers.getAllAppointments)
    .post(adminsControllers.createNewAppointmentAndInvoice)
    .put(adminsControllers.updateAppointment)

router.route('/appointments/:id')
    .delete(adminsControllers.deleteAppointment);

router.route('/invoices/:patientId')
    .get(adminsControllers.getAllInvoices);

router.route('/invoices/status/:invoiceId')
    .patch(adminsControllers.toggleInvoiceStatus);

router.route('/items')
    .get(adminsControllers.getAllItems)
    .patch(adminsControllers.decrementItemQuantity)
    .post(adminsControllers.createItem);

router.route('/items/:itemId')
    .put(adminsControllers.updateItem) 
    .delete(adminsControllers.deleteItem);

router.route('/purchases/:itemId')
    .get(adminsControllers.getItemPurchaseDetails)
    .post(adminsControllers.createPurchase)

router.route('/services')
    .post(adminsControllers.updateServiceCosts)

module.exports = router;
