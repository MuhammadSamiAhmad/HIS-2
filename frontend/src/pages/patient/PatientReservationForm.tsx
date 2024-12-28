import SlidingDialog from "../../components/UI/SlidingDialog";
import AddIcon from "../../assets/images/add-1--expand-cross-buttons-button-more-remove-plus-add-+-mathematics-math.svg";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { FaCalendarAlt, FaStethoscope } from "react-icons/fa";
import ScrollArea from "../../components/UI/ScrollArea";

// Define validation schema with Zod
const schema = z.object({
  doctor: z.string().nonempty("Consulting Doctor is required"),
  dateOfAppointment: z
    .string()
    .refine((date) => new Date(date).toString() !== "Invalid Date", {
      message: "A valid Date of Appointment is required",
    }),
  visitReason: z.string().nonempty("Visit Reason is required"),
});

type FormFields = z.infer<typeof schema>;

export default function BookAppointment() {
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
    alert("Appointment successfully booked!");
  };

  return (
    <SlidingDialog
      trigger={
        <button className="w-fit py-2 px-4 flex flex-row gap-3 items-center bg-callToAction text-white rounded-md -mt-8 mb-5 mr-16 hover:bg-callToAction-900">
          <img className="size-4" src={AddIcon} alt="" /> Book a Reservation
        </button>
      }
      title="Book Reservation"
    >
      <ScrollArea>
        <div className="font-manrope w-full max-w-md mx-auto mt-2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="relative mb-4">
              <FaStethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                {...register("doctor")}
                type="text"
                placeholder="Consulting Doctor"
                className="w-full bg-Silver-6 pl-10 p-2 rounded-lg border border-Silver-2 focus:outline-none focus:ring-2 focus:ring-callToAction"
              />
            </div>
            {errors.doctor && (
              <div className="text-red-500 -mt-2 mb-2">
                {errors.doctor.message}
              </div>
            )}

            <div className="relative mb-4">
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                {...register("dateOfAppointment")}
                type="date"
                className="w-full bg-Silver-6 pl-10 p-2 rounded-lg border border-Silver-2 focus:outline-none focus:ring-2 focus:ring-callToAction"
              />
            </div>
            {errors.dateOfAppointment && (
              <div className="text-red-500 -mt-2 mb-2">
                {errors.dateOfAppointment.message}
              </div>
            )}

            <div className="relative mb-4">
              <textarea
                {...register("visitReason")}
                placeholder="Reason for Visit"
                className="w-full bg-Silver-6  p-2 rounded-lg border border-Silver-2 focus:outline-none focus:ring-2 focus:ring-callToAction"
              />
            </div>
            {errors.visitReason && (
              <div className="text-red-500 -mt-2 mb-2">
                {errors.visitReason.message}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Booking..." : "Book Appointment"}
            </button>
          </form>
        </div>
      </ScrollArea>
    </SlidingDialog>
  );
}
