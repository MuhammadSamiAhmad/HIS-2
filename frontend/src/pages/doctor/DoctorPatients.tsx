import Table from "../../components/UI/Table";
import { MOCK_TABLE_DATA } from "../../utils/mockTable";
import { GridColDef } from "@mui/x-data-grid";
import { DoctorPatientRow } from "../../types/dataGridTypes";
import Image from "../../assets/images/Me.png";
import DoctorPatientsDialog from "./DoctorPatientsDialog";
import DiagnoseForm from "./DiagnoseForm";
import { patients } from "../../utils/mockHL7Data";
// import axios from "axios";


// const userData = sessionStorage.getItem('user');
// const user = JSON.parse(userData);
// console.log(user)
// const res = await axios.get("http://localhost:3307/dentist/patients", {params: {user: user}});
// const patients = res.data;
export default function DoctorPatients() {
  const columns: GridColDef<DoctorPatientRow>[] = [
    {
      field: "id",
      width: 400,
      headerAlign: "center",
      type: "number",
      renderHeader: () => (
        <h1 className="font-manrope text-textColor font-bold mr-10">{"ID"}</h1>
      ),
      renderCell: (params) => (
        <div className="flex flex-row items-center justify-center gap-4">
          <span className="w-[20px] text-Silver-1">{`${params.value}`}</span>
          <DoctorPatientsDialog />
        </div>
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
        <div className="ml-5 flex flex-row items-center justify-between h-[30px]">
          <div className="flex flex-row justify-start items-center gap-3">
            <img
              // src={Image}
              src={`../../../public/default.jpg`}
              // src={`../../../public/patient/${params.row.patientImage}`}
              alt={params.row.patientName}
              className="w-[45px] h-[45px] rounded-2xl object-fill border-2 border-Silver-2"
            />
            <span className="text-Silver-1">{params.row.patientName}</span>
          </div>
          <DiagnoseForm />
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
    <div>
      <Table columns={columns} rows={MOCK_TABLE_DATA.doctorPatients} />
      {/* <Table columns={columns} rows={patients} /> */}
    </div>
  );
}
