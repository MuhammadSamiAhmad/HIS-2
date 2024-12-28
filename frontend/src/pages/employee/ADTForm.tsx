import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { patients } from "../../utils/mockHL7Data";
import { Autocomplete, TextField } from "@mui/material";

const schema = z.object({
  patient: z.string().nonempty("Please select a patient"),
  receivingFacility: z.string().nonempty("Receiving facility is required"),
});

type FormFields = z.infer<typeof schema>;

const ADTForm = () => {
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

      {/* Receiving Facility */}
      <div className="col-span-2">
        <TextField
          {...register("receivingFacility")}
          label="Receiving Facility"
          fullWidth
          error={!!errors.receivingFacility}
          helperText={errors.receivingFacility?.message}
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

export default ADTForm;
