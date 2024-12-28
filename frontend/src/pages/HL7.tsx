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
      content: <ADTForm messageType="ADT^A04" />,
    },
    {
      label: "ORM^O01  Order Message",
      value: "ORM^O01",
      content: <LabTestOrderForm />,
    },
    {
      label: "SCH^S12 Appointment Booking",
      value: "SCH^S12",
      content: <AppointmentBookingForm />,
    },
    {
      label: "ORU^R01  Test Results",
      value: "ORU^R01",
      content: (
        <ScrollArea>
          <TestResultsForm />
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
