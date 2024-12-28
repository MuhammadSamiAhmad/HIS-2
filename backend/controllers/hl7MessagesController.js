const hl7 = require("hl7-standard");
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
// Utility to format timestamps for HL7 messages
function formatHL7Timestamp(date = new Date()) {
  const pad = (num) => num.toString().padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(
    date.getDate()
  )}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

// ADT^A04 Message
const createAdtA04Message = async (req, res) =>{
  const {data} = req.body
  const timestamp = formatHL7Timestamp();

  const message = [
    ["MSH", "|", "^~\\&", data.sendingFacility, data.sendingFacilityApplication, data.receivingFacility, data.receivingFacilityApplication, timestamp, "", data.hl7MessageType, data.patientID.toString().split("").reverse().join(""), "P", "2.5"],
    ["PID", "1", `${data.patientID}^^^${data.sendingFacility}`, "", "", `${data.lName}^${data.fName}^${data.mName || ""}`, "", data.dob, data.gender, "", "", data.address, "", data.phone],
    ["PV1", "1", data.patientClass || "O", "", "", "", data.attendingPhysician || ""],
  ];

  if (data.allergy) {
    message.push([
      "AL1",
      "1",
      data.allergy.type || "",
      data.allergy.severity || "",
      data.allergy.reaction || ""
    ]);
  }
  const adtMessage = message.toString();

  try {
    // Assuming sendHL7Message is an async function that sends the HL7 message
    await sendHL7Message("adt", adtMessage, "ADT^A04");

    // Send success response
    return res.status(200).json({
      success: true,
      message: "HL7 ADT^A04 message sent successfully",
      data: adtMessage,
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

// SCH^S12 Message
const createSchS12Message = async (req, res) =>{

  const {data} = req.body

  // MSH Segment
  message.addSegment("MSH");
  message.setField("MSH.1", "|");
  message.setField("MSH.2", "^~\\&");
  message.setField("MSH.3", data.sendingFacility); //SanOris
  message.setField("MSH.4", data.sendingFacilityApplication); //Dental Clinic
  message.setField("MSH.5", data.receivingFacility);
  message.setField("MSH.6", data.receivingFacilityApplication);
  message.setField("MSH.7", Date.now().toString());
  message.setField("MSH.9", data.hl7MessageType);
  message.setField("MSH.10", Date.now().toString());
  message.setField("MSH.11", "P"); //HL7 version
  message.setField("MSH.12", "2.5"); //HL7 version

  // SCH Segment
  message.addSegment("SCH");
  message.setField("SCH.1", data.appointmentID);
  message.setField("SCH.2", data.startTime);
  message.setField("SCH.3", data.endTime);
  message.setField("SCH.4", data.duration);
  message.setField("SCH.5", data.practitionerFName);
  message.setField("SCH.6", data.appointmentType);
  message.setField("SCH.7", data.status);

  // PID Segment
  message.addSegment("PID");
  message.setField("PID.1", `${data.patientID}^^^${data.sendingFacility}`);
  message.setField("PID.2", `${data.lName}^${data.fName}`);
  message.setField("PID.3", data.dob);
  message.setField("PID.4", data.gender);

  // AIG Segment
  message.addSegment("AIG");
  message.setField(
    "AIG.1",
    `${data.practitionerFName}^${data.practitionerLName}`
  );
  message.setField("AIG.2", data.practitionerId);
  message.setField("AIG.3", data.appointmentType);

  return message.toString();
}

// ORM^O01 Message
function createOrmO01Message(data) {
  const message = new hl7.Message();

  // MSH Segment
  const timestamp = formatHL7Timestamp();
  message.addSegment("MSH");
  message.setField("MSH.1", "|");
  message.setField("MSH.2", "^~\\&");
  message.setField("MSH.3", data.sendingFacility); //SanOris
  message.setField("MSH.4", data.sendingFacilityApplication); //Dental Clinic
  message.setField("MSH.5", data.receivingFacility); //Lab or whatever App Name
  message.setField("MSH.6", data.receivingFacilityApplication); //lab
  message.setField("MSH.7", timestamp); // date auto-generated at once
  message.setField("MSH.9", data.hl7MessageType); //ADT
  message.setField("MSH.10", data.patientID.toString().reverse());
  message.setField("MSH.11", "P"); //HL7 version
  message.setField("MSH.12", "2.5"); //HL7 Version

  // PID Segment
  message.addSegment("PID");
  message.setField("PID.1", "1");
  message.setField("PID.2", `${data.patientID}^^^${data.sendingFacility}`);
  message.setField("PID.5", `${data.lName}^${data.fName}^${data.mName || ""}`);
  message.setField("PID.7", data.dob);
  message.setField("PID.8", data.gender);
  message.setField("PID.11", data.address);
  message.setField("PID.13", data.phone);

  // ORC Segment
  message.addSegment("ORC");
  message.setField("ORC.1", data.orderControlCode); //NW, CA
  message.setField("ORC.2", data.orderID);
  message.setField("ORC.3", data.fillerOrderID);
  message.setField("ORC.9", formatHL7Timestamp(data.orderDate));
  message.setField("ORC.12", data.orderingProvider || "");

  // OBR Segment
  message.addSegment("OBR");
  message.setField("OBR.1", data.testType);
  message.setField("OBR.2", data.orderID);
  message.setField("OBR.3", `L${data.fillerOrderID}`);
  message.setField("OBR.4", `${data.testCode}^${data.testName}`);
  message.setField("OBR.5", formatHL7Timestamp(data.orderDate));
  message.setField("OBR.5", data.provider);
  return message.toString();
}

// ORU^R01 Message
function createOruR01Message(data) {
  const message = new hl7.Message();

  // MSH Segment
  const timestamp = formatHL7Timestamp();
  message.addSegment("MSH");
  message.setField("MSH.1", "|");
  message.setField("MSH.2", "^~\\&");
  message.setField("MSH.3", data.sendingFacility); //SanOris
  message.setField("MSH.4", data.sendingFacilityApplication); //Dental Clinic
  message.setField("MSH.5", data.receivingFacility); //Lab or whatever App Name
  message.setField("MSH.6", data.receivingFacilityApplication); //lab
  message.setField("MSH.7", timestamp); // date auto-generated at once
  message.setField("MSH.9", data.hl7MessageType); //ADT
  message.setField("MSH.10", data.patientID.toString().reverse());
  message.setField("MSH.11", "P"); //HL7 version
  message.setField("MSH.12", "2.5"); //HL7 Version

  // PID Segment
  message.addSegment("PID");
  message.setField("PID.1", "1");
  message.setField("PID.2", `${data.patientID}^^^${data.sendingFacility}`);
  message.setField("PID.5", `${data.lName}^${data.fName}^${data.mName || ""}`);
  message.setField("PID.7", data.dob);
  message.setField("PID.8", data.gender);
  message.setField("PID.11", data.address);
  message.setField("PID.13", data.phone);

  // OBR Segment
  message.addSegment("OBR");
  message.setField("OBR.1", data.testType);
  message.setField("OBR.2", data.orderID);
  message.setField("OBR.3", `L${data.fillerOrderID}`);
  message.setField("OBR.4", `${data.testCode}^${data.testName}`);
  message.setField("OBR.5", data.requestedDateTime);
  message.setField("OBR.5", data.specimenReceivedDateTime || "");
  message.setField("OBR.5", data.orderingProvider);

  // OBX Segment
  message.addSegment("OBX");
  message.setField("OBX.2", data.valueType); // NE, CE, ST
  message.setField(
    "OBX.3",
    `${data.code}^${data.description}^${data.codingSystem}`
  );
  message.setField("OBX.5", data.observation);
  message.setField("OBX.11", data.resultStatus); //Final Preliminary

  return message.toString();
}

module.exports = {
  createAdtA04Message,
  // createSchS12Message,
  // createOrmO01Message,
  // createOruR01Message,
};
