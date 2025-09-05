import * as React from "react";
import { DataGrid, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default class OrderTable extends React.Component {
  render = () => {
    const columns = [
      {
        field: "seq",
        headerName: "#",
        flex: 0.1,
        editable: false,
      },
      {
        field: "user",
        headerName: "Name",
        flex: 2,
        editable: false,
      },
      {
        field: "orderDisplay",
        headerName: "Food/Drink",
        flex: 8,
        editable: false,
      },
      {
        field: "remark",
        headerName: "Remark",
        flex: 4,
        width: 400,
        editable: false,
      },
      {
        field: "edit",
        headerName: "",
        flex: 0.5,
        sortable: false,
        align: "right",
        disableClickEventBubbling: true,

        renderCell: (params) => {
          const currentRow = params.row;

          return (
            <IconButton aria-label="edit" size="medium" onClick={(e) => this.props.handleEdit(currentRow)}>
              <EditIcon fontSize="inherit" />
            </IconButton>
          );
        },
      },
      {
        field: "delete",
        headerName: "",
        flex: 0.5,
        sortable: false,
        disableClickEventBubbling: true,
        align: "right",
        renderCell: (params) => {
          const currentRow = params.row;

          return (
            <IconButton aria-label="delete" size="medium" onClick={(e) => this.props.handleDelete(currentRow)}>
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          );
        },
      },
    ];
    const { rows } = this.props;
    rows.forEach((value, i) => {
      value["seq"] = i + 1;
    });
    return (
      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight
        {...rows}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 100,
            },
          },
        }}
        pageSizeOptions={[100]}
        disableRowSelectionOnClick
        slots={{
          toolbar: CustomToolbar,
        }}
      />
    );
  };
}

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
    </GridToolbarContainer>
  );
}
