// Define the mock user accounts
export const MOCK_USERS = {
  patient: {
    id: "p1",
    email: "patient@test.com",
    password: "patient123",
    username: "John Patient",
    role: "patient" as const,
    phoneNumber: "+1234567890",
    dateOfBirth: "1990-01-01",
    address: "123 Patient St, Medical City",
    profileImage: "/path/to/patient-image.jpg", // Add this field
  },
  doctor: {
    id: "d1",
    email: "doctor@test.com",
    password: "doctor123",
    username: "Dr. Jane Smith",
    role: "doctor" as const,
    specialty: "Cardiology",
    licenseNumber: "MED123456",
    phoneNumber: "+1987654321",
    availableHours: "9:00 AM - 5:00 PM",
    profileImage: "/path/to/doctor-image.jpg", // Add this field
  },
  admin: {
    id: "a1",
    email: "admin@test.com",
    password: "admin123",
    username: "Admin User",
    role: "admin" as const,
    department: "Hospital Management",
    employeeId: "ADM001",
    accessLevel: "Full",
    profileImage: "/path/to/admin-image.jpg", // Add this field
  },
};

// Mock authentication function
export const signInUser = async (
  email: string,
  password: string
): Promise<{ user: any; token: string }> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Find user by email
  const user = Object.values(MOCK_USERS).find((u) => u.email === email);

  // Check if user exists and password matches
  if (!user || user.password !== password) {
    throw new Error("Invalid email or password");
  }

  // Create a mock token (in reality, this would be a JWT from your backend)
  const token = `mock-jwt-${user.role}-${Date.now()}`;

  // Remove password from user object before returning
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
  };
};

// Helper function to check if token is valid
export const validateToken = (token: string): boolean => {
  return token.startsWith("mock-jwt-");
};
