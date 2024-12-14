const { PrismaClient } = require('@prisma/client')
const { parseISO, isValid } = require('date-fns');

const prisma = new PrismaClient()

// Patients
const getAllPatients = async (req, res) => {
    const patients = await prisma.patient.findMany();

    if (patients.length === 0) {
        return res.status(400).json({ 'message': 'No patients found' });
    }

    // Fetch the last completed appointment for each patient
    for (let patient of patients) {
        const lastCompletedAppointment = await prisma.visit.findFirst({
            where: { 
                patientId: patient.patientID,
                status: 'Completed'
            },
            orderBy: [
                { date: 'desc' },
                { time: 'desc' }
            ],
            include: {
                Service: true
            }
        });

        // Add the service of the last completed appointment to the patient object
        patient.lastVisitServiceDone = lastCompletedAppointment ? lastCompletedAppointment.Service.ServiceName : null;

        // Format birthDate
        const birthDate = new Date(patient.birthDate);
        patient.birthDate = birthDate.toISOString().split('T')[0];
    }

    res.json(patients);
};

const createNewPatient = async (req, res) => {
    const { fName, lName, PatientSSN, phone, email, password, confirmPassword, gender, Smoker, bloodGroup, address, InsuranceCompany, InsuranceCoverage, birthDate } = req.body;
    console.log(req.body);

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({ 'message': 'Passwords do not match' });
    }

    // Validate birthDate
    const birthDateObj = new Date(birthDate);
    if (isNaN(birthDateObj)) {
        return res.status(400).json({ 'message': 'Invalid birthDate format' });
    }

    // Check if a patient with the given PatientSSN or email already exists
    const existingPatientSSN = await prisma.patient.findUnique({ where: { PatientSSN } });
    const existingPatientEmail = await prisma.patient.findUnique({ where: { email } });

    if (existingPatientSSN) {
        return res.status(400).json({ 'message': 'A patient with this SSN already exists' });
    }

    if (existingPatientEmail) {
        return res.status(400).json({ 'message': 'A patient with this email already exists' });
    }

    // Convert Smoker to boolean
    const isSmoker = Smoker === 'Yes' ? true : false;

    // Create new patient
    const newPatient = {
        PatientSSN,
        fName,
        lName,
        birthDate: birthDateObj.toISOString(),
        age: new Date().getFullYear() - birthDateObj.getFullYear(), // Calculate age based on birthDate
        gender,
        address,
        phone,
        email,
        Smoker: isSmoker, // Pass smoker status to the database
        alcoholIntake: false, // Set default value
        bloodGroup,
        InsuranceCompany, // Pass insurance company to the database
        InsuranceCoverage, // Pass coverage rate to the database
        patientProfile: { // Create ProfileLogin record
            create: {
                username: email,
                password,
                userType: 'Patient',
            },
        },
    };

    try {
        const createdPatient = await prisma.patient.create({
            data: newPatient,
        });
        res.status(201).json(createdPatient);
    } catch (error) {
        console.error(error); // Print the error to the console
        res.status(500).json({ 'message': 'Error creating patient', error });
    }
};

const updatePatient = async (req, res) => {
    const patientId = parseInt(req.body.patientID);
    let birthDate = req.body.birthDate;

    // Check if birthDate is in ISO-8601 DateTime format
    const birthDateObj = new Date(birthDate);
    if (isNaN(birthDateObj)) {
        return res.status(400).json({ 'message': 'Invalid birthDate format' });
    } else {
        // Convert birthDate to ISO-8601 DateTime format
        birthDate = birthDateObj.toISOString();
    }

    // Check if a patient with the given PatientSSN or email already exists
    const existingPatientSSN = await prisma.patient.findUnique({ where: { PatientSSN: req.body.PatientSSN } });
    const existingPatientEmail = await prisma.patient.findUnique({ where: { email: req.body.email } });

    if (existingPatientSSN && existingPatientSSN.patientID !== patientId) {
        return res.status(400).json({ 'message': 'A patient with this SSN already exists' });
    }

    if (existingPatientEmail && existingPatientEmail.patientID !== patientId) {
        return res.status(400).json({ 'message': 'A patient with this email already exists' });
    }

    const updatedPatient = await prisma.patient.update({
        where: { patientID: patientId },
        data: {
            PatientSSN: req.body.PatientSSN,
            fName: req.body.fName,
            lName: req.body.lName,
            birthDate: birthDate,
            age: req.body.age,
            gender: req.body.gender,
            address: req.body.address,
            phone: req.body.phone,
            email: req.body.email,
            Smoker: req.body.Smoker,
            alcoholIntake: req.body.alcoholIntake,
            bloodGroup: req.body.bloodGroup
        }
    });

    // Update the email in the ProfileLogin table
    const updatedProfileLogin = await prisma.profileLogin.update({
        where: { patientId: patientId },
        data: {
            username: req.body.email, // assuming username is the email
        }
    });

    res.json(updatedPatient);
}

