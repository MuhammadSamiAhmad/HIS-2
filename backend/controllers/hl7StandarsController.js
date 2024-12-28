const hl7 = require("hl7-standard");

// Utility to format timestamps for HL7 messages
function formatHL7Timestamp(date = new Date()) {
  const pad = (num) => num.toString().padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(
    date.getDate()
  )}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}


function createAdtA04Message(data) {
  const message = new HL7();
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
      "PV1.7.1": data.attendingPhysician?.lName || "",
      "PV1.7.2": data.attendingPhysician?.fName || "",
    },
  });

  // AL1 Segment (if allergy data exists)
  if (data.allergy) {
    message.createSegment("AL1");
    message.set("AL1", {
      "AL1.1": "1",
      "AL1.2": data.allergy.type || "",
      "AL1.3": data.allergy.severity || "",
      "AL1.4": data.allergy.reaction || "",
    });
  }

  return message.toString();
}


// SCH^S12 Message
function createSchS12Message(data) {
  const message = new hl7.Message();

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



function createOrmO01Message(data) {
  const message = new HL7();

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

  // ORC Segment
  message.createSegment("ORC");
  message.set("ORC", {
    "ORC.1": data.orderControlCode, // NW, CA
    "ORC.2": data.orderID,
    "ORC.3": data.fillerOrderID,
    "ORC.9": formatHL7Timestamp(data.orderDate),
    "ORC.12": data.orderingProvider || "",
  });

  // OBR Segment
  message.createSegment("OBR");
  message.set("OBR", {
    "OBR.1": data.testType,
    "OBR.2": data.orderID,
    "OBR.3": `L${data.fillerOrderID}`,
    "OBR.4": `${data.testCode}^${data.testName}`,
    "OBR.5": formatHL7Timestamp(data.orderDate),
    "OBR.6": data.provider,
  });

  return message.toString();
}



function createOruR01Message(data) {
  const message = new HL7();

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
    "MSH.11": "P", // Processing ID
    "MSH.12": "2.5", // HL7 Version
  });

  // PID Segment
  message.CreateSegment("PID");
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
  message.CreateSegment("OBR");
  message.set("OBR", {
    "OBR.1": data.testType,
    "OBR.2": data.orderID,
    "OBR.3": `L${data.fillerOrderID}`,
    "OBR.4": `${data.testCode}^${data.testName}`,
    "OBR.5": data.dateTime,
    "OBR.6": data.provider,
  });

  // OBX Segment
  message.CreateSegment("OBX");
  message.set("OBX", {
    "OBX.2": data.valueType, // NE, CE, ST
    "OBX.3": `${data.code}^${data.description}^${data.codingSystem}`,
    "OBX.5": data.observation,
    "OBX.11": data.resultStatus, // Final, Preliminary
  });

  return message.toString();
}


module.exports = {
  createAdtA04Message,
  createSchS12Message,
  createOrmO01Message,
  createOruR01Message,
};