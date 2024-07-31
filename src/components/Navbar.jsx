import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/system";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoMdLogOut } from "react-icons/io";
import { Box } from "@mui/material";

// Custom styled components
const NavbarButton = styled(Button)(({ theme, selected }) => ({
  color: "black",
  textTransform: "none",
  borderRadius: "20px",
  padding: "4px 20px",
  backgroundColor: selected ? "#f0f0f0" : "transparent",
  margin: "0px 4px",
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
  height: "42px",
  padding: "0 4px",
  width: "auto",
});

const CustomToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "center",
  minHeight: "32px",
  padding: 0,
});

const RoundButton = styled(IconButton)({
  color: "black",
  padding: "8px",
  width: "33px",
  height: "33px",
  "&:hover": {
    backgroundColor: "#f0f0f0",
  },
});

const IconButtonGroup = styled(Box)({
  display: "flex",
  alignItems: "center",
  border: "1px solid rgba(0, 0, 0, 0.2)",
  borderRadius: "20px",
  padding: "4px",
  marginLeft: "10px",
});

const NavbarContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  marginTop: "20px",
});

const NavbarContent = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export default function Navbar({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <NavbarContainer>
      <NavbarContent>
        <CustomAppBar position="static">
          <CustomToolbar>
            <NavbarButton
              component={Link}
              to="/patient"
              selected={location.pathname === "/patient"}
            >
              Patients
            </NavbarButton>
            <NavbarButton
              component={Link}
              to="/appointment"
              selected={location.pathname === "/appointment"}
            >
              Appointments
            </NavbarButton>
          </CustomToolbar>
        </CustomAppBar>
        <IconButtonGroup>
          <RoundButton onClick={handleLogout}>
            <IoMdLogOut />
          </RoundButton>
        </IconButtonGroup>
      </NavbarContent>
    </NavbarContainer>
  );
}
