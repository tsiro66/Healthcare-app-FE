import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

const CustomTable = ({
  rows,
  columns,
  onDeleteClick,
  onEditClick,
  idField,
  tableWidth = "100%",
  columnWidth = 200,
}) => {
  const dataRows = rows.map((row) => ({
    id: row[idField],
    ...row,
  }));

  const dataColumns = [
    ...columns.map((column) => ({
      field: column.id,
      headerName: column.label,
      width: columnWidth,
      headerAlign: "center",
      align: "center",
    })),
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <>
          <IconButton onClick={() => onEditClick(params.row)} size="small">
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => onDeleteClick(params.row[idField])}
            color="error"
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

  return (
    <Paper style={{ height: 400, width: "100%", margin: "auto" }}>
      <DataGrid
        rows={dataRows}
        columns={dataColumns}
        loading={!dataRows.length}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[2, 5, 10]}
        disableSelectionOnClick
      />
    </Paper>
  );
};

export default CustomTable;
