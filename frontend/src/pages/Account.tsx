import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../store/authStore";
import axios from "axios";
import { Avatar } from "../components/UI/Avatar";

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email"),
  profileImage: z
    .any()
    .refine(
      (file) => file instanceof File || file === null,
      "Invalid file type"
    ),
});

type FormFields = z.infer<typeof schema>;

const Account = () => {
  const { currentUser, login } = useAuthStore(); // Fetch current user and login method
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: currentUser?.username,
      email: currentUser?.email,
      profileImage: null,
    },
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("email", data.email);
      if (data.profileImage) {
        formData.append("profileImage", data.profileImage);
      }

      // Simulate API call to update user details
      const response = await axios.post("/api/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      login(response.data.user, response.data.token); // Update user info in store
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-6 max-w-md mx-auto mt-6"
    >
      {/* Avatar Section */}
      <div className="flex flex-col items-center">
        <Avatar
          profileImage={currentUser?.profileImage || ""}
          username={currentUser?.username || ""}
        />
        <input
          type="file"
          {...register("profileImage")}
          className="mt-4"
          accept="image/*"
        />
      </div>

      {/* Username */}
      <div>
        <label htmlFor="username" className="block mb-1 font-medium">
          Username
        </label>
        <input
          {...register("username")}
          type="text"
          className="w-full p-2 border rounded-md"
        />
        {errors.username && (
          <p className="text-red-500">{errors.username.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block mb-1 font-medium">
          Email
        </label>
        <input
          {...register("email")}
          type="email"
          className="w-full p-2 border rounded-md"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default Account;
