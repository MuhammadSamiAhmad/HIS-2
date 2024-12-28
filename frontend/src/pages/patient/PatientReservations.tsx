import Table from "../../components/UI/Table";
import Tabs from "../../components/UI/Tabs";
import { MOCK_TABLE_DATA } from "../../utils/mockTable";
import { GridColDef } from "@mui/x-data-grid";
import Image from "../../assets/images/Me.png";
import {
  PatientUpcomingVisitRow,
  PatientPastVisitRow,
} from "../../types/dataGridTypes";
import PatientReservationDialog from "./PatientReservationDialog";
import PatientReservationForm from "./PatientReservationForm";

export default function PatientReservations() {
  // Define columns with proper typing
  const upcomingColumns: GridColDef<PatientUpcomingVisitRow>[] = [
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
      field: "dentistDetails",
      width: 300,
      headerAlign: "center",
      type: "custom",
      renderHeader: () => (
        <h1 className="font-manrope text-textColor font-bold">{"Doctor"}</h1>
      ),
      renderCell: (params) => (
        <div className="flex flex-row items-center justify-between h-[30px]">
          <div className="flex flex-row justify-start items-center gap-3">
            <img
              src={Image}
              alt={params.row.dentistName}
              className="ml-10 w-[45px] h-[45px] rounded-2xl object-fill border-2 border-Silver-2"
            />
            <span className="text-Silver-1">{params.row.dentistName}</span>
          </div>
        </div>
      ),
    },
    {
      field: "category",
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
  ];

  const pastColumns: GridColDef<PatientPastVisitRow>[] = [
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
          <PatientReservationDialog />
        </div>
      ),
    },
    {
      field: "dentistDetails",
      headerName: "Dentist",
      width: 300,
      headerAlign: "center",
      type: "custom",
      renderHeader: () => (
        <h1 className="font-manrope text-textColor font-bold">{"Doctor"}</h1>
      ),
      renderCell: (params) => (
        <div className="flex flex-row items-center justify-between h-[30px]">
          <div className="flex flex-row justify-start items-center gap-3">
            <img
              src={Image}
              alt={params.row.dentistName}
              className="ml-10 w-[45px] h-[45px] rounded-2xl object-fill border-2 border-Silver-2"
            />
            <span className="text-Silver-1">{params.row.dentistName}</span>
          </div>
        </div>
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
  ];

  const tabs = [
    {
      label: "Upcoming",
      value: "upcoming",
      content: (
        <>
          <div className="flex flex-col xl:w-[1600px] items-end">
            <PatientReservationForm />
            <Table<PatientUpcomingVisitRow>
              rows={MOCK_TABLE_DATA.upcoming}
              columns={upcomingColumns}
            />
          </div>
        </>
      ),
    },
    {
      label: "Past",
      value: "past",
      content: (
        <Table<PatientPastVisitRow>
          rows={MOCK_TABLE_DATA.past}
          columns={pastColumns}
        />
      ),
    },
  ];

  return (
    <div className="w-full h-full mx-auto font-manrope">
      <Tabs tabs={tabs} />
    </div>
  );
}
