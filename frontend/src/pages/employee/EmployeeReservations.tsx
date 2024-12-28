import Table from "../../components/UI/Table";
import Tabs from "../../components/UI/Tabs";
import { MOCK_TABLE_DATA } from "../../utils/mockTable";
import { GridColDef } from "@mui/x-data-grid";
import { AdminAppointmentRow } from "../../types/dataGridTypes";

export default function EmployeeReservations() {
  const columns: GridColDef<AdminAppointmentRow>[] = [
    {
      field: "id",
      width: 70,
      headerAlign: "center",
      type: "number",
      renderHeader: () => (
        <h1 className="font-manrope text-textColor font-bold">{"ID"}</h1>
      ),
      renderCell: (params) => (
        <span className="text-Silver-1">{params.row.id}</span>
      ),
    },
    {
      field: "patientName",
      width: 200,
      headerAlign: "center",
      type: "string",
      renderHeader: () => (
        <h1 className="font-manrope text-textColor font-bold">{"Patient"}</h1>
      ),
      renderCell: (params) => (
        <span className="text-Silver-1">{params.row.patientName}</span>
      ),
    },
    {
      field: "dentistName",
      width: 200,
      headerAlign: "center",
      type: "string",
      renderHeader: () => (
        <h1 className="font-manrope text-textColor font-bold">{"Doctor"}</h1>
      ),
      renderCell: (params) => (
        <span className="text-Silver-1">{params.row.dentistName}</span>
      ),
    },
    {
      field: "category",
      width: 150,
      headerAlign: "center",
      type: "custom",
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
      field: "status",
      width: 200,
      headerAlign: "center",
      type: "string",
      renderHeader: () => (
        <h1 className="font-manrope text-textColor font-bold">{"Status"}</h1>
      ),
      renderCell: (params) => (
        <p
          className={`mt-4 mx-auto ${
            params.row.status == "Unpaid"
              ? "text-UtilColors-Red bg-red-100"
              : params.row.status == "Paid"
              ? "text-UtilColors-Green bg-green-100"
              : "text-UtilColors-Orange bg-orange-100"
          } text-sm text-center rounded-full w-[100px]`}
        >
          {params.row.status}
        </p>
      ),
    },
  ];

  const tabs = [
    {
      label: "Upcoming",
      value: "upcoming",
      content: (
        <Table<AdminAppointmentRow>
          rows={MOCK_TABLE_DATA.adminAppointments}
          columns={columns}
        />
      ),
    },
    {
      label: "Past",
      value: "past",
      content: (
        <Table<AdminAppointmentRow>
          rows={MOCK_TABLE_DATA.adminAppointments}
          columns={columns}
        />
      ),
    },
  ];

  return (
    <div>
      <Tabs tabs={tabs} />
    </div>
  );
}