const deletePatient = async (req, res) => {
    const patientId = parseInt(req.params.patientId);
  
    try {
    //   // Delete related records in other tables
    //   const patientVisits = await prisma.visit.findMany({ where: { Reserve: { patientID: patientId } } });
  
    //   for (const visit of patientVisits) {
    //     const visitDiagnoses = await prisma.diagnosis.findMany({ where: { visit: { id: visit.id } } });
    //     for (const diagnosis of visitDiagnoses) {
    //       await prisma.treatment.deleteMany({ where: { diagnosisId: diagnosis.DiagnosisID } });
    //       await prisma.imagingResults.deleteMany({ where: { DiagnosisId: diagnosis.DiagnosisID } });
    //     }
    //     await prisma.diagnosis.deleteMany({ where: { visit: { id: visit.id } } });
    //     await prisma.invoice.deleteMany({ where: { visitId: visit.id } });
    //     await prisma.servicesProvided.deleteMany({ where: { serviceId: visit.serviceId } });
    //   }
  
    //   await prisma.visit.deleteMany({ where: { Reserve: { patientID: patientId } } });
    //   await prisma.allergies.deleteMany({ where: { patientId: patientId } });
    //   await prisma.chronicDisease.deleteMany({ where: { patientId: patientId } });
    //   await prisma.procedure.deleteMany({ where: { PatientId: patientId } });
    //   await prisma.profileLogin.deleteMany({ where: { patientId: patientId } });
  
      // Delete the patient record
      const deletedPatient = await prisma.patient.delete({
          where: { patientID: patientId }
      });
  
      res.json(deletedPatient);
    } catch (error) {
      // Handle the error
      console.error(error);
      res.status(500).json({ 'message': 'An error occurred while deleting the patient and related records' });
    }
  }
  
// Doctors
const getAllDoctors = async (req, res) => {
    let doctors = await prisma.dentist.findMany();

    if (doctors.length === 0) {
        return res.status(400).json({ 'message': 'No doctors found' });
    }

    // Add degreeOfSpecialization field and format birthDate for each doctor
    doctors = doctors.map(doctor => ({
        ...doctor,
        degreeOfSpecialization: `${doctor.degree} in ${doctor.specialization}`,
        birthDate: new Date(doctor.birthDate).toISOString().split('T')[0],
    }));

    res.json(doctors);
};

