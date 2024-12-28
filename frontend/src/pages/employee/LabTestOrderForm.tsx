import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { patients } from "../../utils/mockHL7Data";
import { Autocomplete, TextField } from "@mui/material";

const schema = z.object({
  patient: z.string().nonempty("Please select a patient"),
  orderControlCode: z.string().nonempty("Order control code is required"),
  placerOrderNumber: z.string().nonempty("Placer order number is required"),
  fillerOrderNumber: z.string().optional(),
  orderDateTime: z.string().nonempty("Order date/time is required"),
  orderingProviderName: z
    .string()
    .nonempty("Ordering provider name is required"),
  setId: z.string().nonempty("Set ID is required"),
  universalServiceId: z.string().nonempty("Universal service ID is required"),
  testCode: z.string().nonempty("Test code is required"),
  testName: z.string().nonempty("Test name is required"),
  requestedDateTime: z.string().nonempty("Requested date/time is required"),
  specimenReceivedDateTime: z.string().optional(),
});

type FormFields = z.infer<typeof schema>;

const LabTestOrderForm = () => {
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
      {/* Autocomplete for Patient Selection */}
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

      {/* Order Fields */}
      <div>
        <TextField
          {...register("orderControlCode")}
          label="Order Control Code"
          fullWidth
          error={!!errors.orderControlCode}
          helperText={errors.orderControlCode?.message}
        />
      </div>
      <div>
        <TextField
          {...register("placerOrderNumber")}
          label="Placer Order Number"
          fullWidth
          error={!!errors.placerOrderNumber}
          helperText={errors.placerOrderNumber?.message}
        />
      </div>
      <div>
        <TextField
          {...register("fillerOrderNumber")}
          label="Filler Order Number (Optional)"
          fullWidth
        />
      </div>
      <div>
        <TextField
          {...register("orderDateTime")}
          label="Order Date/Time"
          type="datetime-local"
          fullWidth
          InputLabelProps={{ shrink: true }}
          error={!!errors.orderDateTime}
          helperText={errors.orderDateTime?.message}
        />
      </div>
      <div>
        <TextField
          {...register("orderingProviderName")}
          label="Ordering Provider Name"
          fullWidth
          error={!!errors.orderingProviderName}
          helperText={errors.orderingProviderName?.message}
        />
      </div>

      {/* Observation Request Fields */}
      <div>
        <TextField
          {...register("setId")}
          label="Set ID"
          fullWidth
          error={!!errors.setId}
          helperText={errors.setId?.message}
        />
      </div>
      <div>
        <TextField
          {...register("universalServiceId")}
          label="Universal Service ID"
          fullWidth
          error={!!errors.universalServiceId}
          helperText={errors.universalServiceId?.message}
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

export default LabTestOrderForm;
