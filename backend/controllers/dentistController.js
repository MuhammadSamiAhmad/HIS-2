const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();





// Fetch all reservations for the Reservations Tab
// const getReservations = async (req, res) => {
//   try {
//     const reservations = await prisma.visit.findMany({
//       include: {
//         patient: {
//           select: {
//             patientID: true,
//             fName: true,
//             lName: true,
//           },
//         },
//       },
//     });
//     const transformedReservations = reservations.map((reservation) => ({
//       patientID: reservation.patient.patientID,
//       patientName: `${reservation.patient.fName} ${reservation.patient.lName}`,
//       date: reservation.date?.toISOString().split('T')[0],
//       // category: reservation.service?.name || 'N/A',
//     }));
//     res.status(200).json(transformedReservations);
//   } catch (error) {
//     console.error('Error fetching reservations:', error);
//     res.status(500).json({ message: 'Failed to fetch reservations.' });
//   }
// };


const getReservations = async (req, res) => {
  try {
    const reservations = await prisma.visit.findMany({
      include: {
        patient: {
          select: {
            patientID: true,
            fName: true,
            lName: true,
          },
        },
        procedures: true,  //check if any procedures exist
        consultations: true,  //check if any consultations exist
      },
    });
    const transformedReservations = reservations.map((reservation) => {
      let service = 'Examination';
      if (reservation.procedures.length > 0) {
        service = 'Surgery';  
      } else if (reservation.consultations.length > 0) {
        service = 'Consultancy'; 
      }
      return {
        patientID: reservation.patient.patientID,
        patientName: `${reservation.patient.fName} ${reservation.patient.lName}`,
        category : service ,  
        date: reservation.date?.toISOString().split('T')[0],
      };
    });
    res.status(200).json(transformedReservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ message: 'Failed to fetch reservations.' });
  }
};

const saveMedicalRecord = async (req, res) => {
  const { patientId } = req.params;
  const {
    diagnosis,
    affectedArea,
    description = "None",
    treatmentType,
    startDate,
    endDate,
    medications, // give array of medications with name, dosage, dosageUnit, frequency
  } = req.body;

  try {
    const updatedRecord = await prisma.diagnosis.create({
      data: {
        patientId: parseInt(patientId),
        diagnosis: diagnosis,
        affectedArea: affectedArea,
        description: description, 
        diagnosedDate: new Date(), 
        treatments: {
          create: {
            treatmentType: treatmentType,
            startDate: new Date(startDate), 
            endDate: new Date(endDate), 
            medications: {
              create: medications.map((med) => ({
                name: med.name,
                dosage: med.dosage,
                dosageUnit: med.dosageUnit,
                frequency: med.frequency,
              })),
            },
          },
        },
      },
    });
    // Respond with success message and the updated record
    res.status(200).json({
      message: 'Medical record saved successfully.',
      record: updatedRecord,
    });
  } catch (error) {
    console.error('Error saving medical record:', error);
    res.status(500).json({ message: 'Failed to save medical record.' });
  }
};



// all patients for the Patients Tab
const getPatients = async (req, res) => {
  try {
    const patients = await prisma.patient.findMany({
      select: {
        patientID: true,
        fName: true,
        lName: true,
      },
    });
    const transformedPatients = patients.map((patient) => ({
      patientID: patient.patientID,
      patientName: `${patient.fName} ${patient.lName}`,
    }));
    res.status(200).json(transformedPatients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Failed to fetch patients.' });
  }
};

// medical records for a specific patient
const getMedicalRecord = async (req, res) => {
  const { patientId } = req.params;
  // const patient = JSON.parse(req.query.patient)
  try {
    const patientInfo = await prisma.patient.findUnique({
      where: { patientID: parseInt(patientId) },
   // where: { patientId: patient.patientId},
      select: {
        patientID: true,
        fName: true,
        lName: true,
        age: true,
        gender: true,
        smoker: true,
        alcoholIntake: true,
        bloodGroup: true,
        allergies: true,
        chronicDiseases: true,
      },
    });
    if (!patientInfo) {
      return res.status(404).json({ message: 'Patient not found.' });
    }
    //the medical records for this patient
    const medicalRecords = await prisma.diagnosis.findMany({
      where: { patientId: parseInt(patientId) },
      select: {
        DiagnosisID: true,
        AffectedArea: true,
        diagnosis: true,
        diagnosedDate: true,
        treatments: {
          select: {
            TreatmentType: true,
            Medications: {
              select: { name: true },
            },
          },
        },
      },
    });
    const transformedRecords = medicalRecords.map((record) => ({
      ID: record.DiagnosisID,
      Date: record.diagnosedDate?.toISOString().split('T')[0],
      Diagnosis: record.diagnosis,
      AffectedArea: record.AffectedArea,
      Treatments: record.treatments.map((t) => t.TreatmentType),
      Medications: record.treatments.flatMap((t) => t.Medications.map((med) => med.name)),
    }));
    const response = {
      patientID: patientInfo.patientID,
      name: `${patientInfo.fName} ${patientInfo.lName}`,
      age: age,
      gender: patientInfo.gender,
      smoking: patientInfo.smoker,
      alcohol: patientInfo.alcoholIntake,
      chronicDiseases: patientInfo.chronicDiseases,
      allergies: patientInfo.allergies,
      bloodGroup: patientInfo.bloodGroup,
      medicalRecords: transformedRecords,
    };
    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching medical records:', error);
    res.status(500).json({ message: 'Failed to fetch medical records.' });
  }
};





module.exports = {
  getReservations,
  saveMedicalRecord,
  getPatients,
  getMedicalRecord,
};