const createNewDoctor = async (req, res) => {
    const { DentistSSN, fName, lName, birthDate, gender, phone, email, specialization, yearsOfExperience, address, degree, personalImageURL, password, confirmPassword, workingDays, workingHours } = req.body;
  
    // First, check if the passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ 'message': 'Passwords do not match' });
    }
  
    // Convert birthDate to a Date object and then to an ISO string
    let birthDateObj = new Date(birthDate);
    let birthDateISO = birthDateObj.toISOString();
  
    // Calculate age from birthDate
    const age = new Date().getFullYear() - birthDateObj.getFullYear();
  
    // Check if a dentist with the given DentistSSN already exists
    const existingDentist = await prisma.dentist.findUnique({
      where: { DentistSSN },
    });
  
    if (existingDentist) {
      return res.status(400).json({ 'message': 'A dentist with this SSN already exists' });
    }
  
    // Create a new dentist in the Dentist table
    const dentist = await prisma.dentist.create({
      data: {
        DentistSSN,
        fName,
        lName,
        birthDate: birthDateISO,
        age,
        gender,
        phone,
        email,
        specialization,
        yearsOfExperience,
        address,
        degree,
        personalImageURL,
        dentistProfile: { // Create ProfileLogin record
          create: {
            username: email,
            password,
            userType: "Dentist",
          },
        },
        workingDays: { // Insert working days into the DentistWorkingDays table
          create: workingDays.map(day => ({ day })),
        },
        workingHours: { // Insert working hours into the DentistWorkingHours table
          create: workingHours.map(shift => ({ shift })),
        },
      },
      include: {
        dentistProfile: true,
        workingDays: true,
        workingHours: true,
      },
    });
  
    // Return a JSON object
    res.json(dentist);
  };
      
  const updateDoctor = async (req, res) => {
    const oldDentistSsn = req.body.oldDentistSSN;
    const newDentistSsn = req.body.newDentistSSN;
    const { fName, lName, phone, specialization, degree, email, gender, address, birthDate } = req.body;

    // If the oldDentistSsn and newDentistSsn are different, update it
    if (oldDentistSsn !== newDentistSsn) {
        // Start a transaction
        const transaction = await prisma.$transaction([
            prisma.dentist.update({
                where: { DentistSSN: oldDentistSsn },
                data: {
                    DentistSSN: newDentistSsn,
                    fName,
                    lName,
                    phone,
                    specialization,
                    degree,
                    gender,
                    address,
                    birthDate
                }
            }),
            prisma.profileLogin.updateMany({
                where: { dentistSsn: oldDentistSsn },
                data: { dentistSsn: newDentistSsn, username: email }
            }),
            prisma.diagnosis.updateMany({
                where: { DentistSsn: oldDentistSsn },
                data: { DentistSsn: newDentistSsn }
            }),
            prisma.treatment.updateMany({
                where: { DentistSsn: oldDentistSsn },
                data: { DentistSsn: newDentistSsn }
            }),
            prisma.dentistWorkingDays.updateMany({
                where: { DentistSsn: oldDentistSsn },
                data: { DentistSsn: newDentistSsn }
            }),
            prisma.dentistWorkingHours.updateMany({
                where: { DentistSsn: oldDentistSsn },
                data: { DentistSsn: newDentistSsn }
            }),
            prisma.visit.updateMany({
                where: { dentistSsn: oldDentistSsn },
                data: { dentistSsn: newDentistSsn }
            })
        ]);

        res.json(transaction);
    } else {
        // If the oldDentistSsn and newDentistSsn are the same, just update the other fields
        const updatedDoctor = await prisma.dentist.update({
            where: { DentistSSN: newDentistSsn },
            data: {
                fName,
                lName,
                phone,
                specialization,
                degree,
                gender,
                address,
                birthDate
            }
        });

        res.json(updatedDoctor);
    }
}

