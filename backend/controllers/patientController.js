const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
// const PDFDocument = require("pdfkit");
// const fs = require("fs");
// const { connect } = require("http2");

const prisma = new PrismaClient();

function getAge(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

const getPatient = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "patient ID required." });

  const patient = await prisma.patient.findUnique({ patientID: req.params.id });
  if (!patient) {
    return res
      .status(204)
      .json({ message: `No patient matches ID ${req.params.id}.` });
  }
  res.json(patient);
};

const registerNewPatient = async (req, res) => {
  // const {SSN} = req.body
  const {
    firstName,
    lastName,
    username,
    phoneNumber,
    email,
    birthDate,
    gender,
    password,
  } = req.body;

  try {
    // Check if email already exists
    const existingEmail = await prisma.patient.findUnique({
      where: { email: email },
    });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists." });
    }
    const SSN = `SSN${username}`;
    // // Check if SSN already exists
    // const existingSSN = await prisma.patient.findUnique({ where: { PatientSSN: SSN } })
    // if (existingSSN) {
    //     return res.status(400).json({ message: 'SSN already exists.' })
    // }

    // Validate password strength (minimum length)
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long." });
    }
    console.log(birthDate);
    // const nameParts = fullName.trim().split(/\s+/);
    const result = await prisma.patient.create({
      data: {
        PatientSSN: SSN,
        fName: firstName.trim(),
        lName: lastName.trim(),
        // birthDate: new Date(birthDate).toISOString(),
        birthDate: new Date(birthDate),
        age: getAge(birthDate),
        gender: gender,
        // address: address,
        phone: phoneNumber,
        email: email,
        // Smoker: smokingStatusBool,
        // alcoholIntake: alcoholStatusBool,
        // bloodGroup: bloodGroup,
      },
    });
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.profileLogin.create({
      data: {
        username: username,
        password: hashedPassword,
        userType: "patient",
        patientId: result.patientID,
      },
    });

    res.json({ message: "Patient registered successfully." });
    // res.json(req.body)
  } catch (error) {
    console.error("Error registering patient:", error);
    res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client
  }
};

