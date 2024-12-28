import SlidingDialog from "../../components/UI/SlidingDialog";
import AddIcon from "../../assets/images/add-1--expand-cross-buttons-button-more-remove-plus-add-+-mathematics-math.svg";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FaIndustry,
  FaCartPlus,
  FaDollarSign,
  FaCalendarAlt,
  FaClipboardList,
  FaBuilding,
} from "react-icons/fa";

// Define the schema for validation
const schema = z.object({
  equipmentName: z
    .string()
    .nonempty("Equipment Name is required")
    .max(100, "Maximum 100 characters allowed"),
  supplier: z
    .string()
    .nonempty("Supplier is required")
    .max(100, "Maximum 100 characters allowed"),
  equipmentDescription: z
    .string()
    .nonempty("Equipment Description is required")
    .max(300, "Maximum 300 characters allowed"),
  quantity: z
    .string()
    .regex(/^\d+$/, "Quantity must be a valid number")
    .transform((val) => parseInt(val, 10)),
  manufacturer: z
    .string()
    .nonempty("Manufacturer is required")
    .max(100, "Maximum 100 characters allowed"),
  purchaseDate: z
    .string()
    .refine((date) => new Date(date).toString() !== "Invalid Date", {
      message: "A valid Purchase Date is required.",
    })
    .transform((date) => new Date(date)),
  cost: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Cost must be a valid number")
    .transform((val) => parseFloat(val)),
});

type FormFields = z.infer<typeof schema>;

export default function AddEquipmentForm() {
  const navigate = useNavigate(); // For navigation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);
    navigate("/success");
  };
  return (
    <SlidingDialog
      trigger={
        <button className="w-fit py-2 px-4 flex flex-row gap-3 items-center bg-callToAction text-white rounded-md -mt-8 mb-5 mr-16 hover:bg-callToAction-900">
          <img className="size-4" src={AddIcon} alt="" /> Add Equipment
        </button>
      }
      title="New Equipment"
    >
      <div className="font-manrope w-full max-w-md mx-auto mt-16">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Equipment Name */}
          <div className="relative mb-4">
            <FaClipboardList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              {...register("equipmentName")}
              type="text"
              placeholder="Equipment Name"
              className="w-full bg-Silver-6 pl-10 p-2 rounded-lg border border-Silver-2 focus:outline-none focus:ring-2 focus:ring-callToAction"
            />
          </div>
          {errors.equipmentName && (
            <p className="text-red-500">{errors.equipmentName.message}</p>
          )}

          {/* Supplier */}
          <div className="relative mb-4">
            <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              {...register("supplier")}
              type="text"
              placeholder="Supplier"
              className="w-full bg-Silver-6 pl-10 p-2 rounded-lg border border-Silver-2 focus:outline-none focus:ring-2 focus:ring-callToAction"
            />
          </div>
          {errors.supplier && (
            <p className="text-red-500">{errors.supplier.message}</p>
          )}

          {/* Equipment Description */}
          <div className="relative mb-4">
            <FaClipboardList className="absolute left-3 top-[20px] transform -translate-y-1/2 text-gray-400" />
            <textarea
              {...register("equipmentDescription")}
              placeholder="Equipment Description"
              className="w-full bg-Silver-6 pl-10 p-2 rounded-lg border border-Silver-2 focus:outline-none focus:ring-2 focus:ring-callToAction"
            />
          </div>
          {errors.equipmentDescription && (
            <p className="text-red-500">
              {errors.equipmentDescription.message}
            </p>
          )}

          {/* Quantity */}
          <div className="relative mb-4">
            <FaCartPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              {...register("quantity")}
              type="text"
              placeholder="Quantity"
              className="w-full bg-Silver-6 pl-10 p-2 rounded-lg border border-Silver-2 focus:outline-none focus:ring-2 focus:ring-callToAction"
            />
          </div>
          {errors.quantity && (
            <p className="text-red-500">{errors.quantity.message}</p>
          )}

          {/* Manufacturer */}
          <div className="relative mb-4">
            <FaIndustry className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              {...register("manufacturer")}
              type="text"
              placeholder="Manufacturer"
              className="w-full bg-Silver-6 pl-10 p-2 rounded-lg border border-Silver-2 focus:outline-none focus:ring-2 focus:ring-callToAction"
            />
          </div>
          {errors.manufacturer && (
            <p className="text-red-500">{errors.manufacturer.message}</p>
          )}

          {/* Purchase Date */}
          <div className="relative mb-4">
            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              {...register("purchaseDate")}
              type="date"
              className="w-full bg-Silver-6 pl-10 p-2 rounded-lg border border-Silver-2 focus:outline-none focus:ring-2 focus:ring-callToAction"
            />
          </div>
          {errors.purchaseDate && (
            <p className="text-red-500">{errors.purchaseDate.message}</p>
          )}

          {/* Cost */}
          <div className="relative mb-4">
            <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              {...register("cost")}
              type="text"
              placeholder="Cost"
              className="w-full bg-Silver-6 pl-10 p-2 rounded-lg border border-Silver-2 focus:outline-none focus:ring-2 focus:ring-callToAction"
            />
          </div>
          {errors.cost && <p className="text-red-500">{errors.cost.message}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white py-2 rounded-lg"
          >
            Add
          </button>
        </form>
      </div>
    </SlidingDialog>
  );
}
