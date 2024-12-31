import { useNavigate } from "react-router-dom";
import GoogleIcon from "../assets/images/google icon 1.svg";
import Logo from "../assets/images/Logo.svg";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { useAuthStore } from "../store/authStore";
import { signInUser, MOCK_USERS } from "../utils/mockAuth";
import axios from "axios";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormFields = z.infer<typeof schema>;

const SignInPage = () => {
  const navigate = useNavigate(); // For navigation
  const { login } = useAuthStore(); // Extract login function from auth store

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const response = await signInUser(data.email, data.password);
    login(response.user);

    // Redirect based on user role
    switch (response.user.role) {
      case "admin":
        navigate("/admin-dashboard");
        break;
      case "doctor":
        navigate("/doctor-reservations");
        break;
      case "patient":
        navigate("/patient-reservations");
        break;
      default:
        throw new Error("Invalid user role");
    }
  };

  // const onSubmit: SubmitHandler<FormFields> = async (data) => {
  //   const response = await axios.post("http://localhost:3307/login", {username: data.email, password: data.password});
  //   // const {user, role} = response.data;
  //   console.log(response.data);
  //   sessionStorage.setItem('user', JSON.stringify(response.data));
  //   login(response.data);
  //   // Redirect based on user role
  //   switch (response.data.role) {
  //     case "admin":
  //       navigate("/admin-dashboard");
  //       break;
  //     case "doctor":
  //       navigate("/doctor-reservations");
  //       break;
  //     case "patient":
  //       navigate("/patient-reservations");
  //       break;
  //     default:
  //       throw new Error("Invalid user role");
  //   }
  // };

  const handleGoogleSignIn = async () => {
    // Implement Google sign-in logic here
    // After successful Google authentication, you would:
    // 1. Get user data and token from Google
    // 2. Validate with your backend
    // 3. Update auth store
    // 4. Navigate to appropriate dashboard

    navigate("/verification");
  };

  return (
    <div className="font-manrope w-full max-w-md">
      <div className="flex flex-row items-center justify-center gap-10 mt-[10%] mb-16">
        <img src={Logo} className="size-14" alt="Logo" />
        <h2 className="text-[48px] font-manrope font-[500]">SanOris</h2>
      </div>
      <h2 className="text-center font-manrope text-[32px] font-semibold mb-10">
        Sign in
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="font-manrope relative mb-4">
          <FaUserAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-Silver-2" />
          <input
            {...register("email")}
            type="text"
            placeholder="Username or Email"
            className="w-full bg-Silver-6 pl-10 p-2 rounded-lg border border-Silver-2 focus:outline-none focus:ring-2 focus:ring-callToAction"
          />
        </div>
        {errors.email && (
          <div className="text-red-500 -mt-2 mb-2 font-manrope">
            {errors.email.message}
          </div>
        )}
        <div className="font-manrope relative mb-4">
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-Silver-2" />

          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className="w-full bg-Silver-6 pl-10 p-2 rounded-lg border border-Silver-2 focus:outline-none focus:ring-2 focus:ring-callToAction"
          />
        </div>
        {errors.password && (
          <div className="text-red-500 -mt-2 mb-2 font-manrope">
            {errors.password.message}
          </div>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-callToAction text-background py-2 rounded-lg font-manrope"
        >
          Sign in
        </button>
        {errors.root && (
          <div className="text-red-500 -mt-2 mb-2 font-manrope">
            {errors.root.message}
          </div>
        )}
      </form>
      <div className="font-manrope text-center mt-4">
        <button
          className="flex items-center justify-center bg-Silver-4 rounded-lg border p-2 w-full"
          onClick={handleGoogleSignIn}
        >
          <img src={GoogleIcon} alt="Google" className="w-5 h-5 mr-2" />
          <span className="font-manrope">Sign in with Google</span>
        </button>
      </div>
      <p className="text-center text-base font-manrope mt-2 text-Silver-2 font-medium">
        Don't have an account?{" "}
        <span
          className="text-blue-500 cursor-pointer underline"
          onClick={() => navigate("/sign-up")} // Navigate to SignUpPage
        >
          Register here!
        </span>
      </p>
    </div>
  );
};

export default SignInPage;
