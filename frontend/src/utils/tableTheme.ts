import { createTheme } from "@mui/material/styles";
import type {} from "@mui/x-data-grid/themeAugmentation";

export const theme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#E9EAEC !important",
          },
          "& .MuiDataGrid-filler": {
            backgroundColor: "#E9EAEC !important",
          },
          "& .MuiDataGrid-scrollbarFiller": {
            backgroundColor: "#E9EAEC !important",
          },

          // "& .MuiDataGrid-row": {
          //   height: "60px !important",
          //   minHeight: "60px !important",
          // },
        },
        cell: {
          padding: "10px 10px",
          textAlign: "center",
        },
        columnSeparator: {
          display: "none",
        },
      },
    },
  },
});
