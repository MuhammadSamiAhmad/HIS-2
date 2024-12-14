const express = require('express')
const router = express.Router()
const patientController = require('../controllers/patientController')

router.post('/', patientController.registerNewPatient)

module.exports = router