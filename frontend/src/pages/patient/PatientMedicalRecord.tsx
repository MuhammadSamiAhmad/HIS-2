import { useMedicalStore } from "../../store/medicalRecordStore";
import { mockEntries as mockData } from "../../utils/mockDentalHistory";
import ScrollArea from "../../components/UI/ScrollArea";
import RenderEditableField from "../../components/RenderEditableField"; // Import the reusable component

export default function PatientMedicalRecord() {
  const {
    medicalRecord,
    pendingChanges,
    clearPendingChanges,
    setEditingField,
  } = useMedicalStore();

  const handleSubmit = () => {
    try {
      const updatedMedicalRecord = {
        ...medicalRecord,
        ...pendingChanges,
      };

      console.log(
        "Updated Medical Record:",
        JSON.stringify(updatedMedicalRecord, null, 2)
      );

      clearPendingChanges();
      setEditingField(null);

      alert("Mock save successful! Check the console for updated data.");
    } catch (error) {
      console.error("Error submitting changes:", error);
      alert("An error occurred during mock save.");
    }
  };

  return (
    <div className="w-full mx-auto bg-white shadow rounded-lg font-manrope">
      <div className="grid grid-cols-2 gap-6 p-8">
        <RenderEditableField fieldName="age" label="Age" />
        <RenderEditableField fieldName="gender" label="Gender" />
        <RenderEditableField fieldName="smoker" label="Smoker" />
        <RenderEditableField fieldName="bloodGroup" label="Blood Group" />
        <RenderEditableField
          fieldName="alcoholConsumption"
          label="Alcohol Consumption"
        />
        <div className="col-span-2">
          <RenderEditableField fieldName="allergies" label="Allergies" />
        </div>
        <div className="col-span-2">
          <RenderEditableField
            fieldName="chronicDiseases"
            label="Chronic Diseases"
          />
        </div>
      </div>

      {Object.keys(pendingChanges).length > 0 && (
        <div className="mt-6">
          <button
            type="button"
            onClick={handleSubmit}
            className="ml-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Submit Changes
          </button>
        </div>
      )}

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
                  <td className="px-4 py-3 text-sm  font-medium">{row.date}</td>
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
  );
}
