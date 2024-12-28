import Table from "../../components/UI/Table";
import { MOCK_TABLE_DATA } from "../../utils/mockTable";
import { GridColDef } from "@mui/x-data-grid";
import { AdminDoctorRow } from "../../types/dataGridTypes";
import Image from "../../assets/images/Me.png";
import AddDoctorForm from "./AddDoctorForm";

export default function EmployeeDoctors() {
  const columns: GridColDef<AdminDoctorRow>[] = [
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
      field: "doctorDetails",
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
              alt={params.row.doctorName}
              className="ml-10 w-[45px] h-[45px] rounded-2xl object-fill border-2 border-Silver-2"
            />
            <span className="text-Silver-1">{params.row.doctorName}</span>
          </div>
        </div>
      ),
    },
    {
      field: "age",
      width: 200,
      headerAlign: "center",
      type: "string",
      renderHeader: () => (
        <h1 className="font-manrope text-textColor font-bold">{"Age"}</h1>
      ),
      renderCell: (params) => (
        <span className="text-Silver-1">{params.row.age}</span>
      ),
    },
    {
      field: "email",
      width: 300,
      headerAlign: "center",
      type: "string",
      renderHeader: () => (
        <h1 className="font-manrope text-textColor font-bold">{"Email"}</h1>
      ),
      renderCell: (params) => (
        <span className="text-Silver-1">{params.row.email}</span>
      ),
    },
    {
      field: "gender",
      width: 150,
      headerAlign: "center",
      type: "string",
      renderHeader: () => (
        <h1 className="font-manrope text-textColor font-bold">{"Gender"}</h1>
      ),
      renderCell: (params) => (
        <span className="text-Silver-1">{params.row.gender}</span>
      ),
    },
  ];
  return (
    <div className="flex flex-col xl:w-[1600px] items-end">
      <AddDoctorForm />
      <Table columns={columns} rows={MOCK_TABLE_DATA.adminDoctors} />
    </div>
  );
}
