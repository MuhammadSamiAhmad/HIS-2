import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { patients } from "../../utils/mockHL7Data";
import { Autocomplete, TextField } from "@mui/material";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
// import { useEffect } from "react";

const schema = z.object({
  patient: z.string().nonempty("Please select a patient"),
  sendingFacility: z.string().nonempty("Sending facility is required"),
  sendingFacilityApplication: z
    .string()
    .nonempty("Sending facility application is required"),
  receivingFacility: z.string().nonempty("Receiving facility is required"),
  receivingFacilityApplication: z
    .string()
    .nonempty("Receiving facility application is required"),
  hl7MessageType: z.string().nonempty("HL7 message type is required"),
  patientID: z.string().nonempty("Patient ID is required"),
  fName: z.string().nonempty("First name is required"),
  lName: z.string().nonempty("Last name is required"),
  dob: z.string().nonempty("Date of birth is required"),
  gender: z.string().nonempty("Gender is required"),
  address: z.string().nonempty("Address is required"),
  phone: z.string().nonempty("Phone number is required"),

  startTime: z.string().nonempty("Start date/time is required"),
  endTime: z.string().nonempty("End date/time is required"),
  duration: z.number().positive("Duration must be positive"),
  appointmentType: z.string().nonempty("Appointment type is required"),
  status: z.string().nonempty("Appointment status is required"),
  practitionerName: z.string().nonempty("Practitioner name is required"),
});

type FormFields = z.infer<typeof schema>;

interface SCHFormProps {
  messageType: string;
}

// const res = await axios.get("http://localhost:3307/admin/hl7");
// const {data} = res.data;
// const patients = data;

const AppointmentBookingForm = ({ messageType }: SCHFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    // watch,
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      sendingFacility: "SanOris",
      sendingFacilityApplication: "Dental Clinic",
      hl7MessageType: messageType,
    },
    // mode: "all", // Track validation in real-time
    // criteriaMode: "all", // Provide detailed error messages
  });

  //Form Debugging
  // const formValues = watch();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    // Log errors and form values
    console.log("Submitted data:", data);
    try {
      const response = await axios.post("http://localhost:3307/HL7Messages/sch", { data });
      // Handle success if needed
      toast.success("Message sent successfully!");
    } catch (error) {
      // Show error message in the toast notification
      toast.error("Failed to send the message: ");
    }
  };
  const handlePatientSelect = (patientId: string | undefined) => {
    if (!patientId) return;

    const selectedPatient = patients.find((p) => `${p.id}` === patientId);
    if (selectedPatient) {
      setValue(
        "patient",
        patientId + selectedPatient.firstName + selectedPatient.lastName
      );
      setValue("patientID", patientId);
      setValue("fName", selectedPatient.firstName);
      setValue("lName", selectedPatient.lastName);
      setValue("dob", selectedPatient.dateOfBirth);
      setValue("address", selectedPatient.address);
      setValue("phone", selectedPatient.phone);
      setValue("gender", selectedPatient.gender);
    }
  };
  //Form Debugging
  // // Log errors and form values
  // useEffect(() => {
  //   console.log("Form Errors:", errors);
  //   console.log("Form Values:", formValues);
  // }, [errors, formValues]); // Re-run logs on errors or values change

  const appointmentTypeOptions = [
    { label: "Consultation", value: "CONSULT" },
    { label: "Follow-up", value: "FOLLOWUP" },
    { label: "Emergency", value: "EMERGENCY" },
  ];

  const appointmentStatusOptions = [
    { label: "Confirmed", value: "CONFIRMED" },
    { label: "Pending", value: "PENDING" },
    { label: "Canceled", value: "CANCELED" },
  ];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-2 gap-6 max-w-4xl mx-auto h-[700px] mt-2"
    >
      {/* Patient Selection */}
      <div className="col-span-2">
        <Autocomplete
          disablePortal
          options={patients.map((p) => ({
            label: `${p.id} - ${p.patientName}`,
            id: String(p.id),
          }))}
          onChange={(_, value) => handlePatientSelect(value?.id)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Patient"
              error={!!errors.patient}
              helperText={errors.patient?.message}
            />
          )}
        />
      </div>

      {/* Facility Information */}
      <div>
        <TextField
          {...register("sendingFacility")}
          label="Sending Facility"
          fullWidth
          error={!!errors.sendingFacility}
          helperText={errors.sendingFacility?.message}
        />
      </div>
      <div>
        <TextField
          {...register("sendingFacilityApplication")}
          label="Sending Facility Application"
          fullWidth
          error={!!errors.sendingFacilityApplication}
          helperText={errors.sendingFacilityApplication?.message}
        />
      </div>
      <div>
        <TextField
          {...register("receivingFacility")}
          label="Receiving Facility"
          fullWidth
          error={!!errors.receivingFacility}
          helperText={errors.receivingFacility?.message}
        />
      </div>
      <div>
        <TextField
          {...register("receivingFacilityApplication")}
          label="Receiving Facility Application"
          fullWidth
          error={!!errors.receivingFacilityApplication}
          helperText={errors.receivingFacilityApplication?.message}
        />
      </div>
      {/* Patient Information - Read Only */}
      <div>
        <TextField
          {...register("fName")}
          label="First Name"
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </div>
      <div>
        <TextField
          {...register("lName")}
          label="Last Name"
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </div>
      <div>
        <TextField
          {...register("dob")}
          label="Date of Birth"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </div>
      <div>
        <TextField
          {...register("gender")}
          label="Gender"
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </div>
      <div>
        <TextField
          {...register("address")}
          InputLabelProps={{ shrink: true }}
          label="Address"
          fullWidth
        />
      </div>
      <div>
        <TextField
          {...register("phone")}
          label="Phone Number"
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </div>

      {/* Appointment Fields */}
      <div>
        <TextField
          {...register("startTime")}
          label="Start Date/Time"
          type="datetime-local"
          fullWidth
          InputLabelProps={{ shrink: true }}
          error={!!errors.startTime}
          helperText={errors.startTime?.message}
        />
      </div>
      <div>
        <TextField
          {...register("endTime")}
          label="End Date/Time"
          type="datetime-local"
          fullWidth
          InputLabelProps={{ shrink: true }}
          error={!!errors.endTime}
          helperText={errors.endTime?.message}
        />
      </div>
      <div>
        <TextField
          {...register("duration", { valueAsNumber: true })}
          label="Duration (minutes)"
          type="number"
          fullWidth
          error={!!errors.duration}
          helperText={errors.duration?.message}
        />
      </div>

      {/* Appointment Type Selection */}
      <div>
        <Autocomplete
          disablePortal
          options={appointmentTypeOptions}
          onChange={(_, value) =>
            setValue("appointmentType", value?.value || "")
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Appointment Type"
              error={!!errors.appointmentType}
              helperText={errors.appointmentType?.message}
            />
          )}
        />
      </div>

      {/* Appointment Status Selection */}
      <div>
        <Autocomplete
          disablePortal
          options={appointmentStatusOptions}
          onChange={(_, value) => setValue("status", value?.value || "")}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Appointment Status"
              error={!!errors.status}
              helperText={errors.status?.message}
            />
          )}
        />
      </div>

      <div>
        <TextField
          {...register("practitionerName")}
          label="Practitioner Name"
          fullWidth
          error={!!errors.practitionerName}
          helperText={errors.practitionerName?.message}
        />
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-center col-span-2">
        <button
          type="submit"
          className="w-[100px] bg-blue-500 text-white py-2 rounded-lg"
        >
          Submit
        </button>
        <ToastContainer />
      </div>
    </form>
  );
};

export default AppointmentBookingForm;
