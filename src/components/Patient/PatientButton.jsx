import React from "react";
import { Box, Button, styled } from "@mui/material";

const CustomButton = styled(Button)(({ theme }) => ({
  variant: "contained",
  backgroundColor: "black",
  color: "white",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
}));

const PatientButton = ({ onModalOpen }) => {
  return (
    <Box sx={{ m: 3, display: "flex", justifyContent: "space-between" }}>
      <CustomButton onClick={onModalOpen}>Create New Patient</CustomButton>
    </Box>
  );
};

export default PatientButton;
