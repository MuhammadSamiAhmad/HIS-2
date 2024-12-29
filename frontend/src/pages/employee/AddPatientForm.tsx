import SlidingDialog from "../../components/UI/SlidingDialog";
import AddIcon from "../../assets/images/add-1--expand-cross-buttons-button-more-remove-plus-add-+-mathematics-math.svg";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaLock,
  FaHome,
  FaCalendarAlt,
  FaShieldAlt,
  FaPercentage,
} from "react-icons/fa";
import { Droplet } from "lucide-react";
import ScrollArea from "../../components/UI/ScrollArea";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Define the schema for validation
const schema = z
  .object({
    firstName: z
      .string()
      .nonempty("First Name is required")
      .max(50, "Maximum 50 characters allowed"),
    lastName: z
      .string()
      .nonempty("Last Name is required")
      .max(50, "Maximum 50 characters allowed"),
    contactNumber: z
      .string()
      .regex(
        /^\d{10,15}$/,
        "Contact Number must be a valid national phone number"
      ),
    bloodGroup: z
      .string()
      .nonempty("Blood Group is required")
      .max(3, "Maximum 3 characters allowed"),
    smokingStatus: z.enum(["yes", "no"], {
      errorMap: () => ({ message: "Please select a smoking status" }),
    }),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
    gender: z.enum(["male", "female", "other"], {
      errorMap: () => ({ message: "Please select a gender" }),
    }),
    address: z
      .string()
      .nonempty("Address is required")
      .max(200, "Maximum 200 characters allowed"),
    dateOfBirth: z
      .string()
      .refine((date) => new Date(date).toString() !== "Invalid Date", {
        message: "A valid date of birth is required",
      })
      .transform((date) => new Date(date)),
    insuranceProviderCompany: z
      .string()
      .nonempty("Insurance Provider Company is required")
      .max(100, "Maximum 100 characters allowed"),
    coverageRate: z
      .string()
      .regex(/^100$|^\d{1,2}$/, "Coverage Rate must be between 0 and 100")
      .transform((rate) => parseInt(rate, 10)),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

type FormFields = z.infer<typeof schema>;

export default function AddPatientForm() {
  const navigate = useNavigate();
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
    // try {
    //   const response = await axios.post("http://localhost:3307/admin/patients", { data });
    //   console.log(response);
    //   // Handle success if needed
    //   toast.success("Patient added successfully!");
    // } catch (error) {
    //   // Show error message in the toast notification
    //   toast.error(`Failed to add the patient: ${error}`);
    //   console.log(error);
    // }
    // navigate("/success");
  };

  return (
    <SlidingDialog
      trigger={
        <button className="w-fit py-2 px-4 flex flex-row gap-3 items-center bg-callToAction text-white rounded-md -mt-8 mb-5 mr-16 hover:bg-callToAction-900">
          <img className="size-4" src={AddIcon} alt="" /> Add Patient
        </button>
      }
      title="New Patient"
    >
      <ScrollArea>
        <div className="py-2 font-manrope w-full max-w-md mx-auto h-[690px]">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* First Name */}
            <div className="relative mb-4">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                {...register("firstName")}
                type="text"
                placeholder="First Name"
                className="w-full bg-Silver-6 pl-10 p-2 rounded-lg border border-Silver-2 focus:outline-none focus:ring-2 focus:ring-callToAction"
              />
            </div>
            {errors.firstName && (
              <p className="text-red-500">{errors.firstName.message}</p>
            )}

            {/* Last Name */}
            <div className="relative mb-4">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                {...register("lastName")}
                type="text"
                placeholder="Last Name"
                className="w-full bg-Silver-6 pl-10 p-2 rounded-lg border border-Silver-2 focus:outline-none focus:ring-2 focus:ring-callToAction"
              />
            </div>
            {errors.lastName && (
              <p className="text-red-500">{errors.lastName.message}</p>
            )}

            {/* Contact Number */}
            <div className="relative mb-4">
              <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                {...register("contactNumber")}
                type="text"
                placeholder="Contact Number"
                className="w-full bg-Silver-6 pl-10 p-2 rounded-lg border border-Silver-2 focus:outline-none focus:ring-2 focus:ring-callToAction"
              />
            </div>
            {errors.contactNumber && (
              <p className="text-red-500">{errors.contactNumber.message}</p>
            )}

            {/* Blood Group */}
            <div className="relative mb-4">
              <Droplet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                {...register("bloodGroup")}
                type="text"
                placeholder="Blood Group"
                className="w-full bg-Silver-6 pl-10 p-2 rounded-lg border border-Silver-2 focus:outline-none focus:ring-2 focus:ring-callToAction"
              />
            </div>
            {errors.bloodGroup && (
              <p className="text-red-500">{errors.bloodGroup.message}</p>
            )}

            {/* Smoking Status */}
            <fieldset className="mb-4">
              <legend>Smoking Status:</legend>
              <label>
                <input
                  {...register("smokingStatus")}
                  type="radio"
                  value="yes"
                />{" "}
                Yes
              </label>
              <label className="ml-4">
                <input {...register("smokingStatus")} type="radio" value="no" />{" "}
                No
              </label>
            </fieldset>
            {errors.smokingStatus && (
              <p className="text-red-500">{errors.smokingStatus.message}</p>
            )}

            {/* Email */}
            <div className="relative mb-4">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                {...register("email")}
                type="email"
                placeholder="Email"
                className="w-full bg-Silver-6 pl-10 p-2 rounded-lg border border-Silver-2 focus:outline-none focus:ring-2 focus:ring-callToAction"
              />
            </div>
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}

            {/* Password */}
            <div className="relative mb-4">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                {...register("password")}
                type="password"
                placeholder="Password"
                className="w-full bg-Silver-6 pl-10 p-2 rounded-lg border border-Silver-2 focus:outline-none focus:ring-2 focus:ring-callToAction"
              />
            </div>
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}

            {/* Confirm Password */}
            <div className="relative mb-4">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="Re-enter Password"
                className="w-full bg-Silver-6 pl-10 p-2 rounded-lg border border-Silver-2 focus:outline-none focus:ring-2 focus:ring-callToAction"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500">{errors.confirmPassword.message}</p>
            )}

            {/* Gender */}
            <fieldset className="mb-4">
              <legend>Gender:</legend>
              <label>
                <input {...register("gender")} type="radio" value="male" /> Male
              </label>
              <label className="ml-4">
                <input {...register("gender")} type="radio" value="female" />{" "}
                Female
              </label>
            </fieldset>
            {errors.gender && (
              <p className="text-red-500">{errors.gender.message}</p>
            )}

            {/* Address */}
            <div className="relative mb-4">
              <FaHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                {...register("address")}
                type="text"
                placeholder="Address"
                className="w-full bg-Silver-6 pl-10 p-2 rounded-lg border border-Silver-2 focus:outline-none focus:ring-2 focus:ring-callToAction"
              />
            </div>
            {errors.address && (
              <p className="text-red-500">{errors.address.message}</p>
            )}

            {/* Date of Birth */}
            <div className="relative mb-4">
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                {...register("dateOfBirth")}
                type="date"
                className="w-full bg-Silver-6 pl-10 p-2 rounded-lg border border-Silver-2 focus:outline-none focus:ring-2 focus:ring-callToAction"
              />
            </div>
            {errors.dateOfBirth && (
              <p className="text-red-500">{errors.dateOfBirth.message}</p>
            )}

            {/* Insurance Provider Company */}
            <div className="relative mb-4">
              <FaShieldAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                {...register("insuranceProviderCompany")}
                type="text"
                placeholder="Insurance Provider Company"
                className="w-full bg-Silver-6 pl-10 p-2 rounded-lg border border-Silver-2 focus:outline-none focus:ring-2 focus:ring-callToAction"
              />
            </div>
            {errors.insuranceProviderCompany && (
              <p className="text-red-500">
                {errors.insuranceProviderCompany.message}
              </p>
            )}

            {/* Coverage Rate */}
            <div className="relative mb-4">
              <FaPercentage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                {...register("coverageRate")}
                type="text"
                placeholder="Coverage Rate (0-100%)"
                className="w-full bg-Silver-6 pl-10 p-2 rounded-lg border border-Silver-2 focus:outline-none focus:ring-2 focus:ring-callToAction"
              />
            </div>
            {errors.coverageRate && (
              <p className="text-red-500">{errors.coverageRate.message}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-500 text-white py-2 rounded-lg"
            >
              Submit
            </button>
            <ToastContainer />
          </form>
        </div>
      </ScrollArea>
    </SlidingDialog>
  );
}
