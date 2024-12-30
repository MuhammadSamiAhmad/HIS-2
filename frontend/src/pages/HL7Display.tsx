import HL7Accordion from "../components/UI/Accordion";

const hl7Messages = [
  {
    type: "ADT^A04",
    data: {
      sendingFacility: "Facility A",
      sendingFacilityApplication: "App A",
      receivingFacility: "Facility B",
      receivingFacilityApplication: "App B",
      patientID: "12345",
      patientName: "John Doe",
      dob: "1985-04-12",
      gender: "Male",
      address: "123 Main St, City, State",
      phone: "+123456789",
      allergyType: "Drug",
      allergySeverity: "High",
      allergyReaction: "Rash",
    },
  },
  {
    type: "SCH^S12",
    data: {
      sendingFacility: "Facility A",
      receivingFacility: "Facility B",
      appointmentID: "APPT12345",
      startTime: "2024-01-01T10:00:00Z",
      endTime: "2024-01-01T10:30:00Z",
      duration: "30 minutes",
      practitionerName: "Dr. Jane Smith",
      appointmentType: "Consultation",
      status: "Scheduled",
    },
  },
  {
    type: "ORM^O01",
    data: {
      sendingFacility: "Facility A",
      sendingFacilityApplication: "App A",
      receivingFacility: "Facility C",
      receivingFacilityApplication: "App C",
      orderControlCode: "NW", // New Order
      orderID: "ORDER12345",
      fillerOrderNumber: "FILLER54321",
      orderDate: "2024-01-02T08:00:00Z",
      orderingProvider: "Dr. Emily Carter",
      testName: "Complete Blood Count",
      testCode: "CBC",
    },
  },
  {
    type: "ORU^R01",
    data: {
      sendingFacility: "Facility A",
      sendingFacilityApplication: "App D",
      receivingFacility: "Facility D",
      receivingFacilityApplication: "App E",
      testResult: "Positive",
      resultDate: "2024-01-03T14:00:00Z",
      patientID: "67890",
      resultStatus: "Final",
      observationValue: "12.5",
      valueType: "Numeric",
      code: "GLU",
      description: "Glucose Level",
      codingSystem: "LOINC",
    },
  },
];

fetch('../../../backend/hl7_messages.json')
  .then(response => response.json())  // Automatically parses the JSON response
  .then(jsonData => {
    console.log(jsonData);  // Do something with the JSON data
  })
  .catch(error => {
    console.error("Error fetching JSON:", error);
  });

export default function HL7Display() {
  return (
    <div className="flex items-start justify-center w-full mx-auto h-[700px] mt-2">
      <HL7Accordion messages={hl7Messages} />
    </div>
  );
}
