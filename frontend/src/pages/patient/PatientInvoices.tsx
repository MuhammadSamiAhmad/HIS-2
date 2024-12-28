import Table from "../../components/UI/Table";
import { MOCK_TABLE_DATA } from "../../utils/mockTable";
import { GridColDef } from "@mui/x-data-grid";
import { PatientInvoiceRow } from "../../types/dataGridTypes";
import InvoicesDialog from "./InvoicesDialog";

export default function PatientInvoices() {
  const invoicesColumns: GridColDef<PatientInvoiceRow>[] = [
    {
      field: "id",
      width: 200,
      headerAlign: "center",
      type: "number",
      renderHeader: () => (
        <h1 className="font-manrope text-textColor font-bold mr-10">{"ID"}</h1>
      ),
      renderCell: (params) => (
        <div className="flex flex-row items-center justify-center gap-4">
          <span className="w-[20px] text-Silver-1">{`${params.value}`}</span>
          <InvoicesDialog />
        </div>
      ),
    },
    {
      field: "treatment",
      width: 200,
      headerAlign: "center",
      type: "string",
      renderHeader: () => (
        <h1 className="font-manrope text-textColor font-bold">{"Treatment"}</h1>
      ),
      renderCell: (params) => (
        <span className="text-Silver-1">{params.row.treatment}</span>
      ),
    },
    {
      field: "category",
      headerName: "Category",
      width: 150,
      headerAlign: "center",
      type: "string",
      renderHeader: () => (
        <h1 className="font-manrope text-textColor font-bold">{"Category"}</h1>
      ),
      renderCell: (params) => (
        <p
          className={`mt-4 mx-auto ${
            params.row.category == "Surgery"
              ? "text-UtilColors-Red bg-red-100"
              : params.row.category == "Examination"
              ? "text-UtilColors-Orange bg-orange-100"
              : "text-UtilColors-Blue bg-blue-100"
          } text-sm text-center rounded-full w-[100px]`}
        >
          {params.row.category}
        </p>
      ),
    },
    {
      field: "dateTime",
      headerName: "Date & Time",
      width: 200,
      headerAlign: "center",
      type: "string",
      renderHeader: () => (
        <h1 className="font-manrope text-textColor font-bold">
          {"Date & Time"}
        </h1>
      ),
      renderCell: (params) => (
        <span className="text-Silver-1">{params.row.dateTime}</span>
      ),
    },
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      width: 150,
      headerAlign: "center",
      type: "string",
      renderHeader: () => (
        <h1 className="font-manrope text-textColor font-bold">{"Status"}</h1>
      ),
      renderCell: (params) => (
        <p
          className={`mt-4 mx-auto ${
            params.row.paymentStatus == "Unpaid"
              ? "text-UtilColors-Red bg-red-100"
              : params.row.paymentStatus == "Paid"
              ? "text-UtilColors-Green bg-green-100"
              : "text-UtilColors-Orange bg-orange-100"
          } text-sm text-center rounded-full w-[100px]`}
        >
          {params.row.paymentStatus}
        </p>
      ),
    },
    {
      field: "insuranceCoverage",
      headerName: "Insurance Coverage",
      width: 200,
      headerAlign: "center",
      type: "string",
      renderHeader: () => (
        <h1 className="font-manrope text-textColor font-bold">
          {"Insurance Coverage"}
        </h1>
      ),
      renderCell: (params) => (
        <span className="text-Silver-1">{params.row.insuranceCoverage}</span>
      ),
    },
  ];
  return (
    <div>
      <Table columns={invoicesColumns} rows={MOCK_TABLE_DATA.invoices} />
    </div>
  );
}
