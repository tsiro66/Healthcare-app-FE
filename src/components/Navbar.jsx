import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { styled } from "@mui/system";
import { Link, useLocation } from "react-router-dom";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const NavbarButton = styled(Button)(({ theme, selected }) => ({
  color: "black",
  textTransform: "none",
  borderRadius: "20px",
  padding: "4px 20px",
  backgroundColor: selected ? "#f0f0f0" : "transparent",
  margin: "0 8px",
  "&:hover": {
    backgroundColor: "#f0f0f0",
  },
}));

const CustomAppBar = styled(AppBar)({
  backgroundColor: "white",
  border: "1px solid rgba(0, 0, 0, 0.2)",
  borderRadius: "20px",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "none",
  maxWidth: "fit-content",
  margin: "0 auto",
  height: "40px",
  padding: "8px",
  marginTop: "20px",
});

const Navbar = () => {
  const location = useLocation();

  return (
    <CustomAppBar position="static">
      <Toolbar>
        <NavbarButton
          component={Link}
          to="/patient"
          selected={location.pathname === "/patient"}
        >
          Patient
        </NavbarButton>
        <NavbarButton
          component={Link}
          to="/appointment"
          selected={location.pathname === "/appointment"}
        >
          Appointment
        </NavbarButton>
        {/* <NavbarButton>
          <DarkModeIcon />
        </NavbarButton> */}
      </Toolbar>
    </CustomAppBar>
  );
};

export default Navbar;
