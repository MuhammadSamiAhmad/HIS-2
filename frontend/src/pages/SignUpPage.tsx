import { useNavigate } from "react-router-dom";
import GoogleIcon from "../assets/images/google icon 1.svg";
import Logo from "../assets/images/Logo.svg";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaUserAlt, FaLock, FaEnvelope, FaCalendarAlt } from "react-icons/fa";
import { BsGenderAmbiguous } from "react-icons/bs";

//All input types are strings because all outputs & inputs in html are strings
//.refine() - Adds a custom validation rule:
// - Takes the date string and attempts to create a new Date object
// - new Date(date).toString() returns "Invalid Date" if the string can't be parsed
// - Validation passes only if the result is NOT "Invalid Date"
// - If validation fails, shows the message "A valid date of birth is required."
//.transform() - Converts the validated string into an actual JavaScript Date object
const schema = z.object({
  fullName: z
    .string()
    .nonempty("Full name is required")
    .min(1, "A name is required")
    .max(100, "Maximum Number of letters reached"),
  username: z
    .string()
    .nonempty("Username is required")
    .min(1, "A user name is required")
    .max(100, "Maximum Number of letters reached"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  dateOfBirth: z
    .string()
    .refine((date) => new Date(date).toString() !== "Invalid Date", {
      message: "A valid date of birth is required.",
    })
    .transform((date) => new Date(date)),
  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Gender is required" }),
  }),
});

type FormFields = z.infer<typeof schema>;

const SignUpPage = () => {
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
    navigate("/sign-in");
  };

  const handleGoogleSignIn = () => {
    // TODO: Implement Google sign-in logic here
    // After successful Google sign-in, navigate to VerificationPage
    navigate("/verification");
  };

  return (
    <div className="font-manrope w-full max-w-md">
      <div className="flex flex-row items-center justify-center gap-10 mt-[10%] mb-16">
        <img src={Logo} className="size-14" alt="Logo" />
        <h2 className="text-[48px] font-manrope font-[500]">SanOris</h2>
      </div>
      <h2 className="text-center font-manrope text-[32px] font-semibold mb-10">
        Sign up
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="relative mb-4">
          <FaUserAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-Silver-2" />
          <input
            {...register("fullName")}
            type="text"
            placeholder="Full Name"
            className="w-full bg-Silver-6 pl-10 p-2 rounded-lg border border-Silver-2 focus:outline-none focus:ring-2 focus:ring-callToAction"
          />
        </div>
        {errors.fullName && (
          <div className="text-red-500 -mt-2 mb-2">
            {errors.fullName.message}
          </div>
        )}
        <div className="relative mb-4">
          <FaUserAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-Silver-2" />
          <input
            {...register("username")}
            type="text"
            placeholder="Username"
            className="w-full bg-Silver-6 pl-10 p-2 rounded-lg border border-Silver-2 focus:outline-none focus:ring-2 focus:ring-callToAction"
          />
        </div>
        {errors.username && (
          <div className="text-red-500 -mt-2 mb-2">
            {errors.username.message}
          </div>
        )}
        <div className="relative mb-4">
          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-Silver-2" />
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="w-full bg-Silver-6 pl-10 p-2 rounded-lg border border-Silver-2 focus:outline-none focus:ring-2 focus:ring-callToAction"
          />
        </div>
        {errors.email && (
          <div className="text-red-500 -mt-2 mb-2">{errors.email.message}</div>
        )}
        <div className="relative mb-4">
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-Silver-2" />
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className="w-full bg-Silver-6 pl-10 p-2 rounded-lg border border-Silver-2 focus:outline-none focus:ring-2 focus:ring-callToAction"
          />
        </div>
        {errors.password && (
          <div className="text-red-500 -mt-2 mb-2">
            {errors.password.message}
          </div>
        )}
        <div className="relative mb-4">
          <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-Silver-2" />
          <input
            {...register("dateOfBirth")}
            type="date"
            className="w-full bg-Silver-6 pl-10 p-2 rounded-lg border border-Silver-2 focus:outline-none focus:ring-2 focus:ring-callToAction placeholder-gray-500"
            placeholder="mm/dd/yyyy"
          />
        </div>
        {errors.dateOfBirth && (
          <div className="text-red-500 -mt-2 mb-2">
            {errors.dateOfBirth.message}
          </div>
        )}
        <div className="relative mb-4 flex items-center">
          <BsGenderAmbiguous className="absolute left-3 top-1/2 transform -translate-y-1/2 text-Silver-2" />
          <div
            id="gender"
            className="justify-center items-center ml-20 flex flex-row gap-10"
          >
            <div className="flex items-center">
              <input
                {...register("gender")}
                type="radio"
                value="male"
                className="mr-2"
              />
              <label>Male</label>
            </div>
            <div className="flex items-center">
              <input
                {...register("gender")}
                type="radio"
                value="female"
                className="mr-2"
              />
              <label>Female</label>
            </div>
          </div>
        </div>
        {errors.gender && (
          <div className="text-red-500 -mt-2 mb-2">{errors.gender.message}</div>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-callToAction text-background py-2 rounded-lg font-manrope"
        >
          Sign up
        </button>
        {errors.root && (
          <div className="text-red-500 -mt-2 mb-2">{errors.root.message}</div>
        )}
      </form>
      <div className="text-center mt-4">
        <button
          className="flex items-center justify-center bg-Silver-4 rounded-lg border p-2 w-full"
          onClick={handleGoogleSignIn}
        >
          <img src={GoogleIcon} alt="Google" className="w-5 h-5 mr-2" />
          <span className="font-manrope">Sign up with Google</span>
        </button>
      </div>
      <p className="text-center text-base font-manrope mt-2 text-Silver-2 font-medium">
        Already have an account?{" "}
        <span
          className="text-blue-500 cursor-pointer underline"
          onClick={() => navigate("/sign-in")} // Navigate to SignInPage
        >
          Sign in here!
        </span>
      </p>
    </div>
  );
};

export default SignUpPage;
