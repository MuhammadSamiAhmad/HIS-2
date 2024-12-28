import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { patients } from "../../utils/mockHL7Data";
import { Autocomplete, TextField } from "@mui/material";
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
  provider: z.string().nonempty("Provider is required"),
  allergy: z.string().optional(),
});

type FormFields = z.infer<typeof schema>;
interface ADTFormProps {
  messageType: string;
}

const ADTForm = ({ messageType }: ADTFormProps) => {
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
      const response = await axios.post("http://localhost:3307/HL7Messages/adt", { data });
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
      setValue("allergy", selectedPatient.allergies);
      setValue("gender", selectedPatient.gender);
    }
  };

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
            label: `${p.id} - ${p.firstName} ${p.lastName}`,
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

      {/* Provider Information */}
      <div>
        <TextField
          {...register("provider")}
          label="Provider"
          fullWidth
          error={!!errors.provider}
          helperText={errors.provider?.message}
          InputLabelProps={{ shrink: true }}
        />
      </div>
      <div>
        <TextField
          {...register("allergy")}
          label="Allergies"
          fullWidth
          InputLabelProps={{ shrink: true }}
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

export default ADTForm;
