import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, TextField } from "@mui/material";
import { patients } from "../../utils/mockHL7Data";

const schema = z.object({
  patient: z.string().nonempty("Please select a patient"),
  // OBR Segment
  obrSetId: z.string().nonempty("Set ID is required"),
  placerOrderNumber: z.string().nonempty("Placer Order Number is required"),
  fillerOrderNumber: z.string().optional(),
  universalServiceId: z.string().nonempty("Universal Service ID is required"),
  testCode: z.string().nonempty("Test Code is required"),
  testName: z.string().nonempty("Test Name is required"),
  requestedDateTime: z.string().nonempty("Requested Date/Time is required"),
  specimenReceivedDateTime: z.string().optional(),
  orderingProvider: z.string().nonempty("Ordering Provider is required"),

  // OBX Segment
  obxSetId: z.string().nonempty("Set ID is required"),
  valueType: z.string().nonempty("Value Type is required"),
  observationIdentifier: z
    .string()
    .nonempty("Observation Identifier is required"),
  code: z.string().nonempty("Code is required"),
  description: z.string().nonempty("Description is required"),
  codingSystem: z.string().nonempty("Coding System is required"),
  observationValue: z.string().nonempty("Observation Value is required"),
  units: z.string().nonempty("Units are required"),
  resultStatus: z.string().nonempty("Result Status is required"),
});

type FormFields = z.infer<typeof schema>;

const TestResultsForm = () => {
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
    console.log("Submitted HL7 ORU^R01 Test Results Form:", {
      ...data,
      patientDetails: selectedPatient,
    });
  };

  const valueTypeOptions = [
    { label: "Numeric (NM)", value: "Numeric (NM)" },
    { label: "Coded (CE)", value: "Coded (CE)" },
    { label: "String (ST)", value: "String (ST)" },
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
      {/* OBR Segment */}
      <div className="col-span-2">
        <h2 className="text-lg font-bold">Observation Request</h2>
      </div>
      <div>
        <TextField
          {...register("obrSetId")}
          label="Set ID"
          fullWidth
          error={!!errors.obrSetId}
          helperText={errors.obrSetId?.message}
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
          error={!!errors.fillerOrderNumber}
          helperText={errors.fillerOrderNumber?.message}
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
        <TextField
          {...register("obxSetId")}
          label="Set ID"
          fullWidth
          error={!!errors.obxSetId}
          helperText={errors.obxSetId?.message}
        />
      </div>
      <div>
        <Autocomplete
          disablePortal
          options={valueTypeOptions}
          onChange={(_, value) => setValue("valueType", value?.value || "")}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Value Type"
              error={!!errors.valueType}
              helperText={errors.valueType?.message}
            />
          )}
        />
      </div>
      <div>
        <TextField
          {...register("observationIdentifier")}
          label="Observation Identifier"
          fullWidth
          error={!!errors.observationIdentifier}
          helperText={errors.observationIdentifier?.message}
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
          {...register("observationValue")}
          label="Observation Value"
          fullWidth
          error={!!errors.observationValue}
          helperText={errors.observationValue?.message}
        />
      </div>
      <div>
        <TextField
          {...register("units")}
          label="Units"
          fullWidth
          error={!!errors.units}
          helperText={errors.units?.message}
        />
      </div>
      <div>
        <Autocomplete
          disablePortal
          options={resultStatusOptions}
          onChange={(_, value) => setValue("resultStatus", value?.value || "")}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Result Status"
              error={!!errors.resultStatus}
              helperText={errors.resultStatus?.message}
            />
          )}
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

export default TestResultsForm;
