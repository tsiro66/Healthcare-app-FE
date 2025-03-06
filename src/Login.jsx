import {
  Alert,
  Box,
  Button,
  Container,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
import AuthContext from "./Auth/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Snackbar functions
  const openSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const closeSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        "/token",
        {},
        {
          auth: {
            username: username,
            password: password,
          },
        }
      );
      login(response.data);
      setUsername("");
      setPassword("");
      navigate("/patients");
    } catch (error) {
      console.error("Login failed", error);
      openSnackbar("Wrong credentials", "error");
    }
  };

  return (
    <Box>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "400px",
          height: "90vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h1"
          pb={5}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          Login
        </Typography>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <TextField
            sx={{
              pb: 2,

              input: { color: "black" },
              label: { color: "black" },
            }}
            id="username"
            label="Username"
            variant="standard"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            sx={{
              pb: 2,
              input: { color: "black" },
              label: { color: "black" },
            }}
            id="password"
            type="password"
            label="Password"
            variant="standard"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" color="primary" variant="contained">
            Login
          </Button>
        </form>
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={closeSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
