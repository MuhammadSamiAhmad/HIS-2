import SlidingDialog from "../../components/UI/SlidingDialog";
import Expand from "../../assets/images/export.svg";
import { mockInvoiceData } from "../../utils/mockInvoiceData";
import { useEffect, useState } from "react";

const InvoicesDialog = () => {
  const [invoiceData, setInvoiceData] = useState<typeof mockInvoiceData | null>(
    null
  );

  // Simulate fetching data from a backend
  useEffect(() => {
    const fetchInvoiceData = async () => {
      const fetchData = new Promise<typeof mockInvoiceData>((resolve) =>
        setTimeout(() => resolve(mockInvoiceData), 1000)
      );
      const data = await fetchData;
      setInvoiceData(data);
    };

    fetchInvoiceData();
  }, []);

  if (!invoiceData) {
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
      title={`Invoice #${invoiceData.invoiceId}`}
    >
      <div className="flex flex-col gap-6 font-manrope text-sm text-gray-800 p-4">
        {/* Date */}
        <div className="flex justify-between items-center border-b pb-2">
          <span className="font-semibold text-gray-700">Date</span>
          <span className="text-gray-600">{invoiceData.date}</span>
        </div>

        {/* Total Cost */}
        <div className="flex justify-between items-center border-b pb-2">
          <span className="font-semibold text-gray-700">Total Cost</span>
          <span className="text-gray-600">${invoiceData.totalCost}</span>
        </div>

        {/* Insurance Coverage */}
        <div className="flex justify-between items-center border-b pb-2">
          <span className="font-semibold text-gray-700">
            Insurance Coverage
          </span>
          <span className="text-gray-600">
            {invoiceData.insuranceCoverage}%
          </span>
        </div>

        {/* Payment Status */}
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-700">Payment Status</span>
          <span
            className={`font-medium ${
              invoiceData.paymentStatus === "Paid"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {invoiceData.paymentStatus}
          </span>
        </div>
      </div>
    </SlidingDialog>
  );
};

export default InvoicesDialog;
