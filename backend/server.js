const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const CryptoJS = require("crypto-js");
const hl7 = require("hl7-standard");
const fs = require('fs');
const path = require('path');
// const storageFilePath = '../frontend/src/hl7Messages.json';
const ENCRYPTION_KEY = "SecureKey123!@#";

const prisma = new PrismaClient();
const app = express();

//json
app.use(express.json());

//cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));

app.use('/HL7Messages', require('./routes/HL7Messages'))

app.use('/patient', require('./routes/patient' ))
app.use('/admin', require('./routes/admin'));
app.use('/dentist', require('./routes/dentist'))

// ----------------------------------------------HL7 Handling-------------------------------------------------

// Function to Decrypt HL7 Message
function decryptMessage(encryptedMessage) {
  const bytes = CryptoJS.AES.decrypt(encryptedMessage, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

const hl7Handler = async (req, res) => {
 const { encryptedMessage, messageType } = req.body;
 
 if (!encryptedMessage) {
     console.warn(`❌ [${messageType}] No HL7 message received.`);
     return res.status(400).send("❌ No HL7 message received");  // Send a response and return to stop further execution
 }

 // Decrypt message
 const decryptedMessage = decryptMessage(encryptedMessage);
 console.log(`📥 [${messageType}] Message received:\n${decryptedMessage}`);
 
 // Process the decrypted message based on message type
 let extractedData = {};
 try {
     extractedData = processHL7Message(decryptedMessage, messageType);
 } catch (error) {
     console.error(`❌ Error processing message: ${error.message}`);
     return res.status(500).send("❌ Error processing message");  // Send response and return
 }

 console.log(`📤 [${messageType}] Extracted data:`, extractedData);

   // Save the extracted data to a file
   try {
    await saveExtractedData(messageType, extractedData);
    console.log(`✅ [${messageType}] Data saved successfully.`);
  } catch (error) {
    console.error(`❌ Error saving data: ${error.message}`);
    return res.status(500).send("❌ Error saving data");
  }

 // Ensure you send only one response, use return to prevent further execution
 return res.json({
     message: `✅ [${messageType}] Message processed successfully`,
     extractedData: extractedData,
 });
};

// process HL7 message based on type
const processHL7Message = (message, messageType) => {
let extractedData = {};
//  console.log(`msg received: ${message}`)
let hl7Message = new hl7(message);
const rawMessage = hl7Message.raw;

// Split the raw message into individual segments
const segments = rawMessage.split('\r\n');

switch (messageType) {
    case "ADT^A04":
     extractedData =  extractAdtA04Data(segments);  
        break;
    case "SCH^S12":
     extractedData =  extractSchS12Data(segments);  
        break;
    case "ORM^O01":
     extractedData =  extractOrmO01Data(segments);  
        break;
    case "ORU^R01":
     extractedData =  extractOruR01Data(segments);
        break;
    default:
        throw new Error(`Unsupported message type: ${messageType}`);
}
return extractedData 
};

function extractAdtA04Data(segments) {
 const extractedData = {};

 segments.forEach(segment => {
   const fields = segment.split("|");

   // MSH Segment
   if (segment.startsWith("MSH")) {
     extractedData.sendingFacility = fields[4]; // MSH.3
     extractedData.sendingFacilityApplication = fields[5]; // MSH.4
     extractedData.receivingFacility = fields[6]; // MSH.5
     extractedData.receivingFacilityApplication = fields[7]; // MSH.6
   }

   // PID Segment
   if (segment.startsWith("PID")) {
     const patientID = fields[2].split("^");
     const patientName = fields[3].split("^");
     extractedData.patientID = patientID[0]; // PID.2.1
     extractedData.patientName = `${patientName[1]} ${patientName[0]}`; // PID.5.1 and PID.5.2
     extractedData.dob = fields[4]; // PID.7
     extractedData.gender = fields[5]; // PID.8
     extractedData.address = fields[6]; // PID.11
     extractedData.phone = fields[7]; // PID.13
   }

   // AL1 Segment (Allergy Information)
   if (segment.startsWith("AL1")) {
     extractedData.setID = fields[1]
     extractedData.allergyType = fields[2]; // AL1.2
     extractedData.allergyDescription = fields[3]; // AL1.2
     extractedData.allergySeverity = fields[4]; // AL1.3
     extractedData.allergyReaction = fields[5]; // AL1.4
   }
 });

 return extractedData;
}

function extractSchS12Data(segments) {
 const extractedData = {};

 segments.forEach(segment => {
   const fields = segment.split("|");

   // MSH Segment
   if (segment.startsWith("MSH")) {
     extractedData.sendingFacility = fields[4]; // MSH.3
     extractedData.sendingFacilityApplication = fields[5]; // MSH.4
     extractedData.receivingFacility = fields[6]; // MSH.5
     extractedData.receivingFacilityApplication = fields[7]; // MSH.6
   }

   // SCH Segment (Scheduling Information)
   if (segment.startsWith("SCH")) {
     extractedData.appointmentID = fields[1]; // SCH.1
     extractedData.startTime = fields[2]; // SCH.2
     extractedData.endTime = fields[3]; // SCH.3
     extractedData.duration = fields[4]; // SCH.4
     extractedData.practitionerName = fields[5];
     extractedData.appointmentType = fields[6]; // SCH.6
     extractedData.status = fields[7]; // SCH.7
   }

 });

 return extractedData;
}

function extractOrmO01Data(segments) {
 const extractedData = {};

 segments.forEach(segment => {
   const fields = segment.split("|");

   // MSH Segment
   if (segment.startsWith("MSH")) {
     extractedData.sendingFacility = fields[4]; // MSH.3
     extractedData.sendingFacilityApplication = fields[5]; // MSH.4
     extractedData.receivingFacility = fields[6]; // MSH.5
     extractedData.receivingFacilityApplication = fields[7]; // MSH.6
   }

   // ORC Segment (Order Control)
   if (segment.startsWith("ORC")) {
     extractedData.orderControlCode = fields[1]; // ORC.1
     extractedData.orderID = fields[2]; // ORC.2
     extractedData.fillerOrderNumber = fields[3]; // ORC.3
     extractedData.orderDate = fields[4]; // ORC.9
     extractedData.orderingProvider = fields[5]; // ORC.12
   }

   // OBR Segment (Observation Request)
   if (segment.startsWith("OBR")) {
     extractedData.testName = fields[4].split("^")[1]; // OBR.4.2
     extractedData.testCode = fields[4].split("^")[0]; // OBR.4.1
   }
 });

 return extractedData;
}

function extractOruR01Data(segments) {
   const extractedData = {};
 // Loop through the segments and extract relevant fields
 segments.forEach(segment => {
   const fields = segment.split("|");

   // Check for MSH segment and extract relevant fields
   if (segment.startsWith("MSH")) {
     extractedData.sendingFacility = fields[4]; // MSH.3
     extractedData.sendingFacilityApplication = fields[5]; // MSH.4
     extractedData.receivingFacility = fields[6]; // MSH.5
     extractedData.receivingFacilityApplication = fields[7]; // MSH.6
   }

   // Check for OBR segment and extract relevant fields
   if (segment.startsWith("OBR")) {
     let result = fields[4].split("^")
     extractedData.testResult = result[1]; // OBR.4.2
     extractedData.resultDate = fields[5]; // OBR.5
   }

   // Check for PID segment and extract relevant fields
   if (segment.startsWith("PID")) {
     let id = fields[2].split("^")
     extractedData.patientID = id[0]; // PID.2.1
   }

   // Check for OBX segment and extract relevant fields
   if (segment.startsWith("OBX")) {
     let code = fields[2].split("^")
     extractedData.valueType = fields[1]; // OBX.2
     extractedData.code = code[0]; // OBX.3.1
     extractedData.description = code[1]; // OBX.3.2
     extractedData.codingSystem = code[2]; // OBX.3.3
     extractedData.observationValue = fields[3]; // OBX.5
     extractedData.resultStatus = fields[4]; // OBX.11
   }
 });

 // Return the extracted data
 return extractedData;
}

async function saveExtractedData(messageType, data) {
  const filePath = path.join(__dirname, 'hl7_messages.json');

  let existingData = {};
try{
  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Read existing data if the file exists
    const fileContent = await fs.promises.readFile(filePath, 'utf8');
    existingData = JSON.parse(fileContent);
  } else {
    // Create an empty object if the file does not exist
    existingData = {};
    await fs.promises.writeFile(filePath, JSON.stringify(existingData, null, 2), 'utf8');
    console.log(`🆕 File created: ${filePath}`);
  }

  // Ensure the messageType array exists
  if (!existingData[messageType]) {
    existingData[messageType] = [];
  }

  // Append the new data to the appropriate messageType array
  existingData[messageType].push(data);

  // Write the updated data back to the file
  const jsonData = JSON.stringify(existingData, null, 2);
  await fs.promises.writeFile(filePath, jsonData, 'utf8');
  console.log(`✅ [${messageType}] Data saved successfully.`);
} catch (error) {
  console.error(`❌ Error saving data: ${error.message}`);
  throw error;
}
}

// ADT^A04 Endpoint
app.post("/adt", (req, res) => hl7Handler(req, res, "ADT^A04"));

// SCH^S12 Endpoint
app.post("/sch", (req, res) => hl7Handler(req, res, "SCH^S12"));

// ORM^O01 Endpoint
app.post("/orm", (req, res) => hl7Handler(req, res, "ORM^O01"));

// ORU^R01 Endpoint
app.post("/oru", (req, res) => hl7Handler(req, res, "ORU^R01"));

//start server
const PORT = process.env.PORT || 3307; //3001 is the mapped port on my device to access.
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
