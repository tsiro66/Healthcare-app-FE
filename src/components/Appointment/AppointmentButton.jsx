import React from "react";
import { Box, Button, styled } from "@mui/material";

const CustomButton = styled(Button)(({ theme }) => ({
  variant: "contained",
  backgroundColor: "black",
  color: "white",
  "&:hover": {
    backgroundColor: "black",
  },
}));

const AppointmentButton = ({ onModalOpen }) => {
  return (
    <Box sx={{ m: 3, display: "flex", justifyContent: "space-between" }}>
      <CustomButton onClick={onModalOpen}>Create New Appointment</CustomButton>
    </Box>
  );
};

export default AppointmentButton;
