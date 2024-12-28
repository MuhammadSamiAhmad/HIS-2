export type MedicalRecord = {
  age: number;
  gender: string;
  smoker: string;
  alcoholConsumption: string;
  bloodGroup: string;
  allergies: string;
  chronicDiseases: string;
};

export type EditableField = {
  fieldName: keyof MedicalRecord;
  isEditing: boolean;
};

export type medicalRecordStore = {
  medicalRecord: MedicalRecord;
  editingField: EditableField | null;
  updateField: (fieldName: keyof MedicalRecord, value: string | number) => void;
  setEditingField: (field: EditableField | null) => void;
  clearPendingChanges: () => void; // Resets pendingChanges to an empty object
  pendingChanges: Partial<MedicalRecord>; // Tracks only the fields being updated
};
