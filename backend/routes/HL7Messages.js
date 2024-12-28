const express = require("express");
const {
  createAdtA04Message,
  createSchS12Message,
  createOrmO01Message,
  createOruR01Message,
} = require("../controllers/hl7MessagesController");
const router = express.Router();
const axios = require("axios");

const sendHL7Message = async (endpoint, message, messageType) => {
  try {
    const response = await axios.post(`http://localhost:3001/${endpoint}`, {
      hl7Message: message,
    });
    console.log(`✅ [${messageType}] Message sent to /${endpoint}:`, response.data);
  } catch (error) {
    console.error(
      `❌ [${messageType}] Failed to send message to /${endpoint}:`,
      error.message
    );
  }
};

// Example Data
const exampleData = {
  sendingFacility: "SanOris",
  sendingFacilityApplication: "Dental Clinic",
  receivingFacility: "Lab",
  receivingFacilityApplication: "LabApp",
  hl7MessageType: "ADT^A04",
  patientID: "12345",
  fName: "John",
  lName: "Doe",
  dob: "19900101",
  gender: "M",
  address: "123 Street, City",
  phone: "123-456-7890",
};

router.route('/adt').post(createAdtA04Message);
// router.route('/sch').post(createSchS12Message);
// router.route('/orm').post(createOrmO01Message);
// router.route('/oru').post(createOruR01Message);



// // Send ADT^A04 Message
// const adtMessage = createAdtA04Message(exampleData);
// sendHL7Message("adt", adtMessage, "ADT^A04");

// // Send SCH^S12 Message
// const schMessage = createSchS12Message(exampleData);
// sendHL7Message("sch", schMessage, "SCH^S12");

// // Send ORM^O01 Message
// const ormMessage = createOrmO01Message(exampleData);
// sendHL7Message("orm", ormMessage, "ORM^O01");

// // Send ORU^R01 Message
// const oruMessage = createOruR01Message(exampleData);
// sendHL7Message("oru", oruMessage, "ORU^R01");

module.exports = router;
