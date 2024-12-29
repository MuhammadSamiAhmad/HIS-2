const express = require("express");
const CryptoJS = require("crypto-js");
const hl7 = require("hl7-standard");
const ENCRYPTION_KEY = "SecureKey123!@#";

const app = express();
app.use(express.json());

// Function to Decrypt HL7 Message
function decryptMessage(encryptedMessage) {
   const bytes = CryptoJS.AES.decrypt(encryptedMessage, ENCRYPTION_KEY);
   return bytes.toString(CryptoJS.enc.Utf8);
}


const hl7Handler = async (req, res) => {
    const { encryptedMessage , messageType } = req.body;
    
    if (!encryptedMessage) {
        console.warn(`❌ [${messageType}] No HL7 message received.`);
        return res.status(400).send("❌ No HL7 message received");
    }
    // // msg decrypted 
    // const bytes = CryptoJS.AES.decrypt(encryptedMessage, ENCRYPTION_KEY);
    // const decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);
    const decryptedMessage = decryptMessage(encryptedMessage);
    console.log(decryptedMessage);
        // console.log(hl7Message);
    // const originalMessage = bytes.toString(CryptoJS.enc.Utf8);
    console.log(`📥 [${messageType}] Message received:\n${decryptedMessage}`);
    res.send(`✅ [${messageType}] Message received successfully`);
    
};




// Process the decrypted message based on message type
 let extractedData = {};
 try {
     extractedData = processHL7Message(decryptedMessage, messageType);
 } catch (error) {
     console.error(`❌ Error processing message: ${error.message}`);
     return res.status(500).send("❌ Error processing message");
 }
console.log(`📤 [${messageType}] Extracted data:`, extractedData);
res.json({
     message: `✅ [${messageType}] Message processed successfully`,
     extractedData: extractedData,
 });

// process HL7 message based on type
const processHL7Message = (message, messageType) => {
 let extractedData = {};
 let hl7Message = new hl7(message);
 switch (messageType) {
     case "ADT^A04":
      extractedData =  extractAdtA04Data(hl7Message);  
         break;
     case "SCH^S12":
      extractedData =  extractSchS12Data(hl7Message);  
         break;
     case "ORM^O01":
      extractedData =  extractOrmO01Data(hl7Message);  
         break;
     case "ORU^R01":
      extractedData =  extractOruR01Data(hl7Message);
         break;
     default:
         throw new Error(`Unsupported message type: ${messageType}`);
 }
 return extractedData 
};


// Extract ADT^A04 Data
function extractAdtA04Data(hl7Message) {
  return {
    sendingFacility: hl7Message.get("MSH.3"), // Sending Facility
    sendingFacilityApplication: hl7Message.get("MSH.4"), // Sending Facility Application
    receivingFacility: hl7Message.get("MSH.5"), // Receiving Facility
    receivingFacilityApplication: hl7Message.get("MSH.6"), // Receiving Facility Application
    patientID: hl7Message.get("PID.2.1"), // Patient ID
    patientName: `${hl7Message.get("PID.5.1")} ${hl7Message.get("PID.5.2")}`, // Patient Name
    dob: hl7Message.get("PID.7"), // Date of Birth
    gender: hl7Message.get("PID.8"), // Gender
    address: hl7Message.get("PID.11"), // Address
    phone: hl7Message.get("PID.13"), // Phone
    // attendingPhysician: hl7Message.get("PV1.7"), // Attending Physician
    allergyType: hl7Message.get("AL1.2"), // Allergy Type
    allergySeverity: hl7Message.get("AL1.3"), // Allergy Severity
    allergyReaction: hl7Message.get("AL1.4"), // Allergy Reaction
  };
}

// Extract SCH^S12 Data
function extractSchS12Data(hl7Message) {
  return {
    sendingFacility: hl7Message.get("MSH.3"), // Sending Facility
    sendingFacilityApplication: hl7Message.get("MSH.4"), // Sending Facility Application
    receivingFacility: hl7Message.get("MSH.5"), // Receiving Facility
    receivingFacilityApplication: hl7Message.get("MSH.6"), // Receiving Facility Application
    appointmentID: hl7Message.get("SCH.1"), // Appointment ID
    startTime: hl7Message.get("SCH.2"), // Start Time
    endTime: hl7Message.get("SCH.3"), // End Time
    duration: hl7Message.get("SCH.4"), // Duration
    practitionerName: `${hl7Message.get("AIG.1.1")} ${hl7Message.get("AIG.1.2")}`, // Practitioner Name
    appointmentType: hl7Message.get("SCH.6"), // Appointment Type
    status: hl7Message.get("SCH.7"), // Appointment Status
  };
}

// Extract ORM^O01 Data
function extractOrmO01Data(hl7Message) {
  return {
    sendingFacility: hl7Message.get("MSH.3"), // Sending Facility
    sendingFacilityApplication: hl7Message.get("MSH.4"), // Sending Facility Application
    receivingFacility: hl7Message.get("MSH.5"), // Receiving Facility
    receivingFacilityApplication: hl7Message.get("MSH.6"), // Receiving Facility Application
    orderControlCode: hl7Message.get("ORC.1"), // Order Control Code
    orderID: hl7Message.get("ORC.2"), // Order ID
    fillerOrderNumber: hl7Message.get("ORC.3"), // Filler Order Number
    orderDate: hl7Message.get("ORC.9"), // Order Date
    orderingProvider: hl7Message.get("ORC.12"), // Ordering Provider
    testName: hl7Message.get("OBR.4.2"), // Test Name
    testCode: hl7Message.get("OBR.4.1"), // Test Code
  };
}

// Extract ORU^R01 Data
function extractOruR01Data(hl7Message) {
  return {
    sendingFacility: hl7Message.get("MSH.3"), // Sending Facility
    sendingFacilityApplication: hl7Message.get("MSH.4"), // Sending Facility Application
    receivingFacility: hl7Message.get("MSH.5"), // Receiving Facility
    receivingFacilityApplication: hl7Message.get("MSH.6"), // Receiving Facility Application
    testResult: hl7Message.get("OBR.4"), // Test Result
    resultDate: hl7Message.get("OBR.5"), // Result Date
    patientID: hl7Message.get("PID.2.1"), // Patient ID
    resultStatus: hl7Message.get("OBX.11"), // Result Status
    observationValue: hl7Message.get("OBX.5"), // Observation Value
    valueType: hl7Message.get("OBX.2"), // Value Type
    code: hl7Message.get("OBX.3.1"), // Observation Code
    description: hl7Message.get("OBX.3.2"), // Observation Description
    codingSystem: hl7Message.get("OBX.3.3"), // Observation Coding System
  };
}





// ADT^A04 Endpoint
app.post("/adt", (req, res) => hl7Handler(req, res, "ADT^A04"));

// SCH^S12 Endpoint
app.post("/sch", (req, res) => hl7Handler(req, res, "SCH^S12"));

// ORM^O01 Endpoint
app.post("/orm", (req, res) => hl7Handler(req, res, "ORM^O01"));

// ORU^R01 Endpoint
app.post("/oru", (req, res) => hl7Handler(req, res, "ORU^R01"));

