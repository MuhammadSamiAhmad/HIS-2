// import HL7Accordion from "../components/UI/Accordion";

// const hl7Messages = [
//   {
//     type: "ADT^A04",
//     data: {
//       sendingFacility: "Facility A",
//       sendingFacilityApplication: "App A",
//       receivingFacility: "Facility B",
//       receivingFacilityApplication: "App B",
//       patientID: "12345",
//       patientName: "John Doe",
//       dob: "1985-04-12",
//       gender: "Male",
//       address: "123 Main St, City, State",
//       phone: "+123456789",
//       allergyType: "Drug",
//       allergySeverity: "High",
//       allergyReaction: "Rash",
//     },
//   },
//   {
//     type: "SCH^S12",
//     data: {
//       sendingFacility: "Facility A",
//       receivingFacility: "Facility B",
//       appointmentID: "APPT12345",
//       startTime: "2024-01-01T10:00:00Z",
//       endTime: "2024-01-01T10:30:00Z",
//       duration: "30 minutes",
//       practitionerName: "Dr. Jane Smith",
//       appointmentType: "Consultation",
//       status: "Scheduled",
//     },
//   },
//   {
//     type: "ORM^O01",
//     data: {
//       sendingFacility: "Facility A",
//       sendingFacilityApplication: "App A",
//       receivingFacility: "Facility C",
//       receivingFacilityApplication: "App C",
//       orderControlCode: "NW", // New Order
//       orderID: "ORDER12345",
//       fillerOrderNumber: "FILLER54321",
//       orderDate: "2024-01-02T08:00:00Z",
//       orderingProvider: "Dr. Emily Carter",
//       testName: "Complete Blood Count",
//       testCode: "CBC",
//     },
//   },
//   {
//     type: "ORU^R01",
//     data: {
//       sendingFacility: "Facility A",
//       sendingFacilityApplication: "App D",
//       receivingFacility: "Facility D",
//       receivingFacilityApplication: "App E",
//       testResult: "Positive",
//       resultDate: "2024-01-03T14:00:00Z",
//       patientID: "67890",
//       resultStatus: "Final",
//       observationValue: "12.5",
//       valueType: "Numeric",
//       code: "GLU",
//       description: "Glucose Level",
//       codingSystem: "LOINC",
//     },
//   },
// ];

// export default function HL7Display() {
//   return (
//     <div className="flex items-start justify-center w-full mx-auto h-[700px] mt-2">
//       <HL7Accordion messages={hl7Messages} />
//     </div>
//   );
// }

import HL7Accordion from "../components/UI/Accordion";
import { useEffect, useState } from "react";
import axios from "axios";
import ScrollArea from "../components/UI/ScrollArea";

// Define types for HL7 message and API response
type HL7Message = {
  type: string;
  data: Record<string, unknown>; // Replace with a more specific structure if available
};

type HL7ApiResponse = Record<string, unknown[]>; // Define keys as message types and values as arrays of message objects

fetch('../../../backend/hl7_messages.json')
  .then(response => response.json())  // Automatically parses the JSON response
  .then(jsonData => {
    console.log(jsonData);  // Do something with the JSON data
  })
  .catch(error => {
    console.error("Error fetching JSON:", error);
  });

export default function HL7Display() {
  const [hl7Messages, setHl7Messages] = useState<HL7Message[]>([]);

  // Fetch messages from the backend
  const fetchMessages = async () => {
    try {
      const response = await axios.get<HL7ApiResponse>("/hl7_messages.json"); // Replace with your JSON API endpoint
      const data = response.data;

      // Transform messages into a flat array
      const transformedMessages: HL7Message[] = Object.entries(data).flatMap(
        ([type, messages]) =>
          (messages as Record<string, unknown>[]).map((message) => ({
            type,
            data: message,
          }))
      );

      setHl7Messages(transformedMessages);
    } catch (error) {
      console.error("Error fetching HL7 messages:", error);
    }
  };

  // Fetch messages on component mount and periodically
  useEffect(() => {
    fetchMessages();

    // Optionally poll every X seconds
    const interval = setInterval(fetchMessages, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-start justify-center w-full mx-auto h-[700px] mt-2">
      <ScrollArea>
        <HL7Accordion messages={hl7Messages} />
      </ScrollArea>
    </div>
  );
}
