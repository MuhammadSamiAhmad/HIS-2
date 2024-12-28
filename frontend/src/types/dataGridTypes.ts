//patients table
export type PatientUpcomingVisitRow = {
  id: number;
  dentistName: string;
  dentistImage: string;
  category: string;
  dateTime: string;
  paymentStatus: string;
};

export type PatientPastVisitRow = {
  id: number;
  dentistName: string;
  dentistImage: string;
  category: string;
  dateTime: string;
};

export type PatientInvoiceRow = {
  id: number;
  category: string;
  treatment: string;
  dateTime: string;
  paymentStatus: string;
  insuranceCoverage: string;
};

//doctors table
export type DoctorAppointmentRow = {
  id: number;
  patientName: string;
  patientImage: string;
  category: string;
  dateTime: string;
};

export type DoctorPatientRow = {
  id: number;
  patientName: string;
  patientImage: string;
  age: number;
  gender: string;
  bloodGroup: string;
};
//admin table
export type AdminAppointmentRow = {
  id: number;
  patientName: string;
  dentistName: string;
  dateTime: string;
  status: string;
  category: string;
};

export type AdminInventoryRow = {
  id: number;
  equipmentName: string;
  equipmentImage: string;
  equipmentQuantity: number;
  equipmentBrand: string;
};

export type AdminPatientsRow = {
  id: number;
  patientName: string;
  patientImage: string;
  age: number;
  gender: string;
  bloodGroup: string;
};

export type AdminDoctorRow = {
  id: number;
  doctorName: string;
  doctorImage: string;
  age: number;
  gender: string;
  status: string;
  email: string;
};

export type TabData = {
  label: string;
  value: string;
};

type Tab = {
  label: string;
  value: string;
  content: React.ReactNode;
};

export type TabsProps = {
  tabs: Tab[];
};
