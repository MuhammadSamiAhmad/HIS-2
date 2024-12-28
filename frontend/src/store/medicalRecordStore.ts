import { create } from "zustand";
import { medicalRecordStore } from "../types/medicalRecordTypes";

export const useMedicalStore = create<medicalRecordStore>((set) => ({
  medicalRecord: {
    age: 22,
    gender: "Male",
    smoker: "Yes",
    alcoholConsumption: "Mild",
    bloodGroup: "O+",
    allergies: "Nuts; Chocolate",
    chronicDiseases: "Diabetes",
  },
  pendingChanges: {}, // Store unsaved changes
  editingField: null,
  //spreads the medicalRecord object and update the specified field with the value and place it in the pendingChanges to be saved later on.
  updateField: (fieldName, value) =>
    set((state) => ({
      medicalRecord: { ...state.medicalRecord, [fieldName]: value },
      pendingChanges: { ...state.pendingChanges, [fieldName]: value }, // Track changes
    })),
  setEditingField: (field) => set({ editingField: field }),
  clearPendingChanges: () => set({ pendingChanges: {} }), // Reset changes after submit
}));
