import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, TextField } from "@mui/material";
import { patients } from "../../utils/mockHL7Data";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

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
  // OBR Segment
  orderID: z.string().nonempty("Set ID is required"),
  fillerOrderID: z.string().optional(),
  testCode: z.string().nonempty("Test Code is required"),
  testName: z.string().nonempty("Test Name is required"),
  requestedDateTime: z.string().nonempty("Requested Date/Time is required"),
  specimenReceivedDateTime: z.string().optional(),
  orderingProvider: z.string().nonempty("Ordering Provider is required"),

  // OBX Segment
  valueType: z.string().nonempty("Value Type is required"),
  code: z.string().nonempty("Code is required"),
  description: z.string().nonempty("Description is required"),
  codingSystem: z.string().nonempty("Coding System is required"),
  observation: z.string().nonempty("Observation Value is required"),
  resultStatus: z.string().nonempty("Result Status is required"),
});

type FormFields = z.infer<typeof schema>;

interface ORUFormProps {
  messageType: string;
}

const TestResultsForm = ({ messageType }: ORUFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      sendingFacility: "SanOris",
      sendingFacilityApplication: "Dental Clinic",
      hl7MessageType: messageType,
    },
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    console.log("Submitted data:", data);
    try {
      const response = await axios.post("http://localhost:3307/HL7Messages/oru", { data });
      // Handle success if needed
      toast.success("Message sent successfully!");
    } catch (error) {
      // Show error message in the toast notification
      toast.error("Failed to send the message: ");
    }
  };
  const handlePatientSelect = (patientId: string | undefined) => {
    if (!patientId) {
      console.log("No patient selected");
      return;
    }

    const selectedPatient = patients.find((p) => `${p.id}` === patientId);
    if (selectedPatient) {
      console.log("Setting patient data:", selectedPatient);
      setValue(
        "patient",
        `${patientId}${selectedPatient.firstName}${selectedPatient.lastName}`
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

  const valueTypeOptions = [
    { label: "Numeric (NM)", value: "NM" },
    { label: "Coded (CE)", value: "CE" },
    { label: "String (ST)", value: "ST" },
  ];

  const resultStatusOptions = [
    { label: "Final (F)", value: "F" },
    { label: "Preliminary (P)", value: "P" },
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

      {/* OBR Segment */}
      <div className="col-span-2">
        <h2 className="text-lg font-bold">Observation Request</h2>
      </div>
      <div>
        <TextField
          {...register("orderID")}
          label="Order ID"
          fullWidth
          error={!!errors.orderID}
          helperText={errors.orderID?.message}
        />
      </div>
      <div>
        <TextField
          {...register("fillerOrderID")}
          label="Filler Order Number (Optional)"
          fullWidth
          error={!!errors.fillerOrderID}
          helperText={errors.fillerOrderID?.message}
        />
      </div>
      <div>
        <TextField
          {...register("testCode")}
          label="Test Code"
          fullWidth
          error={!!errors.testCode}
          helperText={errors.testCode?.message}
        />
      </div>
      <div>
        <TextField
          {...register("testName")}
          label="Test Name"
          fullWidth
          error={!!errors.testName}
          helperText={errors.testName?.message}
        />
      </div>
      <div>
        <TextField
          {...register("requestedDateTime")}
          label="Requested Date/Time"
          type="datetime-local"
          fullWidth
          InputLabelProps={{ shrink: true }}
          error={!!errors.requestedDateTime}
          helperText={errors.requestedDateTime?.message}
        />
      </div>
      <div>
        <TextField
          {...register("specimenReceivedDateTime")}
          label="Specimen Received Date/Time (Optional)"
          type="datetime-local"
          fullWidth
          InputLabelProps={{ shrink: true }}
          error={!!errors.specimenReceivedDateTime}
          helperText={errors.specimenReceivedDateTime?.message}
        />
      </div>
      <div>
        <TextField
          {...register("orderingProvider")}
          label="Ordering Provider"
          fullWidth
          error={!!errors.orderingProvider}
          helperText={errors.orderingProvider?.message}
        />
      </div>

      {/* OBX Segment */}
      <div className="col-span-2">
        <h2 className="text-lg font-bold">Observation Results</h2>
      </div>
      <div>
        <Autocomplete
          disablePortal
          options={valueTypeOptions}
          onChange={(_, value) => {
            setValue("valueType", value?.value || "");
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              {...register("valueType")}
              label="Value Type"
              error={!!errors.valueType}
              helperText={errors.valueType?.message}
            />
          )}
        />
      </div>
      <div>
        <TextField
          {...register("code")}
          label="Code"
          fullWidth
          error={!!errors.code}
          helperText={errors.code?.message}
        />
      </div>
      <div>
        <TextField
          {...register("description")}
          label="Description"
          fullWidth
          error={!!errors.description}
          helperText={errors.description?.message}
        />
      </div>
      <div>
        <TextField
          {...register("codingSystem")}
          label="Coding System"
          fullWidth
          error={!!errors.codingSystem}
          helperText={errors.codingSystem?.message}
        />
      </div>
      <div>
        <TextField
          {...register("observation")}
          label="Observation Value"
          fullWidth
          error={!!errors.observation}
          helperText={errors.observation?.message}
        />
      </div>
      <div>
        <Autocomplete
          disablePortal
          options={resultStatusOptions}
          onChange={(_, value) => {
            setValue("resultStatus", value?.value || "");
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              {...register("resultStatus")}
              label="Result Status"
              error={!!errors.resultStatus}
              helperText={errors.resultStatus?.message}
            />
          )}
        />
      </div>
      {/* Hidden Fields */}
      <input type="hidden" {...register("hl7MessageType")} />
      <input type="hidden" {...register("patientID")} />

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

export default TestResultsForm;
