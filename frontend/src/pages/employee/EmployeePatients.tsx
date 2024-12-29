import Table from "../../components/UI/Table";
import { MOCK_TABLE_DATA } from "../../utils/mockTable";
import { GridColDef } from "@mui/x-data-grid";
import { AdminPatientsRow } from "../../types/dataGridTypes";
import Image from "../../assets/images/Me.png";
import AddPatientForm from "./AddPatientForm";
// import axios from "axios";


// const res = await axios.get("http://localhost:3307/admin/patients");
// const patients = res.data;
// console.log(patients);
export default function EmployeePatients() {
  const columns: GridColDef<AdminPatientsRow>[] = [
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
              // src={Image}
              src={`../../../public/default.jpg`}
              // src={`../../../public/patient/${params.row.patientImage}`}
              alt={params.row.patientName}
              className="w-[45px] h-[45px] rounded-2xl object-fill border-2 border-Silver-1"
            />
            <span className="text-Silver-1">{params.row.patientName}</span>
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
    {
      field: "bloodGroup",
      width: 150,
      headerAlign: "center",
      type: "string",
      renderHeader: () => (
        <h1 className="font-manrope text-textColor font-bold">
          {"Blood Group"}
        </h1>
      ),
      renderCell: (params) => (
        <span className="text-Silver-1">{params.row.bloodGroup}</span>
      ),
    },
  ];
  return (
    <div className="flex flex-col xl:w-[1600px] items-end">
      <AddPatientForm />
      {/* <Table columns={columns} rows={patients} /> */}
      <Table columns={columns} rows={MOCK_TABLE_DATA.adminPatients} />
    </div>
  );
}
