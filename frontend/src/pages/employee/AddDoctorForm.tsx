import SlidingDialog from "../../components/UI/SlidingDialog";
import AddIcon from "../../assets/images/add-1--expand-cross-buttons-button-more-remove-plus-add-+-mathematics-math.svg";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FaUserAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaLock,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaBriefcase,
} from "react-icons/fa";

// Define the schema for validation
const schema = z
  .object({
    firstName: z
      .string()
      .nonempty("First name is required")
      .max(100, "Maximum 100 characters allowed"),
    lastName: z
      .string()
      .nonempty("Last name is required")
      .max(100, "Maximum 100 characters allowed"),
    contactNumber: z
      .string()
      .regex(/^\+?[0-9]{10,15}$/, "Invalid contact number"),
    degree: z.string().nonempty("Degree is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    reenterPassword: z
      .string()
      .min(8, "Re-enter Password must be at least 8 characters"),
    workingHours: z.string().nonempty("Working hours are required"),
    gender: z.enum(["male", "female"], {
      errorMap: () => ({ message: "Gender is required" }),
    }),
    address: z.string().nonempty("Address is required"),
    dateOfBirth: z
      .string()
      .refine((date) => new Date(date).toString() !== "Invalid Date", {
        message: "A valid date of birth is required.",
      })
      .transform((date) => new Date(date)),
  })
  .refine((data) => data.password === data.reenterPassword, {
    message: "Passwords must match",
    path: ["reenterPassword"],
  });

type FormFields = z.infer<typeof schema>;

export default function AddDoctorForm() {
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
          <img className="size-4" src={AddIcon} alt="" /> Add Doctor
        </button>
      }
      title="New Doctor"
    >
      <div className="font-manrope w-full max-w-md mx-auto mt-16">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* First Name */}
          <div className="relative mb-4">
            <FaUserAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
            <FaUserAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
            <FaPhoneAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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

          {/* Degree */}
          <div className="relative mb-4">
            <FaBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              {...register("degree")}
              type="text"
              placeholder="Degree"
              className="w-full bg-Silver-6 pl-10 p-2 rounded-lg border border-Silver-2 focus:outline-none focus:ring-2 focus:ring-callToAction"
            />
          </div>
          {errors.degree && (
            <p className="text-red-500">{errors.degree.message}</p>
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

          {/* Re-enter Password */}
          <div className="relative mb-4">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              {...register("reenterPassword")}
              type="password"
              placeholder="Re-enter Password"
              className="w-full bg-Silver-6 pl-10 p-2 rounded-lg border border-Silver-2 focus:outline-none focus:ring-2 focus:ring-callToAction"
            />
          </div>
          {errors.reenterPassword && (
            <p className="text-red-500">{errors.reenterPassword.message}</p>
          )}

          {/* Gender */}
          <div className="mb-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center">
                <input
                  {...register("gender")}
                  type="radio"
                  value="male"
                  className="mr-2"
                />
                Male
              </label>
              <label className="flex items-center">
                <input
                  {...register("gender")}
                  type="radio"
                  value="female"
                  className="mr-2"
                />
                Female
              </label>
            </div>
            {errors.gender && (
              <p className="text-red-500">{errors.gender.message}</p>
            )}
          </div>

          {/* Address */}
          <div className="relative mb-4">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
