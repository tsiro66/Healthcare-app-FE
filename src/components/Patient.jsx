import CustomTable from "./Table";
import React from "react";
import Box from "@mui/material/Box";

const Patient = () => {
  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name" },
    { field: "email", headerName: "Email" },
  ];
  const data = {};

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1>Patients</h1>
      <CustomTable columns={columns} data={data} />
    </Box>
  );
};

export default Patient;