const updatePatient = async (req, res) => {
  // console.log(req.body)
  // console.log(req.params)
  const {
    userName,
    firstName,
    lastName,
    email,
    address,
    contact,
    currentPassword,
    newPassword,
  } = req.body;
  const patientId = parseInt(req.params.patientId);
  try {
    const foundUser = await prisma.profileLogin.findFirst({
      where: { username: userName },
    });
    const match = await bcrypt.compare(currentPassword, foundUser.password);
    if (!match) {
      return res.sendStatus(401);
    } // current password is incorrect

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedProfile = await prisma.profileLogin.update({
      where: { patientId: patientId },
      data: {
        username: userName,
        password: hashedPassword,
      },
    });
    const updatedUser = await prisma.patient.update({
      where: { patientID: patientId },
      data: {
        fName: firstName,
        lName: lastName,
        email: email,
        address: address,
        phone: contact,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Error registering patient:", error);
    res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client
  }
};

const getPatientProfile = async (req, res) => {
  const patient = req.query.user;
  const patientId = parseInt(patient.patientID);
  try {
    const foundProfile = await prisma.profileLogin.findFirst({
      where: { patientId: patientId },
    });
    res.json(foundProfile.username);
  } catch (error) {
    console.error("Error registering patient:", error);
    res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client
  }
};

// -----------------------------------------Appointment---------------------------------------
const bookAppointment = async (req, res) => {
  const { data, appointmentTime } = req.body;
  const { dateOfAppointment, doctor, email, visitReason } = data;
  try {
    const [fName, lName] = doctor.split(" ");
    const patient = await prisma.patient.findUnique({
      where: { email: email },
    });
    const dentist = await prisma.dentist.findFirst({
      where: { fName: fName, lName: lName },
    });

    if (!patient || !dentist) {
      return res.status(404).json({ message: "Patient or dentist not found." });
    }

    // Use a transaction for atomic operations
    const result = await prisma.$transaction(async (prisma) => {
      // Create a visit
      const visit = await prisma.visit.create({
        data: {
          date: new Date(dateOfAppointment),
          time: appointmentTime,
          status: "Scheduled",
          patientId: patient.patientID,
          dentistSsn: dentist.dentistSSN,
          serviceName: visitReason,
        },
      });
      const cost = visitReason==="Examination"?300.0:visitReason==="Surgery"?1000.0:100.0;
      // If the service requires an automatic invoice creation
      if (visitReason === "Examination") {
        await prisma.invoice.create({
          data: {
            date: new Date(),
            totalCost: cost,
            status: "Unpaid",
            visit: {
              connect: { id: visit.id } // Replace `id` with the unique field of your `Visit` model
            },
            patientInvoice:{
              connect: {patientID: patient.patientID}
            }
          },
        });
      }

      return visit;
    });

    res.json({ success: true, visit: result });
  } catch (error) {
    console.error("Error creating patient reservation:", error);
    res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client
  }
};

const bookAppointmentDentistsOptions = async (req, res) => {
  try {
    const dentistsArrays = await getAllDentistData();
    res.json(dentistsArrays);
  } catch (error) {
    console.error("Error fetching dentist data:", error);
    res
      .status(500)
      .json({ message: "Unable to fetch dentist data." });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client
  }
};

const getAllDentistData = async () => {
  try {
    // Fetch all dentists with their schedules
    const dentists = await prisma.dentist.findMany({
      include: {
        schedules: {
          select: { day: true, startTime: true, endTime: true },
        },
      },
    });

    // Fetch all reserved appointments
    const appointments = await prisma.visit.findMany({
      where: { status: "Scheduled" },
      select: { date: true, time: true, dentistSsn: true },
    });

    // Initialize arrays to collect data
    const names = [];
    const imagesURL = [];
    const daysAndSlots = [];
    const reservedSlots = [];

    // Process each dentist
    dentists.forEach((dentist) => {
      // Collect dentist's name and image URL
      names.push(`${dentist.fName} ${dentist.lName}`);
      imagesURL.push(dentist.personalImageURL || "No Image Available");

      // Generate schedules with time slots
      const dentistDaysAndSlots = dentist.schedules.map((schedule) => {
        const slots = generateTimeSlots(schedule.startTime, schedule.endTime);
        return { day: schedule.day, slots };
      });

      daysAndSlots.push(dentistDaysAndSlots);

      // Collect all reserved slots for the dentist
      const dentistReservedSlots = appointments
        .filter((appt) => appt.dentistSsn === dentist.dentistSSN)
        .map((appt) => ({ date: appt.date.toISOString().split("T")[0], time: appt.time }));

      reservedSlots.push(dentistReservedSlots);
    });

    // Return the structured data
    return { names, imagesURL, daysAndSlots, reservedSlots };
  } catch (error) {
    console.error("Error fetching dentist data:", error);
    throw new Error("Unable to fetch dentist data.");
  }
};

const cancelAppointment = async (req, res) => {
  const appointmentId = parseInt(req.params.id);
  try {
    res.json(true);
    deleteInvoice = await prisma.invoice.delete({
      where: { visitId: appointmentId },
    });
    const cancelledAppointment = await prisma.visit.update({
      where: { id: appointmentId },
      data: {
        status: "Cancelled",
      },
    });
  } catch (error) {
    console.error("Error Cancelling appointment:", error);
    res
    .status(500)
    .json({ message: "An error occurred while processing your request." });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client
  }
};

const deleteAppointment = async (req, res) => {
  const appointmentId = parseInt(req.params.id);
  try {
    deleteVisit = await prisma.visit.delete({ where: { id: appointmentId } });
    res.json(true);
  } catch (error) {
    console.error("Error Deleting appointment:", error);
    res
    .status(500)
    .json({ message: "An error occurred while processing your request." });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client
  }
};

const getAppointments = async (req, res) => {
  const patient = JSON.parse(req.query.patient);
  const { patientID } = patient;
  try {
    const upcomingAppointments = await prisma.visit.findMany({
      where: { status: "Scheduled", patientId: patientID },
      include: { sets: true },
    });
    const cancelledAppointments = await prisma.visit.findMany({
      where: { status: "Cancelled", patientId: patientID },
      include: { Sets: true },
    });
    const completedAppointments = await prisma.visit.findMany({
      where: { status: "Completed", patientId: patientID },
      include: { Sets: true },
    });
    const scheduledAppointmentsDetails =
    await getRequiredAppointmentsAttributes(upcomingAppointments);
    const cancelledAppointmentsDetails =
    await getRequiredAppointmentsAttributes(cancelledAppointments);
    const completedAppointmentsDetails =
    await getRequiredAppointmentsAttributes(completedAppointments);
    const allAppointments = {
      scheduledAppointmentsDetails,
      cancelledAppointmentsDetails,
      completedAppointmentsDetails,
    };
    // console.log(allAppointments)
    // console.log(scheduledAppointmentsDetails)
    res.json(allAppointments);
  } catch (error) {
    console.error("Error registering patient:", error);
    res
    .status(500)
    .json({ message: "An error occurred while processing your request." });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client
  }
};

async function getRequiredAppointmentsAttributes(appointmentsList) {
  const appointmentsDetails = [];
  
  if (appointmentsList.length > 0) {
    for (const visit of appointmentsList) {
      const { id, date, time, sets: dentist, serviceName, invoice } = visit;
      const dentistName = `Dr. ${dentist.fName} ${dentist.lName}`;
      const appointmentDate = date.toISOString().split("T")[0];
      const startTime = time.split("-")[0]; // Extract start time
      const appointmentTime = startTime.replace(/^0+/, ""); // Remove leading zeros
      const appointmentDateTime = `${appointmentDate}, ${appointmentTime}`;
      const category = serviceName;
      const paymentStatus = invoice?.status || "Unpaid";
      
      appointmentsDetails.push({
        id,
        dentistName,
        appointmentDateTime,
        category,
        paymentStatus,
      });
    }
  }
  
  return appointmentsDetails;
};

const editAppointments = async (req, res) => {
  console.log(req.body);
  const { values, appointmentTime, visitID } = req.body;
  const { doctor, service, dateOfAppointment } = values;
  const [fName, lName] = doctor.split(" ");
  try {
    const dentist = await prisma.dentist.findFirst({
      where: { fName: fName, lName: lName },
    });
    const result = await prisma.visit.update({
      where: { id: visitID },
      data: {
        date: new Date(dateOfAppointment),
        time: appointmentTime,
        dentistSsn: dentist.dentistSSN,
        serviceName: service,
      },
    });
    
    const previousInvoice = await prisma.invoice.findFirst({
      where: {
        visitId: result.id, // Assuming visitId is the ID of the updated visit
      },
    });
    
    if (previousInvoice) {
      if(service == "Examination"){
      // 2. Update the fields of the previous invoice
      const updatedInvoice = await prisma.invoice.update({
        where: {
          billingId: previousInvoice.billingId, // Use the ID of the previous invoice
        },
        data: {
          // Update the fields of the invoice as needed
          date: new Date(),
          totalCost: 300.0,
        },
      });
    }
    console.log("invoice updated");
    }
    res.json(true);
  } catch (error) {
    console.error("Error registering patient:", error);
    res
    .status(500)
    .json({ message: "An error occurred while processing your request." });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client
  }
};

// ------------Helper functions---------
const generateTimeSlots = (startTime, endTime) => {
  const slots = [];
  let current = new Date(`1970-01-01T${convertTo24Hour(startTime)}:00`);
  const end = new Date(`1970-01-01T${convertTo24Hour(endTime)}:00`);

  while (current < end) {
    const next = new Date(current.getTime() + 60 * 60 * 1000); // Add 1 hour
    slots.push( `${formatTo12Hour(current)} - ${formatTo12Hour(next)}`
  );
    current = next;
  }

  return slots;
};

// Helper to convert 12-hour time to 24-hour format
const convertTo24Hour = (time) => {
  const [hour, minute, period] = time.match(/(\d+):(\d+)\s?(AM|PM)/).slice(1);
  let hours = parseInt(hour, 10);
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, "0")}:${minute}`;
};

// Helper to format 24-hour time back to 12-hour format
const formatTo12Hour = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  const adjustedHours = hours % 12 || 12;
  return `${adjustedHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${period}`;
};

// -----------------------------------------Medical Records---------------------------------------
const getMedicalRecords = async (req, res) => {
  const patient = JSON.parse(req.query.patient);
  try {
    const medicalRecords = await getPatientMedicalRecords(patient.patientID);
    res.status(200).json(medicalRecords);
  } catch (error) {
    console.error("Error fetching records:", error);
    res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client
  }
};

// async function getPatientMedicalRecords(patientId) {
//   try {
//     // Fetch the patient's medical records with the specified attributes
//     const medicalRecords = await prisma.diagnosis.findMany({
//       where: {
//         patientId: patientId,
//       },
//       select: {
//         DiagnosisID: true,
//         AffectedArea: true,
//         diagnosis: true,
//         diagnosedDate: true,
//         visit: {
//           select: {
//             serviceId: true,
//           },
//         },
//         treatments: {
//           select: {
//             TreatmentType: true,
//             Medications: {
//               select: {
//                 name: true,
//               },
//             },
//           },
//         },
//         Diagnose: {
//           select: {
//             fName: true,
//             lName: true,
//           },
//         },
//         procedures: {
//           select: { name: true },
//         },
//       },
//     });
//     // console.log(`medical records ${medicalRecords}`)
//     // medicalRecords.forEach(record => {
//     //   console.log(`Diagnosis ID: ${record.DiagnosisID}`);
//     //   console.log(`Diagnosis: ${record.diagnosis}`);
//     //   console.log(`Affected Area: ${record.AffectedArea}`);
//     //   console.log(`Diagnosed Date: ${record.diagnosedDate}`);
//     //   // console.log(`treatment Date: ${record.diagnosedDate}`);
//     //   console.log(`Diagnosed by: ${record.Diagnose.fName} ${record.Diagnose.lName}`);
//     //   // console.log(`service by: ${record.visit}`);

//     //   record.visit.forEach(visit => {
//     //     console.log(`Service ID: ${visit.serviceId}`)});
//     //   })

//     // Transform the fetched data to match the required attributes
//     const transformedRecords = medicalRecords.map((record) => ({
//       ID: record.DiagnosisID,
//       // Title: "Prescription" + " " +record.DiagnosisID,
//       CreatedBy: `Dr. ${record.Diagnose.fName} ${record.Diagnose.lName}`,
//       Date: record.diagnosedDate.toJSON().split("T")[0],
//       DiseaseOrCondition: record.diagnosis,
//       AffectedArea: record.AffectedArea,
//       treatment: record.treatments.map((treatment) => treatment.TreatmentType),
//       surgeries: record.procedures.map((proc) => proc.name),
//       // visitReason: record.visit.serviceId === 1?"Examination":record.visit.serviceId === 2?"Consultation":"Surgery",
//       visitReason: record.visit.map((visit) =>
//         visit.serviceId === 1
//           ? "Examination"
//           : visit.serviceId === 2
//           ? "Consultation"
//           : "Surgery"
//       ),
//       Medications: record.treatments
//         .flatMap((treatment) =>
//           treatment.Medications.map((med) => ({
//             name: med.name,
//             // dosage: med.dosage,
//             // DosageUnit: med.DosageUnit,
//             // frequency: med.frequency,
//           }))
//         )
//         .map((med) => med.name),
//     }));
//     // transformedRecords.forEach(record => {
//     //   console.log(`Diagnosis ID: ${record.ID}`);
//     //   console.log(`Diagnosis: ${record.DiseaseOrCondition}`);
//     //   console.log(`Affected Area: ${record.AffectedArea}`);
//     //   console.log(`Diagnosed Date: ${record.Date}`);
//     //   console.log(`Diagnosed by: ${record.CreatedBy}`);
//     //   console.log(`visit reason: ${record.visitReason}`);
//     //   console.log(`surgery: ${record.surgeries}`);
//     //   console.log(`medications: ${record.Medications}`);
//     //   console.log(`treatments: ${record.treatment}`);
//     //   })

//     return transformedRecords;
//   } catch (error) {
//     console.error("Error fetching patient medical records:", error);
//     throw error;
//   }
// };

async function getPatientMedicalRecords(patientID) {
  const patient = await prisma.patient.findUnique({
    where: { patientID },
    include: {
      patientID,
      fName,
      lName,
      age,
      gender,
      smoker,
      alcoholIntake,
      chronicDiseases,
      allergies,
      bloodGroup,
      medicalConditions: true, // Diagnoses
      treatmentPlan: true,     // Treatments
      // visits: {
      //   include: {
      //     procedures: true,
      //     diagnoses: true,
      //     consultations: true,
      //   },
      // },
      procedures: true,
      medications: true,
      consultations: true,
    },
  });

  if (!patient) {
    throw new Error("Patient not found");
  }

  const records = {
    patientID:patient.patientID,
    name:`${patient.fName} ${patient.lName}`,
    age: patient.age,
    gender: patient.gender,
    smoker: patient.smoker,
    alcoholIntake: patient.alcoholIntake,
    chronicDiseases: patient.chronicDiseases,
    allergies: patient.allergies,
    bloodGroup: patient.bloodGroup,
    diagnoses: patient.medicalConditions,
    treatments: patient.treatmentPlan,
    // visits: patient.visits,
    procedures: patient.procedures,
    medications: patient.medications,
    consultations: patient.consultations,
    // radiologyImages: patient.radiologyImages,
  };

  return records;
}

// -----------------------------------------Invoices---------------------------------------
const getInvoices = async (req, res) => {
  const patient = JSON.parse(req.query.patient);
  const { patientID } = patient;
  try {
    const invoices = await getInvoicesForPatient(patientID);
    // console.log(invoices)

    res.json(invoices);
  } catch (error) {
    console.error("Error getting patient prescriptions:", error);
    res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client
  }
};

async function getInvoicesForPatient(patientId) {
  try {
    // Fetch invoice records for the specified patient
    const invoices = await prisma.invoice.findMany({
      where: {
        visit: {
          patientId: patientId,
        },
      },
      select: {
        billingId: true,
        totalCost: true,
        date: true,
        status: true,
        // Navigate through the relationships to get doctor name and insurance coverage
        visit: {
          select: {
            sets: {
              select: {
                fName: true,
                lName: true,
              },
            },
            reserve: {
              select: {
                insuranceCoverage: true,
              },
            },
          },
        },
      },
    });
    // Map the retrieved data into the required format
    const invoiceDetails = invoices.map((invoice) => ({
      invoiceID: formatInvoiceId(invoice.billingId),
      doctorName: `${invoice.visit.sets.fName} ${invoice.visit.sets.lName}`,
      cost: invoice.totalCost,
      date: invoice.date,
      coverage: invoice.visit.reserve.insuranceCoverage,
      total:
        invoice.visit.reserve.insuranceCoverage === "None"
          ? invoice.totalCost
          : invoice.totalCost *
            ((100.0 -
              parseFloat(
                invoice.visit.reserve.insuranceCoverage.split("%")[0]
              )) /
              100.0),
      status: invoice.status,
    }));

    return invoiceDetails;
  } catch (error) {
    console.error("Error fetching invoices for patient:", error);
    throw error;
  }
};

// ------------Helper functions---------
function formatInvoiceId(id) {
  const paddedId = String(id).padStart(3, "0"); // Ensure 3 digits with leading zeros
  return `INV-${paddedId}`;
};

// -----------------------------------------Export PDF Reports---------------------------------------
const exportReports = async (req, res) => {
  const patient = JSON.parse(req.query.user);
  const { patientID } = patient;
  const { Reports } = req.body;
  try {
    const invoiceSelected = Reports.includes("Invoices");
    const prescSelected = Reports.includes("Prescriptions");
    const medRecordsSelected = Reports.includes("Medical History");
    await generatePatientPDF(
      invoiceSelected,
      prescSelected,
      medRecordsSelected,
      patientID
    );
  } catch (error) {
    console.error("Error getting patient prescriptions:", error);
    res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client
  }
};

async function generatePatientPDF(
  invoiceSelected = true,
  prescSelected = false,
  medRecordsSelected = false,
  patientID
) {
  const doc = new PDFDocument({
    size: "A4",
    font: "Times-Roman",
    bufferPages: true,
  });

  // Pipe the PDF into a writable stream
  doc.pipe(fs.createWriteStream(`patient${patientID}-report.pdf`));

  // Draw border
  drawBorder(doc);

  // Add the cover page with logo and title
  addCoverPage(
    doc,
    "C:/Users/ashra/OneDrive/Documents/DentiSoft/Frontend/src/assets/images/Logo.jpeg",
    "Patient Report"
  );

  doc.addPage();
  await addPatientGeneralInfo(doc, patientID);

  // Add pages with different titles
  if (medRecordsSelected) {
    doc.addPage();
    await addMedicalRecords(doc, patientID);
  }
  if (prescSelected) {
    doc.addPage();
    await addPrescriptions(doc, patientID);
  }
  if (invoiceSelected) {
    console.log("here");
    doc.addPage();
    await addInvoices(doc, patientID);
  }

  addPageNumbers(doc);

  // Finalize the PDF and end the stream
  doc.end();
};

const addInvoices = async (doc, patientID) => {
  const invoices = await getInvoicesForPatient(patientID);
  // console.log(invoices)
  drawBorder(doc);

  // Add the invoice title
  doc
    .font("Times-Bold")
    .fontSize(25)
    .text(`Invoices Records`, { align: "center" });

  // Draw a table with invoice details
  const tableData = [
    [
      "Invoice ID",
      "Date",
      "Dentist Name",
      "Cost",
      "Insurance Coverage",
      "Total",
      "Status",
    ],
  ];
  invoices.forEach((data) => {
    const rowData = [
      data.invoiceID,
      data.date.toJSON().split("T")[0],
      `Dr.${data.doctorName}`,
      `$${data.cost}`,
      data.discount,
      `$${data.total}`,
      data.status,
    ];
    tableData.push(rowData);
  });
  console.log(tableData);

  drawTable(doc, tableData, { x: 17, y: 180, width: 560, fontSize: 15 });
};

const addMedicalRecords = async (doc, patientID) => {
  drawBorder(doc);
  // Add the medical records title
  doc
    .font("Times-Bold")
    .fontSize(25)
    .text(`Medical Records`, { align: "center" });

  const medicalRecords = await getPatientMedicalRecords(patientID);
  // console.log(medicalRecords)

  const tableData = [
    [
      "ID",
      "Date",
      "Visit Type",
      "Dentist",
      "Diagnosis",
      "Affected Area",
      "Treatment",
      "Medications",
      "Surgery",
    ],
  ];
  medicalRecords.forEach((data) => {
    const rowData = [
      data.ID,
      data.Date,
      data.visitReason,
      data.CreatedBy,
      data.DiseaseOrCondition,
      data.AffectedArea,
      data.treatment.length > 0 ? data.treatment.join(", ") : "None",
      data.Medications.length > 0 ? data.Medications.join(", ") : "None",
      data.surgeries.length > 0 ? data.surgeries : "None",
    ];
    tableData.push(rowData);
  });
  console.log(tableData);

  drawTable(doc, tableData, { x: 17, y: 150, width: 560, fontSize: 10 });
};

const addPrescriptions = async (doc, patientID) => {
  drawBorder(doc);
  // Add the prescriptions title
  doc
    .font("Times-Bold")
    .fontSize(25)
    .text(`Prescriptions List`, { align: "center" });

  const prescriptions = await getPrescriptionsForPatient(patientID);
  console.log(prescriptions);

  const tableData = [
    ["ID", "Date", "Dentist", "Diagnosis", "Medication", "Dosage"],
  ];
  prescriptions.forEach((data) => {
    const rowData = [
      data.id,
      data.date,
      data.doctorName,
      data.disease,
      data.drugs.length > 0 ? data.drugs.join(", ") : "None",
      data.dosage.length > 0 ? data.dosage.join(", ") : "None",
    ];
    tableData.push(rowData);
  });
  console.log(tableData);

  drawTable(doc, tableData, { x: 17, y: 150, width: 560, fontSize: 15 });
};

const addPatientGeneralInfo = async (doc, patientID) => {
  // Draw the border on each invoice page
  drawBorder(doc);

  const patientData = await prisma.patient.findUnique({
    where: { patientID: patientID },
    include: { chronicDiseases: true, allergies: true },
  });
  console.log(patientData);

  // Add the page title
  doc
    .font("Times-Bold")
    .fontSize(25)
    .text(`Patient General Information`, { align: "center" });

  // .text(`Date: ${pageData.date}`, { align: 'left' });
  doc.moveDown(2);
  doc.font("Times-Roman").fontSize(18);
  doc
    .font("Times-Bold")
    .text("Patient ID: ", { continued: true })
    .font("Times-Roman")
    .text(`${patientData.patientID}`);
  doc
    .font("Times-Bold")
    .text("Patient Name: ", { continued: true })
    .font("Times-Roman")
    .text(`${patientData.fName} ${patientData.lName}`);
  doc
    .font("Times-Bold")
    .text(`Birth Date: `, { continued: true })
    .font("Times-Roman")
    .text(`${patientData.birthDate.toJSON().trim().split("T")[0]}`);
  doc
    .font("Times-Bold")
    .text(`Age: `, { continued: true })
    .font("Times-Roman")
    .text(`${patientData.age}`);
  doc
    .font("Times-Bold")
    .text(`Gender: `, { continued: true })
    .font("Times-Roman")
    .text(`${patientData.gender}`);
  doc.moveDown(2);
  doc.font("Times-Bold").fontSize(20).text("Contact Info:");
  doc.fontSize(18);
  doc.moveDown(1);
  doc
    .text(`Address: `, { continued: true })
    .font("Times-Roman")
    .text(`${patientData.address}`);
  doc
    .font("Times-Bold")
    .text(`Phone: `, { continued: true })
    .font("Times-Roman")
    .text(`${patientData.phone}`);
  doc
    .font("Times-Bold")
    .text(`E-Mail: `, { continued: true })
    .font("Times-Roman")
    .text(`${patientData.email}`);
  doc.moveDown(2);
  doc.font("Times-Bold").fontSize(20).text("General Health Info:");
  doc.fontSize(18);
  doc.moveDown(1);
  doc
    .text(`Smoking Status: `, { continued: true })
    .text(`${patientData.Smoker ? "Smoker" : "Non-Smoker"}`);
  doc
    .font("Times-Bold")
    .text(`Alchol Intake: `, { continued: true })
    .font("Times-Roman")
    .text(
      `${patientData.alcoholIntake ? "Occasional drinker" : "Non-Drinker"}`
    );
  doc
    .font("Times-Bold")
    .text(`Blood Group: `, { continued: true })
    .font("Times-Roman")
    .text(`${patientData.bloodGroup}`);
  doc
    .font("Times-Bold")
    .text(`Chronic Diseases: `, { continued: true })
    .font("Times-Roman")
    .text(
      `${
        patientData.chronicDiseases.length > 0
          ? patientData.chronicDiseases
              .map((disease) => disease.disease)
              .join(", ")
          : "None"
      }`
    );
  doc
    .font("Times-Bold")
    .text(`Allergies: `, { continued: true })
    .font("Times-Roman")
    .text(
      `${
        patientData.allergies.length > 0
          ? patientData.allergies
              .map((allergy) => allergy.allergySource)
              .join(", ")
          : "None"
      }`
    );
  doc.moveDown(2);
  doc.font("Times-Bold").fontSize(20).text("Insurance Details:");
  doc.moveDown(1);
  doc.fontSize(18);
  doc
    .text(`Insurance Company: `, { continued: true })
    .font("Times-Roman")
    .text(`${patientData.InsuranceCompany}`);
  doc
    .font("Times-Bold")
    .text(`Insurance Coverage: `, { continued: true })
    .font("Times-Roman")
    .text(`${patientData.InsuranceCoverage}`);
};

function addCoverPage(doc, logoPath, title) {
  // Set up the cover page
  // doc.addPage();
  doc.image(logoPath, 200, 200, {
    fit: [200, 200],
    align: "center",
    valign: "center",
  });

  // doc.moveDown(2); // Move down from the logo
  doc.fontSize(40).font("Times-Bold").text(title, { align: "center" });
  doc.moveDown(7);
  doc
    .fontSize(25)
    .font("Times-Bold")
    .text("Radiant Smiles", { align: "center" });
  doc
    .moveDown(1)
    .fontSize(25)
    .font("Times-Roman")
    .text("Let Us Brighten Your Smile", { align: "center" });
  // Get today's date
  // const today = new Date();
  // const formattedDate = today.toLocaleDateString('en-US', {
  //   year: 'numeric',
  //   month: 'long',
  //   day: 'numeric'
  // });
  const today = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = today.toLocaleDateString("en-US", options);

  // Add today's date to the PDF
  doc
    .font("Times-Roman")
    .fontSize(12)
    .text(`${formattedDate}`, 0.1 * doc.page.width, 0.8 * doc.page.height, {
      align: "center",
    });
};

function drawBorder(doc) {
  const borderWidth = 20;
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;

  // Draw border
  doc
    .rect(
      borderWidth / 2,
      borderWidth / 2,
      pageWidth - borderWidth,
      pageHeight - borderWidth
    )
    .stroke();
};

function addPageNumbers(doc) {
  const pageCount = doc.bufferedPageRange().count;

  for (let i = 0; i < pageCount; i++) {
    doc.switchToPage(i);

    const pageNumber = `Page ${i + 1} of ${pageCount}`;
    doc
      .font("Times-Roman")
      .fontSize(12)
      .text(pageNumber, 0.1 * doc.page.width, 0.89 * doc.page.height, {
        align: "center",
      });
  }
};

function drawTable(doc, tableData, options) {
  const startX = options.x;
  const startY = options.y;
  const tableWidth = options.width;
  const rowHeight = 35;
  const colCount = tableData[0].length;
  const colWidth = tableWidth / colCount;

  // Draw header
  doc.font("Times-Bold").fontSize(options.fontSize);
  for (let i = 0; i < colCount; i++) {
    doc.rect(startX + i * colWidth, startY, colWidth, rowHeight).stroke();
    doc.text(tableData[0][i], startX + i * colWidth + 5, startY + 5, {
      width: colWidth - 10,
      align: "left",
    });
  }

  // Draw rows
  doc.font("Times-Roman").fontSize(options.fontSize);
  for (let i = 1; i < tableData.length; i++) {
    for (let j = 0; j < colCount; j++) {
      doc
        .rect(
          startX + j * colWidth,
          startY + i * rowHeight,
          colWidth,
          rowHeight
        )
        .stroke();
      doc.text(
        tableData[i][j],
        startX + j * colWidth + 5,
        startY + i * rowHeight + 5,
        { width: colWidth - 10, align: "left" }
      );
    }
  }
};

// generatePatientPDF(true, true, true, 1)

// // -----------------------------------------Perscriptions---------------------------------------
// const getPrescriptions = async (req, res) => {
//   const patient = JSON.parse(req.query.patient);
//   const { patientID } = patient;
//   try {
//     const prescriptions = await getPrescriptionsForPatient(patientID);
//     // res.json(prescriptions)
//     console.log(prescriptions);
//     res.json(prescriptions);
//   } catch (error) {
//     console.error("Error getting patient prescriptions:", error);
//     res
//       .status(500)
//       .json({ message: "An error occurred while processing your request." });
//   } finally {
//     await prisma.$disconnect(); // Disconnect Prisma client
//   }
// };

// async function getPrescriptionsForPatient(patientId) {
//   try {
//     // Fetch diagnosis records for the patient
//     const diagnosisRecords = await prisma.diagnosis.findMany({
//       where: {
//         patientId: patientId,
//       },
//       select: {
//         DiagnosisID: true,
//         diagnosis: true,
//         DentistSsn: true,
//         diagnosedDate: true,
//       },
//     });

//     // Fetch associated treatments for the diagnoses to get medications
//     const treatments = await prisma.treatment.findMany({
//       where: {
//         patientId: patientId,
//       },
//       include: {
//         Medications: true,
//       },
//     });

//     const diagnosisWithMedications = [];
//     for (const diagnosis of diagnosisRecords) {
//       const treatment = treatments.find(
//         (treatment) => treatment.diagnosisId === diagnosis.DiagnosisID
//       );

//       const medications = treatment ? treatment.Medications : [];
//       const dentist = await prisma.dentist.findUnique({
//         where: {
//           DentistSSN: diagnosis.DentistSsn,
//         },
//         select: {
//           fName: true,
//           lName: true,
//         },
//       });
//       let dentistName = "";

//       if (dentist) {
//         dentistName = `${dentist.fName} ${dentist.lName}`;
//       }
//       const diagnosisObject = {
//         id: diagnosis.DiagnosisID,
//         title: "Prescription " + diagnosis.DiagnosisID,
//         doctorName: "Dr." + dentistName,
//         date: diagnosis.diagnosedDate.toISOString().trim().split("T")[0],
//         disease: diagnosis.diagnosis,
//         drugs: medications.map((medication) => medication.name),
//         dosage: medications.map(
//           (medication) =>
//             `${medication.dosage} ${medication.DosageUnit}, ${medication.frequency}`
//         ),
//       };
//       diagnosisWithMedications.push(diagnosisObject);
//     }

//     return diagnosisWithMedications;
//   } catch (error) {
//     console.error("Error fetching diagnosis and medications:", error);
//     throw error;
//   }
// };


module.exports = {
  registerNewPatient,
  getPatient,
  getPatientProfile,
  updatePatient,
  getAppointments,
  bookAppointmentDentistsOptions,
  bookAppointment,
  editAppointments,
  cancelAppointment,
  deleteAppointment,
  getMedicalRecords,
  getInvoices,
  exportReports,
};
