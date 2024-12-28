import SlidingDialog from "../../components/UI/SlidingDialog";
import Expand from "../../assets/images/export.svg";
import { mockEntries as mockData } from "../../utils/mockDentalHistory";
import ScrollArea from "../../components/UI/ScrollArea";
import RenderEditableField from "../../components/RenderEditableField"; // Import the reusable component

const DoctorPatientsDialog = () => {
  return (
    <SlidingDialog
      trigger={
        <button className="w-[80px] px-1 py-0 flex gap-1 items-center bg-Silver-4 text-textColor rounded-md hover:bg-callToAction-300">
          <p className="text-sm text-Silver-1">Expand</p>{" "}
          <img className="p-0 size-3" src={Expand} alt="expand" />
        </button>
      }
      title="Patient Info"
    >
      <div className="w-full mx-auto bg-white shadow rounded-lg font-manrope">
        <div className="grid grid-cols-2 gap-6 p-8">
          <RenderEditableField fieldName="age" label="Age" readOnly />
          <RenderEditableField fieldName="gender" label="Gender" readOnly />
          <RenderEditableField fieldName="smoker" label="Smoker" readOnly />
          <RenderEditableField
            fieldName="bloodGroup"
            label="Blood Group"
            readOnly
          />
          <RenderEditableField
            fieldName="alcoholConsumption"
            label="Alcohol Consumption"
            readOnly
          />
          <div className="col-span-2">
            <RenderEditableField
              fieldName="allergies"
              label="Allergies"
              readOnly
            />
          </div>
          <div className="col-span-2">
            <RenderEditableField
              fieldName="chronicDiseases"
              label="Chronic Diseases"
              readOnly
            />
          </div>
        </div>

        <hr className="border-2 border-Silver-2 w-full my-5" />
        <ScrollArea>
          <div id="table" className="h-[380px]">
            <table className="w-full min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-bold text-textColor">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-textColor">
                    Treatment
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-textColor">
                    Diagnosis
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-textColor">
                    Affected Tooth
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-textColor">
                    Medications
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {mockData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm  font-medium">
                      {row.date}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {row.treatment}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      <span>{row.diagnosis}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {row.affectedTooth}
                    </td>
                    <td className="px-4 py-3">
                      <span>{row.medications}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </div>
    </SlidingDialog>
  );
};

export default DoctorPatientsDialog;
