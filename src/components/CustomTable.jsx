import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

const CustomTable = ({ rows, columns, onDeleteClick, onEditClick }) => {
  const dataRows = rows.map((row) => ({
    id: row.patientId,
    ...row,
  }));

  const dataColumns = [
    ...columns.map((column) => ({
      field: column.id,
      headerName: column.label,
      width: 200,
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
            onClick={() => onDeleteClick(params.id)}
            color="error"
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const [pageSize, setPageSize] = useState(5);

  return (
    <Paper style={{ height: 400, width: "100%", margin: "auto" }}>
      <DataGrid
        rows={dataRows}
        columns={dataColumns}
        loading={!dataRows.length}
        pagination
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[2, 5, 10]}
        disableSelectionOnClick
      />
    </Paper>
  );
};

export default CustomTable;
