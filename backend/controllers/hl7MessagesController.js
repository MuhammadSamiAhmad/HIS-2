const hl7 = require("hl7-standard");
const axios = require("axios");
const CryptoJS = require("crypto-js");

const ENCRYPTION_KEY = "SecureKey123!@#";

// Utility to format timestamps for HL7 messages
function formatHL7Timestamp(date = new Date()) {
  const pad = (num) => num.toString().padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(
    date.getDate()
  )}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

// Function to Encrypt HL7 Message
function encryptMessage(message) {
  return CryptoJS.AES.encrypt(message, ENCRYPTION_KEY).toString();
}

const sendHL7Message = async (endpoint, message, messageType) => {
  try {
    const response = await axios.post(`http://localhost:3001/${endpoint}`, {encryptedMessage: message, messageType:messageType});
    console.log(`✅ [${messageType}] Message sent to /${endpoint}:`, response.data);
  } catch (error) {
    console.error(
      `❌ [${messageType}] Failed to send message to /${endpoint}:`,
      error.message
    );
  }
};

// ADT^A04 Message
const createAdtA04Message = async (req, res) =>{
  const {data} = req.body
  const timestamp = formatHL7Timestamp();

  let message =
  `MSH|^~\\&|${data.sendingFacility}|${data.sendingFacilityApplication}|${data.receivingFacility}|${data.receivingFacilityApplication}|${timestamp}||${data.hl7MessageType}|${data.patientID.toString().split("").reverse().join("")}|P|2.5 PID|1|${data.patientID}^^^${data.sendingFacility}||||${data.lName}^${data.fName}^${data.mName || ""}||||${data.dob}|${data.gender}||||${data.address}||||${data.phone}
  PV1|1|${data.patientClass || "O"}||||||${data.attendingPhysician || ""}`;

if (data.allergy) {
  message += `AL1|1|${data.allergy.type || ""}|${data.allergy.severity || ""}|${data.allergy.reaction || ""}`;
}
  // const adtMessage = message.toString();
  console.log(message)
  const encryptedMessage = encryptMessage(message);
  console.log(encryptedMessage)

  try {
    // Assuming sendHL7Message is an async function that sends the HL7 message
    await sendHL7Message("adt", encryptedMessage, "ADT^A04");

    // Send success response
    return res.status(200).json({
      success: true,
      message: "HL7 ADT^A04 message sent successfully",
      data: encryptedMessage,
    });
  } catch (error) {
    // Send failure response if something goes wrong
    return res.status(500).json({
      success: false,
      message: "Failed to send HL7 ADT^A04 message",
      error: error.message,
    });
  }
}

const createSchS12Message = async (req, res) => {
  const { data } = req.body;
  console.log(data);
  const timestamp = formatHL7Timestamp();

  let message = 
`MSH|^~\\&|${data.sendingFacility}|${data.sendingFacilityApplication}|${data.receivingFacility}|${data.receivingFacilityApplication}|${timestamp}||${data.hl7MessageType}|${Date.now()}|P|2.5
SCH|${data.appointmentID}|${data.startTime}|${data.endTime}|${data.duration}|${data.practitionerFName}|${data.appointmentType}|${data.status}
PID|1|${data.patientID}^^^${data.sendingFacility}|${data.lName}^${data.fName}|${data.dob}|${data.gender}
AIG|${data.practitionerFName}^${data.practitionerLName}|${data.practitionerId}|${data.appointmentType}`;

  console.log(message);
  const encryptedMessage = encryptMessage(message);
  console.log(encryptedMessage);

  try {
    await sendHL7Message("sch", encryptedMessage, "SCH^S12");
    return res.status(200).json({
      success: true,
      message: "HL7 SCH^S12 message sent successfully",
      data: encryptedMessage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send HL7 SCH^S12 message",
      error: error.message,
    });
  }
};

// ORM^O01 Message
const createOrmO01Message = async (req, res) => {
  const { data } = req.body;
  const timestamp = formatHL7Timestamp();

  let message = 
`MSH|^~\\&|${data.sendingFacility}|${data.sendingFacilityApplication}|${data.receivingFacility}|${data.receivingFacilityApplication}|${timestamp}||${data.hl7MessageType}|${data.patientID.toString().split("").reverse().join("")}|P|2.5
PID|1|${data.patientID}^^^${data.sendingFacility}|${data.lName}^${data.fName}^${data.mName || ""}|${data.dob}|${data.gender}|${data.address}|${data.phone}
ORC|${data.orderControlCode}|${data.orderID}|${data.fillerOrderNumber}|${data.orderDate}|${data.orderingProvider || ""}
OBR|${data.testName}|${data.orderID}|L${data.fillerOrderNumber}|${data.testCode}^${data.testName}|${data.orderDate}|${data.orderingProvider}`;

  console.log(message);
  const encryptedMessage = encryptMessage(message);
  console.log(encryptedMessage);

  try {
    await sendHL7Message("orm", encryptedMessage, "ORM^O01");
    return res.status(200).json({
      success: true,
      message: "HL7 ORM^O01 message sent successfully",
      data: encryptedMessage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send HL7 ORM^O01 message",
      error: error.message,
    });
  }
};

// ORU^R01 Message
const createOruR01Message = async (req, res) => {
  const { data } = req.body;
  const timestamp = formatHL7Timestamp();

  let message = 
`MSH|^~\\&|${data.sendingFacility}|${data.sendingFacilityApplication}|${data.receivingFacility}|${data.receivingFacilityApplication}|${timestamp}||${data.hl7MessageType}|${data.patientID.toString().split("").reverse().join("")}|P|2.5
PID|1|${data.patientID}^^^${data.sendingFacility}|${data.lName}^${data.fName}^${data.mName || ""}|${data.dob}|${data.gender}|${data.address}|${data.phone}
OBR|${data.testName}|${data.orderID}|L${data.fillerOrderID}|${data.testCode}^${data.testName}|${data.requestedDateTime}|${data.specimenReceivedDateTime || ""}|${data.orderingProvider}
OBX|${data.valueType}|${data.code}^${data.description}^${data.codingSystem}|${data.observation}|${data.resultStatus}`;

  console.log(message);
  const encryptedMessage = encryptMessage(message);
  console.log(encryptedMessage);

  try {
    await sendHL7Message("oru", encryptedMessage, "ORU^R01");
    return res.status(200).json({
      success: true,
      message: "HL7 ORU^R01 message sent successfully",
      data: encryptedMessage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send HL7 ORU^R01 message",
      error: error.message,
    });
  }
};


module.exports = {
  createAdtA04Message,
  createSchS12Message,
  createOrmO01Message,
  createOruR01Message,
};