const deleteDoctor = async (req, res) => {
    const dentistSsn = req.body.DentistSSN;

    try {
        // Find related Diagnosis records
        const relatedDiagnoses = await prisma.diagnosis.findMany({
            where: { DentistSsn: dentistSsn }
        });

        // Delete each Diagnosis record
        for (let diagnosis of relatedDiagnoses) {
            await prisma.diagnosis.delete({
                where: { DiagnosisID: diagnosis.DiagnosisID }
            });
        }

        // Find related Treatment records
        const relatedTreatments = await prisma.treatment.findMany({
            where: { DentistSsn: dentistSsn }
        });

        // Delete each Treatment record
        for (let treatment of relatedTreatments) {
            await prisma.treatment.delete({
                where: { TreatmentID: treatment.TreatmentID }
            });
        }

        // Find related Visit records
        const relatedVisits = await prisma.visit.findMany({
            where: { dentistSsn: dentistSsn }
        });

        // Delete each Visit record
        for (let visit of relatedVisits) {
            await prisma.visit.delete({
                where: { id: visit.id }
            });
        }

        // Find related ProfileLogin record
        const relatedProfileLogin = await prisma.profileLogin.findUnique({
            where: { dentistSsn: dentistSsn }
        });

        // Delete ProfileLogin record
        if (relatedProfileLogin) {
            await prisma.profileLogin.delete({
                where: { LoginId: relatedProfileLogin.LoginId }
            });
        }

        // Find related DentistWorkingDays records
        const relatedWorkingDays = await prisma.dentistWorkingDays.findMany({
            where: { DentistSsn: dentistSsn }
        });

        // Delete each DentistWorkingDays record
        for (let workingDay of relatedWorkingDays) {
            await prisma.dentistWorkingDays.delete({
                where: { DentistSsn_day: { DentistSsn: dentistSsn, day: workingDay.day } }
            });
        }

        // Find related DentistWorkingHours records
        const relatedWorkingHours = await prisma.dentistWorkingHours.findMany({
            where: { DentistSsn: dentistSsn }
        });

        // Delete each DentistWorkingHours record
        for (let workingHour of relatedWorkingHours) {
            await prisma.dentistWorkingHours.delete({
                where: { DentistSsn_shift: { DentistSsn: dentistSsn, shift: workingHour.shift } }
            });
        }

        // Finally, delete the Dentist record
        const deletedDoctor = await prisma.dentist.delete({
            where: { DentistSSN: dentistSsn }
        });

        res.json(deletedDoctor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while deleting the doctor and related records." });
    }
}

// Appointments
const getAllAppointments = async (req, res) => {
    const appointments = await prisma.visit.findMany({
        include: {
            Reserve: {
                select: {
                    fName: true,
                    lName: true,
                    email: true,
                    gender: true,
                    phone: true,
                },
            },
            Sets: {
                select: {
                    fName: true,
                    lName: true,
                },
            },
            Service: {
                select: {
                    ServiceName: true,
                },
            },
        },
    });

    if (appointments.length === 0) {
        return res.status(400).json({ 'message': 'No appointments found' });
    }

    // Format the appointments data
    const formattedAppointments = appointments.map(appointment => ({
        ID: appointment.id,
        'Patient Name': `${appointment.Reserve.fName} ${appointment.Reserve.lName}`,
        Email: appointment.Reserve.email,
        Gender: appointment.Reserve.gender,
        Date: new Date(appointment.date).toISOString().split('T')[0],
        Time: appointment.time,
        'Mobile Number': appointment.Reserve.phone,
        'Doctor Name': `${appointment.Sets.fName} ${appointment.Sets.lName}`,
        'Service Name': appointment.Service.ServiceName,
    }));

    res.json(formattedAppointments);
};

const createNewAppointmentAndInvoice = async (req, res) => {
    const { patientId, dentistSsn, date, time, serviceId, employeeSsn } = req.body;

    try {
        // Get the cost of the service
        const service = await prisma.servicesProvided.findUnique({
            where: { ServiceId: serviceId },
            select: { ServiceCost: true }
        });

        // Create a new Visit record
        const visit = await prisma.visit.create({
            data: {
                Reserve: {
                    connect: { patientID: patientId }
                },
                Sets: {
                    connect: { DentistSSN: dentistSsn }
                },
                date: new Date(date),
                time: time,
                Service: {
                    connect: { ServiceId: serviceId }
                },
                status: "Scheduled", // Set the initial status as 'Scheduled'
                Records: {
                    connect: { EmployeeSSN: employeeSsn } // Connect the visit to the employee
                }
            }
        });

        // Create a new Invoice record
        const invoice = await prisma.invoice.create({
            data: {
                Date: new Date(date),
                TotalCost: service.ServiceCost,
                Status: 'UNPAID', // Initialize Status as 'UNPAID'
                visit: {
                    connect: { id: visit.id } // This should be the ID of the newly created visit
                }
            }
        });

        res.status(201).json({ message: "Appointment and associated invoice created successfully." });
    } catch (error) {
        console.error("An error occurred while creating appointment and invoice:", error);
        res.status(500).json({ error: "An error occurred while creating appointment and invoice." });
    }
};

const updateAppointment = async (req, res) => {
    const { id, dentistSsn, date, time, serviceId } = req.body;
    const appointmentId = parseInt(id);

    try {
        // Fetch the current serviceId for the appointment
        const currentAppointment = await prisma.visit.findUnique({
            where: { id: appointmentId },
            select: { serviceId: true }
        });

        // If the serviceId has changed, update the cost in the invoice
        if (currentAppointment.serviceId !== serviceId) {
            const newService = await prisma.servicesProvided.findUnique({
                where: { ServiceId: serviceId },
                select: { ServiceCost: true }
            });

            await prisma.invoice.update({
                where: { visitId: appointmentId },
                data: { TotalCost: newService.ServiceCost }
            });
        }

        // Update the appointment
        const updatedAppointment = await prisma.visit.update({
            where: { id: appointmentId },
            data: {
                Sets: {
                    connect: { DentistSSN: dentistSsn }
                },
                date: new Date(date),
                time: time,
                Service: {
                    connect: { ServiceId: serviceId }
                }
            }
        });

        res.json(updatedAppointment);
    } catch (error) {
        console.error("An error occurred while updating the appointment:", error);
        res.status(500).json({ error: "An error occurred while updating the appointment." });
    }
};

const deleteAppointment = async (req, res) => {
    const appointmentId = parseInt(req.params.id);

    // Delete the visit
    const deletedAppointment = await prisma.visit.delete({
        where: { id: appointmentId }
    });

    res.json(deletedAppointment);
};

// Invoices
const getAllInvoices = async (req, res) => {
    const patientId = Number(req.params.patientId); // Convert patientId to a number

    const invoices = await prisma.invoice.findMany({
      where: {
        visit: {
          patientId: patientId
        }
      },
      include: {
        visit: {
          select: {
            Sets: {
              select: {
                fName: true,
                lName: true,
              },
            },
            Reserve: {
              select: {
                InsuranceCoverage: true,
              },
            },
          },
        },
      },
    });
  
    const invoiceDetails = invoices.map(invoice => {
      const dentistName = `${invoice.visit.Sets.fName} ${invoice.visit.Sets.lName}`;
      const dateOnly = invoice.Date.toISOString().split('T')[0]; // Extract only the date part
      const insuranceCoverage = invoice.visit.Reserve.InsuranceCoverage;
  
      // Calculate the cost after insurance coverage
      const insuranceCoveragePercentage = parseFloat(insuranceCoverage) / 100;
      const costAfterInsuranceCoverage = invoice.TotalCost * (1 - insuranceCoveragePercentage);
  
      return {
        BillingId: invoice.BillingId,
        Date: dateOnly,
        TotalCost: invoice.TotalCost,
        Status: invoice.Status,
        DentistName: dentistName,
        InsuranceCoverage: insuranceCoverage,
        CostAfterInsuranceCoverage: costAfterInsuranceCoverage.toFixed(2), // Round to 2 decimal places
      };
    });
  
    res.json(invoiceDetails);
  };
  
const toggleInvoiceStatus = async (req, res) => {
const invoiceId = Number(req.params.invoiceId); // Get invoiceId from request parameters

try {
    // Find the Invoice record
    const invoice = await prisma.invoice.findUnique({
        where: { BillingId: invoiceId }
    });

      // Toggle the Status field
      const newStatus = invoice.Status === 'PAID' ? 'UNPAID' : 'PAID';
  
      // Update the Invoice record
      const updatedInvoice = await prisma.invoice.update({
          where: { BillingId: invoiceId },
          data: { Status: newStatus }
      });
  
      res.json({ message: "Invoice status updated successfully.", invoice: updatedInvoice });
    } catch (error) {
      console.error("An error occurred while updating invoice status:", error);
      res.status(500).json({ error: "An error occurred while updating invoice status." });
    }
  };  

// Items
const getAllItems = async (req, res) => {
    const items = await prisma.item.findMany({
        include: {
            PurchaseDetails: true,
        },
    });

    if (items.length === 0) {
        return res.status(400).json({ 'message': 'No items found' });
    }

    // Format the items data
    const formattedItems = items.map(item => {
        // Get the supplier for the item
        const supplier = item.Supplier;

        // Get the most recent cost for the item
        const mostRecentCost = item.PurchaseDetails.sort((a, b) => b.PurchaseDate - a.PurchaseDate)[0]?.Cost;

        // Get the total quantity for the item from the currentTotalQuantity field
        const totalQuantity = item.currentTotalQuantity;

        return {
            'Item ID': item.ItemID,
            'Item Name': item.Name,
            'Description': item.Description,
            'Manufacturer': item.Manufacturer,
            'Quantity': totalQuantity,
            'Cost': mostRecentCost,
            'Supplier': supplier,
        };
    });

    res.json(formattedItems);
};

const createItem = async (req, res) => {
    const { Name, Supplier, Manufacturer, Description, Quantity, PurchaseDate, Cost } = req.body;

    try {
        // Create a new Item record
        const newItem = await prisma.item.create({
            data: {
                Name: Name,
                Supplier: Supplier,
                Manufacturer: Manufacturer,
                Description: Description,
                currentTotalQuantity: 0 // Initialize currentTotalQuantity as 0
            }
        });

        // Get the ID of the newly created item
        const itemId = newItem.ItemID;

        // Create a new ItemPurchaseDetails record
        await prisma.itemPurchaseDetails.create({
            data: {
                ItemID: itemId,
                Quantity: Quantity,
                PurchaseDate: new Date(PurchaseDate),
                Cost: Cost
            }
        });

        // Update the currentTotalQuantity field of the Item record
        await prisma.item.update({
            where: { ItemID: itemId },
            data: { currentTotalQuantity: { increment: Quantity } }
        });

        res.json({ message: "Item and associated purchase details created successfully." });
    } catch (error) {
        console.error("An error occurred while creating item and purchase details:", error);
        res.status(500).json({ error: "An error occurred while creating item and purchase details." });
    }
};

const updateItem = async (req, res) => {
    // Convert itemId from string to integer
    const itemId = parseInt(req.params.itemId, 10);
    const { Name, Supplier, Manufacturer, Description } = req.body;
  
    try {
      const updatedItem = await prisma.item.update({
        where: { ItemID: itemId },
        data: { 
          Name: Name,
          Supplier: Supplier,
          Manufacturer: Manufacturer,
          Description: Description
        }
      });
  
      res.json({ message: "Item updated successfully.", item: updatedItem });
    } catch (error) {
      console.error("An error occurred while updating item:", error);
      res.status(500).json({ error: "An error occurred while updating item." });
    }
  };
    
  const deleteItem = async (req, res) => {
    const itemId = parseInt(req.params.itemId, 10); // Convert itemId to integer

    if (isNaN(itemId)) {
        return res.status(400).json({ error: "Invalid itemId parameter. It must be an integer." });
    }

    try {
        // Start a transaction
        const transaction = await prisma.$transaction([
            // Delete all ItemPurchaseDetails records associated with the item
            prisma.itemPurchaseDetails.deleteMany({
                where: { ItemID: itemId }
            }),
            // Delete the Item record
            prisma.item.delete({
                where: { ItemID: itemId }
            })
        ]);

        res.json({ message: "Item and associated purchase details deleted successfully." });
    } catch (error) {
        console.error("An error occurred while deleting item and purchase details:", error);
        res.status(500).json({ error: "An error occurred while deleting item and purchase details." });
    }
};

const getItemPurchaseDetails = async (req, res) => {
    // Get itemId from request parameters and convert it to integer
    const itemId = parseInt(req.params.itemId, 10);
  
    try {
      // Find all ItemPurchaseDetails records associated with the item
      const purchaseDetails = await prisma.itemPurchaseDetails.findMany({
        where: { ItemID: itemId },
        select: {
          PurchaseID: true,
          PurchaseDate: true,
          Cost: true,
          Quantity: true
        }
      });
  
      if (purchaseDetails.length === 0) {
        return res.status(400).json({ 'message': 'No purchase details found for this item' });
      }
  
      // Format the PurchaseDate to only include the date part
      const formattedPurchaseDetails = purchaseDetails.map(detail => ({
        ...detail,
        PurchaseDate: detail.PurchaseDate.toISOString().split('T')[0]
      }));
  
      res.json(formattedPurchaseDetails);
    } catch (error) {
      console.error("An error occurred while retrieving item purchase details:", error);
      res.status(500).json({ error: "An error occurred while retrieving item purchase details." });
    }
  };
  
  const createPurchase = async (req, res) => {
    const { quantity, cost, purchaseDate } = req.body;
    const { itemId } = req.params; // Get itemId from request parameters

    try {
        // Create a new ItemPurchaseDetails record
        await prisma.itemPurchaseDetails.create({
            data: {
                ItemID: parseInt(itemId, 10), // Convert itemId to number
                Quantity: quantity,
                Cost: cost,
                PurchaseDate: new Date(purchaseDate)
            }
        });

        // Find the related Item record
        const item = await prisma.item.findUnique({
            where: { ItemID: parseInt(itemId, 10) } // Convert itemId to number
        });

        // Update the currentTotalQuantity field of the Item record
        await prisma.item.update({
            where: { ItemID: parseInt(itemId, 10) }, // Convert itemId to number
            data: { currentTotalQuantity: item.currentTotalQuantity + quantity }
        });

        res.json({ message: "Purchase created and item quantity updated successfully." });
    } catch (error) {
        console.error("An error occurred while creating purchase and updating item quantity:", error);
        res.status(500).json({ error: "An error occurred while creating purchase and updating item quantity." });
    }
};

const decrementItemQuantity = async (req, res) => {
    const { itemId } = req.body;

    try {
        // Find the Item record
        const item = await prisma.item.findUnique({
            where: { ItemID: itemId }
        });

        // Check if the item's currentTotalQuantity is greater than 0
        if (item.currentTotalQuantity > 0) {
            // Decrement the currentTotalQuantity field of the Item record
            await prisma.item.update({
                where: { ItemID: itemId },
                data: { currentTotalQuantity: item.currentTotalQuantity - 1 }
            });

            res.json({ message: "Item quantity decremented successfully." });
        } else {
            res.status(400).json({ error: "Item quantity cannot be less than 0." });
        }
    } catch (error) {
        console.error("An error occurred while decrementing item quantity:", error);
        res.status(500).json({ error: "An error occurred while decrementing item quantity." });
    }
}

// Services
const updateServiceCosts = async (req, res) => {
    const { examinationCost, consultationCost, surgeryCost } = req.body;

    try {
        // Upsert ServiceCost where ServiceId = 1
        await prisma.servicesProvided.upsert({
            where: { ServiceId: 1 },
            update: { ServiceCost: examinationCost },
            create: {
                ServiceId: 11,
                ServiceName: "Examination",
                ServiceCost: examinationCost
            }
        });

        // Upsert ServiceCost where ServiceId = 2
        await prisma.servicesProvided.upsert({
            where: { ServiceId: 2 },
            update: { ServiceCost: consultationCost },
            create: {
                ServiceId: 12,
                ServiceName: "Consultation",
                ServiceCost: consultationCost
            }
        });

        // Upsert ServiceCost where ServiceId = 3
        await prisma.servicesProvided.upsert({
            where: { ServiceId: 3 },
            update: { ServiceCost: surgeryCost },
            create: {
                ServiceId: 13,
                ServiceName: "Surgery",
                ServiceCost: surgeryCost
            }
        });

        res.json({ message: "Service costs updated successfully." });
    } catch (error) {
        console.error("An error occurred while updating service costs:", error);
        res.status(500).json({ error: "An error occurred while updating service costs." });
    }
}

module.exports = {
    getAllPatients,
    createNewPatient,
    updatePatient,
    deletePatient,
    getAllDoctors,
    createNewDoctor,
    updateDoctor,
    deleteDoctor,
    getAllAppointments,
    createNewAppointmentAndInvoice,
    updateAppointment,
    deleteAppointment,
    getAllInvoices,
    toggleInvoiceStatus,
    getAllItems,
    createItem,
    updateItem,
    deleteItem,
    decrementItemQuantity,
    getItemPurchaseDetails,
    createPurchase,
    updateServiceCosts
}