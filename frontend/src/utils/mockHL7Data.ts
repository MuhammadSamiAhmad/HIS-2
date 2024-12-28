// Types for better type safety
export interface Patient {
  id: number;
  patientName: string;
  firstName: string;
  lastName: string;
  patientImage: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  bloodGroup: string;
  address: string;
  phone: string;
  allergies: string;
  insuranceNumber?: string;
  emergencyContact?: string;
}

export const patients: Patient[] = [
  {
    id: 1,
    patientName: "John Smith",
    firstName: "John",
    lastName: "Smith",
    patientImage: "../assets/images/IMG_1250-2.jpg",
    dateOfBirth: "1989-03-15",
    age: 35,
    gender: "M",
    bloodGroup: "A+",
    address: "123 Main St, Cityville, ST 12345",
    phone: "(555) 123-4567",
    allergies: "Penicillin",
    insuranceNumber: "INS123456",
    emergencyContact: "(555) 987-6543",
  },
  {
    id: 2,
    patientName: "Emily Johnson",
    firstName: "Emily",
    lastName: "Johnson",
    patientImage: "/avatars/patient2.jpg",
    dateOfBirth: "1996-08-22",
    age: 28,
    gender: "F",
    bloodGroup: "O-",
    address: "456 Oak Ave, Townsburg, ST 67890",
    phone: "(555) 234-5678",
    allergies: "None",
    insuranceNumber: "INS789012",
    emergencyContact: "(555) 876-5432",
  },
  {
    id: 3,
    patientName: "Michael Brown",
    firstName: "Michael",
    lastName: "Brown",
    patientImage: "/avatars/patient3.jpg",
    dateOfBirth: "1979-11-30",
    age: 45,
    gender: "M",
    bloodGroup: "B+",
    address: "789 Pine Rd, Villageton, ST 34567",
    phone: "(555) 345-6789",
    allergies: "Sulfa, Peanuts",
    insuranceNumber: "INS345678",
    emergencyContact: "(555) 765-4321",
  },
];
