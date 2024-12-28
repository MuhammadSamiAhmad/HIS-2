import SlidingDialog from "../../components/UI/SlidingDialog";
import Expand from "../../assets/images/export.svg";
import { mockReservationData } from "../../utils/mockReservationdata";
import { useEffect, useState } from "react";
const PatientReservationDialog = () => {
  const [reservationData, setReservationData] = useState<
    typeof mockReservationData | null
  >(null);

  // Simulate fetching data from a backend
  useEffect(() => {
    const fetchReservationData = async () => {
      // Simulate delay for fetching data
      const fetchData = new Promise<typeof mockReservationData>((resolve) =>
        setTimeout(() => resolve(mockReservationData), 1000)
      );
      const data = await fetchData;
      setReservationData(data);
    };

    fetchReservationData();
  }, []);

  if (!reservationData) {
    return (
      <SlidingDialog
        trigger={
          <button className="w-[80px] px-1 py-0 flex gap-1 items-center bg-Silver-4 text-textColor rounded-md hover:bg-callToAction-300">
            <p className="text-sm text-Silver-1">Expand</p>{" "}
            <img className="p-0 size-3" src={Expand} alt="expand" />
          </button>
        }
        title="Loading..."
      >
        <div className="p-4 text-gray-500 text-center">Loading data...</div>
      </SlidingDialog>
    );
  }

  return (
    <SlidingDialog
      trigger={
        <button className="w-[80px] px-1 py-0 flex gap-1 items-center bg-Silver-4 text-textColor rounded-md hover:bg-callToAction-300">
          <p className="text-sm text-Silver-1">Expand</p>{" "}
          <img className="p-0 size-3" src={Expand} alt="expand" />
        </button>
      }
      title={`Reservation #${reservationData.reservationId}`}
    >
      <div className="flex flex-col gap-6 font-manrope text-sm text-gray-800 p-4">
        {/* Patient Info */}
        <div className="flex justify-between items-center border-b pb-2">
          <span className="font-semibold text-gray-700">Patient</span>
          <div className="flex gap-2 text-right">
            <span className="font-medium text-gray-800">
              {reservationData.patient.name}
            </span>
            <span className="text-gray-500">#{reservationData.patient.id}</span>
          </div>
        </div>

        {/* Date & Time */}
        <div className="flex justify-between items-center border-b pb-2">
          <span className="font-semibold text-gray-700">Date & Time</span>
          <span className="text-gray-600">{reservationData.dateTime}</span>
        </div>

        {/* Category */}
        <div className="flex justify-between items-center border-b pb-2">
          <span className="font-semibold text-gray-700">Category</span>
          <span className="text-gray-600">{reservationData.category}</span>
        </div>

        {/* Treatment */}
        <div className="flex justify-between items-center border-b pb-2">
          <span className="font-semibold text-gray-700">Treatment</span>
          <span className="text-gray-600">{reservationData.treatment}</span>
        </div>

        {/* Medications */}
        <div className="flex flex-col gap-3 border-b pb-2">
          <span className="font-semibold text-gray-700">Medications</span>
          <div className="ml-4 flex flex-col gap-2 text-gray-600">
            {reservationData.medications.map((med, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-gray-500">{med.label}</span>
                <span>{med.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Status */}
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-700">Payment</span>
          <span
            className={`font-medium ${
              reservationData.paymentStatus === "Paid"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {reservationData.paymentStatus}
          </span>
        </div>
      </div>
    </SlidingDialog>
  );
};

export default PatientReservationDialog;
