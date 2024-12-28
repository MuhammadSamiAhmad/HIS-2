import React from "react";
import { Pencil } from "lucide-react";
import { useMedicalStore } from "../store/medicalRecordStore";
import { MedicalRecord } from "../types/medicalRecordTypes";

interface EditableFieldProps {
  fieldName: keyof MedicalRecord; // Update to match your medicalRecord type
  label: string;
  readOnly?: boolean; // New prop to toggle between editable and static modes
}

export default function RenderEditableField({
  fieldName,
  label,
  readOnly,
}: EditableFieldProps) {
  const {
    medicalRecord,
    pendingChanges,
    editingField,
    updateField,
    setEditingField,
  } = useMedicalStore();

  const handleEdit = () => {
    if (editingField?.fieldName === fieldName) {
      setEditingField(null); // Exit edit mode if already editing
    } else {
      setEditingField({ fieldName, isEditing: true }); // Enter edit mode for selected field
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      fieldName === "age" ? parseInt(e.target.value) || 0 : e.target.value;
    updateField(fieldName, value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setEditingField(null); // Exit edit mode on Enter
    }
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="text-gray-700 font-bold">{label}</div>
      <div className="flex items-center">
        {editingField?.fieldName === fieldName && !readOnly ? (
          <input
            type="text"
            value={
              pendingChanges[fieldName] ??
              (medicalRecord[fieldName] as string | number)
            }
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            autoFocus
            className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring focus:ring-blue-300 text-gray-900"
          />
        ) : (
          <span className="text-gray-900">
            {pendingChanges[fieldName] ??
              (medicalRecord[fieldName] as string | number)}
          </span>
        )}
        {!readOnly && (
          <button
            type="button"
            onClick={handleEdit}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            <Pencil className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
