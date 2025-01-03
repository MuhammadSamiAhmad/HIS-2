const hl7 = require("hl7-standard");
const axios = require("axios");
const CryptoJS = require("crypto-js");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const ENCRYPTION_KEY = "SecureKey123!@#";

// Function to Encrypt HL7 Message
function encryptMessage(message) {
  return CryptoJS.AES.encrypt(message, ENCRYPTION_KEY).toString();
}

const sendHL7Message = async (endpoint, message, messageType) => {
  try {
    const response = await axios.post(`http://localhost:3307/${endpoint}`, {encryptedMessage: message, messageType:messageType});
    console.log(`✅ [${messageType}] Message sent to /${endpoint}:`);
    // console.log(`✅ [${messageType}] Message sent to /${endpoint}:`, response.data);
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

//ADT^A04 Message
const createAdtA04Message = async (req, res) =>{
  const data = req.body
  console.log(req.body)
  let message = new hl7();
  const timestamp = formatHL7Timestamp();

  // MSH Segment
  message.createSegment("MSH");
  message.set("MSH", {
    "MSH.1": "|",
    "MSH.2": "^~\\&",
    "MSH.3": data.sendingFacility, // SanOris
    "MSH.4": data.sendingFacilityApplication, // Dental Clinic
    "MSH.5": data.receivingFacility, // Lab or whatever App Name
    "MSH.6": data.receivingFacilityApplication, // Lab
    "MSH.7": timestamp, // date auto-generated at once
    "MSH.9": data.hl7MessageType, // ADT
    "MSH.10": data.patientID.toString().split("").reverse().join(""), // Reversed Patient ID
    "MSH.11": "P", // Processing ID
    "MSH.12": "2.5", // HL7 Version
  });

  // PID Segment
  message.createSegment("PID");
  message.set("PID", {
    "PID.1": "1",
    "PID.2": `${data.patientID}^^^${data.sendingFacility}`,
    "PID.5": {
      "PID.5.1": data.lName,
      "PID.5.2": data.fName,
      "PID.5.3": data.mName || "",
    },
    "PID.7": data.dob,
    "PID.8": data.gender,
    "PID.11": data.address,
    "PID.13": data.phone,
  });

  // PV1 Segment
  message.createSegment("PV1");
  message.set("PV1", {
    "PV1.1": "1",
    "PV1.2": data.patientClass || "O", // Default to outpatient
    "PV1.7": {
      "PV1.7.1": data.provider || "",
      "PV1.7.2": data.attendingPhysician?.lName || "",
    },
  });

  // AL1 Segment (if allergy data exists)
  if (data.allergy) {
    message.createSegment("AL1");
    // message.set("AL1", {
    //   "AL1.1": "1",
    //   "AL1.2": data.allergy || "",
    //   "AL1.3": data.allergy.severity || "",
    //   "AL1.4": data.allergy.reaction || "",
    // });
    message.set("AL1", {
      "AL1.1": "1", // Set ID
      "AL1.2": data.allergy?.type || "", // Allergy Type
      "AL1.3": data.allergy || "", // Allergy Description
      "AL1.4": data.allergy?.severity || "", // Allergy Severity
      "AL1.5": data.allergy?.reaction?.join("~") || "", // Allergy Reaction
    });
  }

  message = message.build();
  console.log(`✅  Message sent before encryption : ${message}`);
  const encryptedMessage = encryptMessage(message);
  console.log(`✅  Message sent after encryption : ${encryptedMessage}`);

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

// SCH^S12 Message
const createSchS12Message = async (req, res) =>{
  const {data} = req.body
  // let appointmentID;
  // console.log(`pID : ${data.patientID}`)
  // // -----------------------------------------------
  const doctor = await prisma.dentist.findFirst({
    where: {
      fName: {
        contains: data.practitionerName.split(' ')[1], // Partial match
        // mode: 'insensitive' // Case-insensitive search
      }
    }
  });
  // // Use a transaction for atomic operations
  // const result = await prisma.$transaction(async (prisma) => {
  //   // Create a visit
  //   const visit = await prisma.visit.create({
  //     data: {
  //       date: new Date(data.startTime.split('T')[0]),
  //       time: data.startTime.split('T')[1],
  //       status: "Scheduled",
  //       patientId: parseInt(data.patientID),
  //       dentistSsn: doctor.dentistSSN,
  //       serviceName: data.appointmentType,
  //     },
  //   });
  //   appointmentID = String(visit.id);
  //   const cost = data.appointmentType==="EXAMINE"?300.0:data.appointmentType==="SURGERY"?1000.0:100.0;
  //   // If the service requires an automatic invoice creation
  //     await prisma.invoice.create({
  //       data: {
  //         date: new Date(),
  //         totalCost: cost,
  //         status: "Unpaid",
  //         visit: {
  //           connect: { id: visit.id } // Replace `id` with the unique field of your `Visit` model
  //         },
  //         patientInvoice:{
  //           connect: {patientID: parseInt(data.patientID)}
  //         }
  //       },
  //     });
  //   })
  // // -----------------------------------------------
  //  const diagnosis = await prisma.diagnosis.findUnique({
  //   where: {
  //     patientId: data.patientID, 
  //   },
  //   select: {
  //     visitId: true, 
  //   },
  // });
  // if (!diagnosis) {
  //   return res.status(404).json({
  //     success: false,
  //     message: "Diagnosis not found for the given patient.",
  //   });
  // }
  // const appointmentID = diagnosis.visitId;

  let message = new hl7();
  const [messageCode, triggerEvent] = data.hl7MessageType
  // MSH Segment
  message.createSegment("MSH");
  message.set("MSH",{
  "MSH.1": "|",
  "MSH.2": "^~\\&",
  "MSH.3": data.sendingFacility, //SanOris
  "MSH.4": data.sendingFacilityApplication, //Dental Clinic
  "MSH.5": data.receivingFacility,
  "MSH.6": data.receivingFacilityApplication,
  "MSH.7": Date.now().toString(),
  "MSH.9": {messageCode, triggerEvent},
  "MSH.10": Date.now().toString(),
  "MSH.11": "P", //HL7 version
  "MSH.12": "2.5", //HL7 version
  })

  // SCH Segment
  message.createSegment("SCH");
  message.set('SCH',{
  "SCH.1": data.appointmentID,
  // "SCH.1": appointmentID,
  "SCH.2": data.startTime,
  "SCH.3": data.endTime,
  "SCH.4": data.duration,
  "SCH.5": data.practitionerName,
  "SCH.6": data.appointmentType,
  "SCH.7": data.status,
})

  // PID Segment
  message.createSegment("PID");
  message.set("PID",{
  "PID.1": `${data.patientID}^^^${data.sendingFacility}`,
  "PID.2": `${data.lName}^${data.fName}`,
  "PID.3": data.dob,
  "PID.4": data.gender,})

  // AIG Segment
  message.createSegment("AIG")
  message.set("AIG",{
    "AIG.1": `${data.practitionerName}^${doctor.lName}`,
    "AIG.2": doctor.dentistSSN,
    "AIG.3": data.appointmentType,})

  message = message.build();
  console.log(`✅  Message sent before encryption : ${message}`);
  const encryptedMessage = encryptMessage(message);
  console.log(`✅  Message sent after encryption : ${encryptedMessage}`);

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
}

//ORM^O01 Message
const createOrmO01Message = async (req, res) =>{
  const {data} = req.body
  let message = new hl7();

  // MSH Segment
  const timestamp = formatHL7Timestamp();
  message.createSegment("MSH");
  message.set("MSH", {
    "MSH.1": "|",
    "MSH.2": "^~\\&",
    "MSH.3": data.sendingFacility, // SanOris
    "MSH.4": data.sendingFacilityApplication, // Dental Clinic
    "MSH.5": data.receivingFacility, // Lab or whatever App Name
    "MSH.6": data.receivingFacilityApplication, // Lab
    "MSH.7": timestamp, // date auto-generated at once
    "MSH.9": data.hl7MessageType, // ORM
    "MSH.10": data.patientID.toString().split("").reverse().join(""), // Reversed Patient ID
    "MSH.11": "P"   ,  // Processing ID
    "MSH.12": "2.5" ,  // HL7 Version
  });

  // PID Segment
  message.createSegment("PID");
  message.set("PID", {
    "PID.1": "1",
    "PID.2": `${data.patientID}^^^${data.sendingFacility}`,
    "PID.5": {
      "PID.5.1": data.lName,
      "PID.5.2": data.fName,
      "PID.5.3": data.mName || "",
    },
    "PID.7": data.dob,
    "PID.8": data.gender,
    "PID.11": data.address,
    "PID.13": data.phone,
  });

  // ORC Segment
  message.createSegment("ORC");
  message.set("ORC", {
    "ORC.1": data.orderControlCode, // NW, CA
    "ORC.2": data.orderID,
    "ORC.3": data.fillerOrderNumber,
    "ORC.9": data.orderDate,
    "ORC.12": data.orderingProvider || "",
  });

  // OBR Segment
  message.createSegment("OBR");
  message.set("OBR", {
    "OBR.1": data.testName,
    "OBR.2": data.orderID,
    "OBR.3": `L${data.fillerOrderNumber}`,
    "OBR.4": `${data.testCode}^${data.testName}`,
    "OBR.5": data.orderDate,
    "OBR.6": data.orderingProvider,
  });

  message = message.build();
  console.log(`✅  Message sent before encryption : ${message}`);
  const encryptedMessage = encryptMessage(message);
  console.log(`✅  Message sent after encryption : ${encryptedMessage}`);

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
}

//ORU^R01 Message
const createOruR01Message = async (req, res) =>{
  const {data} = req.body
  let message = new hl7();

  // MSH Segment
  const timestamp = formatHL7Timestamp();
  message.createSegment("MSH");
  message.set("MSH", {
    "MSH.1": "|",
    "MSH.2": "^~\\&",
    "MSH.3": data.sendingFacility, // SanOris
    "MSH.4": data.sendingFacilityApplication, // Dental Clinic
    "MSH.5": data.receivingFacility, // Lab or whatever App Name
    "MSH.6": data.receivingFacilityApplication, // Lab
    "MSH.7": timestamp, // Date auto-generated at once
    "MSH.9": data.hl7MessageType, // ORU
    "MSH.10": data.patientID.toString().split("").reverse().join(""), // Reversed Patient ID
    "MSH.11": "P",   // Processing ID
    "MSH.12": "2.5", // HL7 Version
  });

  // PID Segment
  message.createSegment("PID");
  message.set("PID", {
    "PID.1": "1",
    "PID.2": `${data.patientID}^^^${data.sendingFacility}`,
    "PID.5": {
      "PID.5.1": data.lName,
      "PID.5.2": data.fName,
      "PID.5.3": data.mName || "",
    },
    "PID.7": data.dob,
    "PID.8": data.gender,
    "PID.11": data.address,
    "PID.13": data.phone,
  });

  // OBR Segment
  message.createSegment("OBR");
  message.set("OBR", {
    "OBR.1": data.testName,
    "OBR.2": data.orderID,
    "OBR.3": `L${data.fillerOrderID}`,
    "OBR.4": `${data.testCode}^${data.testName}`,
    "OBR.5": data.specimenReceivedDateTime,
    "OBR.6": data.orderingProvider,
  });

  // OBX Segment
  message.createSegment("OBX");
  message.set("OBX", {
    "OBX.2": data.valueType, // NE, CE, ST
    "OBX.3": `${data.code}^${data.description}^${data.codingSystem}`,
    "OBX.5": data.observation,
    "OBX.11": data.resultStatus, // Final, Preliminary
  });

  message = message.build();
  // message = message.toString();

  console.log(`✅  Message sent before encryption : ${message}`);
  const encryptedMessage = encryptMessage(message);
  console.log(`✅  Message sent after encryption : ${encryptedMessage}`);

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
}


module.exports = {
  createAdtA04Message,
  createSchS12Message,
  createOrmO01Message,
  createOruR01Message,
};
