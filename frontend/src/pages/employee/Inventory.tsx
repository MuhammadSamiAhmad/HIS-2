import Table from "../../components/UI/Table";
import { MOCK_TABLE_DATA } from "../../utils/mockTable";
import { GridColDef } from "@mui/x-data-grid";
import { AdminInventoryRow } from "../../types/dataGridTypes";
// import Image from "../../assets/images/Me.png";
import AddEquipmentForm from "./AddEquipmentForm";
// import axios from "axios";


// const res = await axios.get("http://localhost:3307/admin/items");
// const items = res.data;
// console.log(items);

export default function Inventory() {
  const columns: GridColDef<AdminInventoryRow>[] = [
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
      field: "equipmentDetails",
      width: 300,
      headerAlign: "center",
      type: "custom",
      renderHeader: () => (
        <h1 className="font-manrope text-textColor font-bold">{"Equipment"}</h1>
      ),
      renderCell: (params) => (
        <div className="flex flex-row items-center justify-between h-[30px]">
          <div className="flex flex-row justify-start items-center gap-3">
            <img
              // src={Image}
              src={`../../../public/inventoryDefaultImage.jpg`}
              // src={`../../assets/images/items/${params.row.equipmentImage}`}
              alt={params.row.equipmentName}
              className="ml-20 w-[45px] h-[45px] rounded-2xl object-fill border-2 border-Silver-2"
            />
            <span className="text-Silver-1">{params.row.equipmentName}</span>
          </div>
        </div>
      ),
    },
    {
      field: "equipmentQuantity",
      width: 150,
      headerAlign: "center",
      type: "string",
      renderHeader: () => (
        <h1 className="font-manrope text-textColor font-bold">{"Quantity"}</h1>
      ),
      renderCell: (params) => (
        <span className="text-Silver-1">{params.row.equipmentQuantity}</span>
      ),
    },
    {
      field: "equipmentBrand",
      width: 200,
      headerAlign: "center",
      type: "string",
      renderHeader: () => (
        <h1 className="font-manrope text-textColor font-bold">
          {"Manufacturer"}
        </h1>
      ),
      renderCell: (params) => (
        <span className="text-Silver-1">{params.row.equipmentBrand}</span>
      ),
    },
  ];
  return (
    <div className="flex flex-col xl:w-[1600px] items-end">
      <AddEquipmentForm />
      <Table columns={columns} rows={MOCK_TABLE_DATA.adminInventory} />
      {/* <Table columns={columns} rows={items} /> */}
    </div>
  );
}
