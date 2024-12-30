import { TextField, Autocomplete } from "@mui/material";
import SlidingDialog from "../../components/UI/SlidingDialog";
import AddIcon from "../../assets/images/add-1--expand-cross-buttons-button-more-remove-plus-add-+-mathematics-math.svg";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FaUserAlt,
  FaPhoneAlt,
  FaCalendarAlt,
  FaBriefcase,
  FaIdCard,
  FaClock,
} from "react-icons/fa";
import ScrollArea from "../../components/UI/ScrollArea";

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
    specialization: z.string().nonempty("Specialization is required"),
    ssn: z.string().regex(/^[0-9]{9}$/, "SSN must be a 9-digit number"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    reenterPassword: z
      .string()
      .min(8, "Re-enter Password must be at least 8 characters"),
    workingDays: z.array(z.string()).min(1, "Select at least one working day"),
    shiftStartTime: z.string().nonempty("Shift start time is required"),
    shiftEndTime: z.string().nonempty("Shift end time is required"),
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

const workingDayOptions = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function AddDoctorForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
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
      <ScrollArea>
        <div className="font-manrope w-full max-w-md mx-auto mt-2 h-[700px]">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* First Name */}
            <TextField
              {...register("firstName")}
              label="First Name"
              variant="outlined"
              fullWidth
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              InputProps={{
                startAdornment: (
                  <span className="ml-2 text-gray-400">
                    <FaUserAlt />
                  </span>
                ),
              }}
              sx={{ mb: 2 }}
            />

            {/* Last Name */}
            <TextField
              {...register("lastName")}
              label="Last Name"
              variant="outlined"
              fullWidth
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              InputProps={{
                startAdornment: (
                  <span className="ml-2 text-gray-400">
                    <FaUserAlt />
                  </span>
                ),
              }}
              sx={{ mb: 2 }}
            />

            {/* Contact Number */}
            <TextField
              {...register("contactNumber")}
              label="Contact Number"
              variant="outlined"
              fullWidth
              error={!!errors.contactNumber}
              helperText={errors.contactNumber?.message}
              InputProps={{
                startAdornment: (
                  <span className="ml-2 text-gray-400">
                    <FaPhoneAlt />
                  </span>
                ),
              }}
              sx={{ mb: 2 }}
            />

            {/* Degree */}
            <TextField
              {...register("degree")}
              label="Degree"
              variant="outlined"
              fullWidth
              error={!!errors.degree}
              helperText={errors.degree?.message}
              InputProps={{
                startAdornment: (
                  <span className="ml-2 text-gray-400">
                    <FaBriefcase />
                  </span>
                ),
              }}
              sx={{ mb: 2 }}
            />

            {/* Specialization */}
            <TextField
              {...register("specialization")}
              label="Specialization"
              variant="outlined"
              fullWidth
              error={!!errors.specialization}
              helperText={errors.specialization?.message}
              InputProps={{
                startAdornment: (
                  <span className="ml-2 text-gray-400">
                    <FaIdCard />
                  </span>
                ),
              }}
              sx={{ mb: 2 }}
            />

            {/* SSN */}
            <TextField
              {...register("ssn")}
              label="SSN"
              variant="outlined"
              fullWidth
              error={!!errors.ssn}
              helperText={errors.ssn?.message}
              InputProps={{
                startAdornment: (
                  <span className="ml-2 text-gray-400">
                    <FaIdCard />
                  </span>
                ),
              }}
              sx={{ mb: 2 }}
            />

            {/* Working Days */}
            <Autocomplete
              multiple
              options={workingDayOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Working Days"
                  error={!!errors.workingDays}
                  helperText={errors.workingDays?.message}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <span className="ml-2 text-gray-400">
                        <FaCalendarAlt />
                      </span>
                    ),
                  }}
                />
              )}
              onChange={(_, value) => setValue("workingDays", value)}
              sx={{ mb: 2 }}
            />

            {/* Shift Start Time */}
            <TextField
              {...register("shiftStartTime")}
              label="Shift Start Time"
              type="time"
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={!!errors.shiftStartTime}
              helperText={errors.shiftStartTime?.message}
              InputProps={{
                startAdornment: (
                  <span className="ml-2 text-gray-400">
                    <FaClock />
                  </span>
                ),
              }}
              sx={{ mb: 2 }}
            />

            {/* Shift End Time */}
            <TextField
              {...register("shiftEndTime")}
              label="Shift End Time"
              type="time"
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={!!errors.shiftEndTime}
              helperText={errors.shiftEndTime?.message}
              InputProps={{
                startAdornment: (
                  <span className="ml-2 text-gray-400">
                    <FaClock />
                  </span>
                ),
              }}
              sx={{ mb: 2 }}
            />

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
      </ScrollArea>
    </SlidingDialog>
  );
}
