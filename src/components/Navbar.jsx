import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { styled } from "@mui/system";
import { Link } from "react-router-dom";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const NavbarButton = styled(Button)({
  color: "black",
  textTransform: "none",
  borderRadius: "20px",
  padding: "2px 8px",
  "&:hover": {
    backgroundColor: "#f0f0f0",
  },
});

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
  return (
    <CustomAppBar position="static">
      <Toolbar>
        <NavbarButton component={Link} to="/page-one">
          Page One
        </NavbarButton>
        <NavbarButton component={Link} to="/page-two">
          Page Two
        </NavbarButton>
        <NavbarButton>
          <DarkModeIcon />
        </NavbarButton>
      </Toolbar>
    </CustomAppBar>
  );
};

export default Navbar;
