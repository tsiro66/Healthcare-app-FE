import React from "react";
import CustomTable from "./Table";
import Box from "@mui/material/Box";

const Appointment = () => {
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
      <h1>Appointments</h1>
      <CustomTable columns={columns} data={data} />
    </Box>
  );
};

export default Appointment;
