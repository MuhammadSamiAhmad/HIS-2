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
      value: "adt",
      content: (
        <>
          <ADTForm />
        </>
      ),
    },
    {
      label: "ORM^O01  Order Message",
      value: "orm",
      content: (
        <>
          <LabTestOrderForm />
        </>
      ),
    },
    {
      label: "SCH^S12 Appointment Booking",
      value: "sch",
      content: <AppointmentBookingForm />,
    },
    {
      label: "ORU^R01  Test Results",
      value: "oru",
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
