import ScrollArea from "../components/UI/ScrollArea";
import Tabs from "../components/UI/Tabs";
import ADTForm from "./employee/ADTForm";
import AppointmentBookingForm from "./employee/AppointmentBookingForm";
import LabTestOrderForm from "./employee/LabTestOrderForm";
import TestResultsForm from "./employee/TestResultsForm";

export default function HL7() {
  const tabs = [
    {
      label: "ADT Form",
      value: "ADT^A04",
      content: (
        <ScrollArea>
          <ADTForm messageType="ADT^A04" />
        </ScrollArea>
      ),
    },
    {
      label: "ORM^O01  Order Message",
      value: "ORM^O01",

      content: (
        <ScrollArea>
          <LabTestOrderForm messageType="ORM^O01" />
        </ScrollArea>
      ),
    },
    {
      label: "SCH^S12 Appointment Booking",
      value: "SCH^S12",
      content: (
        <ScrollArea>
          <AppointmentBookingForm messageType="SCH^S12" />
        </ScrollArea>
      ),
    },
    {
      label: "ORU^R01  Test Results",
      value: "ORU^R01",
      content: (
        <ScrollArea>
          <TestResultsForm messageType="ORU^R01" />
        </ScrollArea>
      ),
    },
  ];
  return (
    <div className="w-full h-full mx-auto font-manrope">
      <Tabs tabs={tabs} />
    </div>
  );
}
