import Table from "../../components/UI/Table";
import Tabs from "../../components/UI/Tabs";
import { MOCK_TABLE_DATA } from "../../utils/mockTable";
import { GridColDef } from "@mui/x-data-grid";
import { DoctorAppointmentRow } from "../../types/dataGridTypes";
// import axios from "axios";

// const userData = sessionStorage.getItem('user');
// const user = JSON.parse(userData);
// console.log(user)
// const res = await axios.get("http://localhost:3307/dentist/reservations", {params: {user: user}});
// console.log(res.data);
// const {upcoming, past} = res.data;

export default function DoctorReservations() {
  const columns: GridColDef<DoctorAppointmentRow>[] = [
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
      field: "patientDetails",
      width: 300,
      headerAlign: "center",
      type: "custom",
      renderHeader: () => (
        <h1 className="font-manrope text-textColor font-bold">{"Patient"}</h1>
      ),
      renderCell: (params) => (
        <div className="ml-20 flex flex-row items-center justify-between h-[30px]">
          <div className="flex flex-row justify-start items-center gap-3">
            <img
              src={`../../../public/default.jpg`}
              // src={`../../../public/patient/${params.row.patientImage}`}
              alt={params.row.patientName}
              className="w-[45px] h-[45px] rounded-2xl object-fill border-2 border-Silver-2"
            />
            <span className="text-Silver-1">{params.row.patientName}</span>
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
        <Table<DoctorAppointmentRow>
          rows={MOCK_TABLE_DATA.doctorAppointments}
          // rows={upcoming}
          columns={columns}
        />
      ),
    },
    {
      label: "Past",
      value: "past",
      content: (
        <Table<DoctorAppointmentRow>
          rows={MOCK_TABLE_DATA.doctorAppointments}
          // rows={past}
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
