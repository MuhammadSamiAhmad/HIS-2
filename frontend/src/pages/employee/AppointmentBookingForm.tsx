import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { patients } from "../../utils/mockHL7Data";
import { Autocomplete, TextField } from "@mui/material";

const schema = z.object({
  patient: z.string().nonempty("Please select a patient"),
  appointmentStart: z.string().nonempty("Start date/time is required"),
  appointmentEnd: z.string().nonempty("End date/time is required"),
  appointmentDuration: z.number().positive("Duration must be positive"),
  appointmentType: z.string().nonempty("Appointment type is required"),
  appointmentStatus: z.string().nonempty("Appointment status is required"),
  practitionerName: z.string().nonempty("Practitioner name is required"),
});

type FormFields = z.infer<typeof schema>;

const AppointmentBookingForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    const selectedPatient = patients.find((p) => `${p.id}` === data.patient);
    console.log("Submitted data:", {
      ...data,
      patientDetails: selectedPatient,
    });
  };

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
      className="grid grid-cols-2 gap-6 max-w-4xl mx-auto"
    >
      {/* Patient Selection */}
      <div className="col-span-2">
        <Autocomplete
          disablePortal
          options={patients.map((p) => ({
            label: `${p.id} - ${p.patientName}`,
            id: String(p.id),
          }))}
          onChange={(_, value) => setValue("patient", value?.id || "")}
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

      {/* Appointment Fields */}
      <div>
        <TextField
          {...register("appointmentStart")}
          label="Start Date/Time"
          type="datetime-local"
          fullWidth
          InputLabelProps={{ shrink: true }}
          error={!!errors.appointmentStart}
          helperText={errors.appointmentStart?.message}
        />
      </div>
      <div>
        <TextField
          {...register("appointmentEnd")}
          label="End Date/Time"
          type="datetime-local"
          fullWidth
          InputLabelProps={{ shrink: true }}
          error={!!errors.appointmentEnd}
          helperText={errors.appointmentEnd?.message}
        />
      </div>
      <div>
        <TextField
          {...register("appointmentDuration", { valueAsNumber: true })}
          label="Duration (minutes)"
          type="number"
          fullWidth
          error={!!errors.appointmentDuration}
          helperText={errors.appointmentDuration?.message}
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
          onChange={(_, value) =>
            setValue("appointmentStatus", value?.value || "")
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Appointment Status"
              error={!!errors.appointmentStatus}
              helperText={errors.appointmentStatus?.message}
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
      </div>
    </form>
  );
};

export default AppointmentBookingForm;
