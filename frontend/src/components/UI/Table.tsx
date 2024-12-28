import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../utils/tableTheme";
interface TableProps<T> {
  rows: T[];
  columns: GridColDef[];
}

export default function Table<T>({ rows, columns }: TableProps<T>) {
  return (
    <ThemeProvider theme={theme}>
      <div className="h-[700px] w-[820px] xl:w-[1600px]">
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 15,
                // Add page: 0 to ensure it starts from first page
                page: 0,
              },
            },
          }}
          // Set fixed pageSize
          pageSizeOptions={[15]}
          // Enable pagination
          disableRowSelectionOnClick
          checkboxSelection
          className="border border-gray-200 shadow-sm rounded-lg"
        />
      </div>
    </ThemeProvider>
  );
}
