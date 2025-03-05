import { Box, Container, Link, Typography } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useContext } from "react";
import AuthContext from "./Auth/AuthContext";

const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        padding: "10px",
        marginLeft: "35px",
      }}
    >
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          width: "320px",
          border: 2,
          borderRadius: "30px",
          margin: "10px",
        }}
      >
        <Link
          component={RouterLink}
          to="/patients"
          sx={{
            textDecoration: "none",
            padding: "5px 10px",
            transition: "0.3s ease",
            "&:hover": {
              color: "#807f80",
            },
            marginX: 1,
          }}
        >
          <Typography>
            <b>Patients</b>
          </Typography>
        </Link>

        <Link
          component={RouterLink}
          to="/appointments"
          sx={{
            textDecoration: "none",
            padding: "5px 10px",
            transition: "0.3s ease",
            "&:hover": {
              color: "#807f80",
            },
            marginX: 1,
          }}
        >
          <Typography>
            <b>Appointments</b>
          </Typography>
        </Link>
      </Container>

      {/* Logout Icon */}
      <Link
        component="button"
        onClick={() => {
          logout();
          navigate("/login");
        }}
        sx={{
          marginLeft: "10px",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          padding: "5px 10px",
          transition: "0.3s ease",
          "&:hover": {
            color: "#807f80",
          },
        }}
      >
        <LogoutRoundedIcon />
      </Link>
    </Box>
  );
};

export default Navbar;
