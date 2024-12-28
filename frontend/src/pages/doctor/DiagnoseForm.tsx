import SlidingDialog from "../../components/UI/SlidingDialog";
import Expand from "../../assets/images/export.svg";

import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FaSyringe,
  FaCapsules,
  FaEdit,
  FaCalendarAlt,
  FaNotesMedical,
  FaPrescriptionBottle,
} from "react-icons/fa";

// Define validation schema with Zod
const schema = z.object({
  affectedArea: z
    .string()
    .nonempty("Affected area is required")
    .max(100, "Maximum of 100 characters"),
  diagnosis: z
    .string()
    .nonempty("Diagnosis is required")
    .max(200, "Maximum of 200 characters"),
  diagnoseDescription: z.string().nonempty("Diagnose description is required"),
  treatmentType: z
    .string()
    .nonempty("Treatment type is required")
    .max(100, "Maximum of 100 characters"),
  treatmentEndDate: z
    .string()
    .refine((date) => new Date(date).toString() !== "Invalid Date", {
      message: "A valid treatment end date is required.",
    })
    .transform((date) => new Date(date)),
  medicationNames: z.string().nonempty("Medication names are required"),
  dosage: z
    .string()
    .nonempty("Dosage is required")
    .max(50, "Maximum of 50 characters"),
  dosageFrequency: z
    .string()
    .refine((value) => !isNaN(Number(value)) && Number(value) > 0, {
      message: "Dosage frequency must be a positive number",
    }),
});

type FormFields = z.infer<typeof schema>;

export default function DiagnoseForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate async operation
    console.log(data);
    navigate("/next-page"); // Redirect after submission
  };
  return (
    <SlidingDialog
      trigger={
        <button className="w-[80px] px-1 py-0 flex gap-1 items-center bg-Silver-4 text-textColor rounded-md hover:bg-callToAction-300">
          <p className="text-sm text-Silver-1">Diagnose</p>{" "}
          <img className="p-0 size-3" src={Expand} alt="expand" />
        </button>
      }
      title="Diagnose"
    >
      <div className="font-manrope w-full max-w-md mx-auto mt-16">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="relative mb-4">
            <FaNotesMedical className="absolute left-3 top-1/2 transform -translate-y-1/2 text-Silver-2" />
            <input
              {...register("affectedArea")}
              type="text"
              placeholder="Affected Area"
              className="w-full bg-Silver-6 pl-10 p-2 rounded-lg border border-Silver-2 focus:outline-none focus:ring-2 focus:ring-callToAction"
            />
          </div>
          {errors.affectedArea && (
            <div className="text-red-500 -mt-2 mb-2">
              {errors.affectedArea.message}
            </div>
          )}

          <div className="relative mb-4">
            <FaEdit className="absolute left-3 top-1/2 transform -translate-y-1/2 text-Silver-2" />
            <input
              {...register("diagnosis")}
              type="text"
              placeholder="Diagnosis"
              className="w-full bg-Silver-6 pl-10 p-2 rounded-lg border border-Silver-2 focus:outline-none focus:ring-2 focus:ring-callToAction"
            />
          </div>
          {errors.diagnosis && (
            <div className="text-red-500 -mt-2 mb-2">
              {errors.diagnosis.message}
            </div>
          )}

          <div className="relative mb-4">
            <textarea
              {...register("diagnoseDescription")}
              placeholder="Diagnose Description"
              className="w-full bg-Silver-6 pl-3 p-2 rounded-lg border border-Silver-2 focus:outline-none focus:ring-2 focus:ring-callToAction"
            />
          </div>
          {errors.diagnoseDescription && (
            <div className="text-red-500 -mt-2 mb-2">
              {errors.diagnoseDescription.message}
            </div>
          )}

          <div className="relative mb-4">
            <FaSyringe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-Silver-2" />
            <input
              {...register("treatmentType")}
              type="text"
              placeholder="Treatment Type"
              className="w-full bg-Silver-6 pl-10 p-2 rounded-lg border border-Silver-2 focus:outline-none focus:ring-2 focus:ring-callToAction"
            />
          </div>
          {errors.treatmentType && (
            <div className="text-red-500 -mt-2 mb-2">
              {errors.treatmentType.message}
            </div>
          )}

          <div className="relative mb-4">
            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-Silver-2" />
            <input
              {...register("treatmentEndDate")}
              type="date"
              className="w-full bg-Silver-6 pl-10 p-2 rounded-lg border border-Silver-2 focus:outline-none focus:ring-2 focus:ring-callToAction"
            />
          </div>
          {errors.treatmentEndDate && (
            <div className="text-red-500 -mt-2 mb-2">
              {errors.treatmentEndDate.message}
            </div>
          )}

          <div className="relative mb-4">
            <textarea
              {...register("medicationNames")}
              placeholder="Medication Names"
              className="w-full bg-Silver-6 pl-3 p-2 rounded-lg border border-Silver-2 focus:outline-none focus:ring-2 focus:ring-callToAction"
            />
          </div>
          {errors.medicationNames && (
            <div className="text-red-500 -mt-2 mb-2">
              {errors.medicationNames.message}
            </div>
          )}

          <div className="relative mb-4">
            <FaPrescriptionBottle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-Silver-2" />
            <input
              {...register("dosage")}
              type="text"
              placeholder="Dosage"
              className="w-full bg-Silver-6 pl-10 p-2 rounded-lg border border-Silver-2 focus:outline-none focus:ring-2 focus:ring-callToAction"
            />
          </div>
          {errors.dosage && (
            <div className="text-red-500 -mt-2 mb-2">
              {errors.dosage.message}
            </div>
          )}

          <div className="relative mb-4">
            <FaCapsules className="absolute left-3 top-1/2 transform -translate-y-1/2 text-Silver-2" />
            <input
              {...register("dosageFrequency")}
              type="number"
              placeholder="Dosage Frequency"
              className="w-full bg-Silver-6 pl-10 p-2 rounded-lg border border-Silver-2 focus:outline-none focus:ring-2 focus:ring-callToAction"
            />
          </div>
          {errors.dosageFrequency && (
            <div className="text-red-500 -mt-2 mb-2">
              {errors.dosageFrequency.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-callToAction text-background py-2 rounded-lg font-manrope"
          >
            Submit
          </button>
        </form>
      </div>
    </SlidingDialog>
  );
}
