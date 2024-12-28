import SlidingDialog from "../../components/UI/SlidingDialog";
import AddIcon from "../../assets/images/add-1--expand-cross-buttons-button-more-remove-plus-add-+-mathematics-math.svg";

const PatientReservationForm = () => {
  return (
    <SlidingDialog
      trigger={
        <button className="w-fit py-2 px-4 flex flex-row gap-3 items-center bg-callToAction text-white rounded-md -mt-8 mb-5 mr-16 hover:bg-callToAction-900">
          <img className="size-4" src={AddIcon} alt="" /> New Reservation
        </button>
      }
      title="Reservation #Res0235"
    >
      <div className="flex flex-col gap-4 font-manrope">
        {/* Patient Info */}
        <div className="flex justify-between items-center">
          <span className="font-medium">Patient</span>
          <div className="flex gap-2">
            <span className="text-gray-600">Muhammed Sami</span>
            <span className="text-gray-400">#Pat0905</span>
          </div>
        </div>

        {/* Date & Time */}
        <div className="flex justify-between items-center">
          <span className="font-medium">Date & Time</span>
          <span className="text-gray-600">2024/01/31, 15:00</span>
        </div>

        {/* Category */}
        <div className="flex justify-between items-center">
          <span className="font-medium">Category</span>
          <span className="text-gray-600">Surgery</span>
        </div>

        {/* Treatment */}
        <div className="flex justify-between items-center">
          <span className="font-medium">Treatment</span>
          <span className="text-gray-600">Tooth Filling</span>
        </div>

        {/* Medications */}
        <div className="flex flex-col gap-2">
          <span className="font-medium">Medications</span>
          <div className="ml-4 flex flex-col gap-1">
            <div className="flex justify-between">
              <span className="text-gray-500">Medicine</span>
              <span className="text-gray-600">Aspirin</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Dosage</span>
              <span className="text-gray-600">50 ml</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Frequency</span>
              <span className="text-gray-600">3 Times per week</span>
            </div>
          </div>
        </div>

        {/* Payment Status */}
        <div className="flex justify-between items-center">
          <span className="font-medium">Payment</span>
          <span className="text-green-600">Paid</span>
        </div>
      </div>
    </SlidingDialog>
  );
};

export default PatientReservationForm;
