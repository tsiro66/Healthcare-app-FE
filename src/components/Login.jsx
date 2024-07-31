import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";

const theme = createTheme();

// Styled components for styling
const FormContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: theme.spacing(1),
}));

const LoginButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: "black",
  color: "white",
  "&:hover": {
    backgroundColor: "rgba(9, 9, 9, 0.8)",
  },
}));

const CenteredContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  minHeight: "80vh",
}));

// Styles for text fields
const textFieldStyles = {
  margin: theme.spacing(1, 0),
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "gray",
    },
    "&:hover fieldset": {
      borderColor: "darkgray",
    },
    "&.Mui-focused fieldset": {
      borderColor: "black",
    },
  },
  "& .MuiInputLabel-root": {
    color: "gray",
    "&.Mui-focused": {
      color: "black",
    },
  },
};

const Login = ({ onLogin }) => {
  // State for usernname and password inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // State for errors
  const [error, setError] = useState("");
  // Hook for navigate
  const navigate = useNavigate();

  // Function to handle login
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Post request to url with credetials typed
    const tokenUrl = "http://localhost:8080/token";
    const credentials = btoa(`${username}:${password}`);

    try {
      const response = await axios.post(
        tokenUrl,
        {},
        {
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        }
      );

      const token = response.data.token;

      if (token) {
        localStorage.setItem("token", token);
        onLogin(token);
        navigate("/patient");
      } else {
        setError("Login failed. No token received.");
      }
    } catch (err) {
      setError("Invalid username or password");
      console.error("Error during login:", err);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CenteredContainer maxWidth="xs">
        <Typography variant="h4" align="center">
          Login
        </Typography>
        <Typography
          variant="body2"
          align="center"
          sx={{ color: "gray", marginTop: theme.spacing(2) }}
        >
          Use your credentials to login.
        </Typography>
        <FormContainer>
          <form onSubmit={handleSubmit}>
            {/* Pass the username and password from the inputs to username and password */}
            <TextField
              label="Username"
              fullWidth
              size="small"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              variant="outlined"
              sx={textFieldStyles}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              size="small"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              sx={textFieldStyles}
            />
            {error && <Typography color="error">{error}</Typography>}
            <LoginButton type="submit" fullWidth variant="contained">
              Login
            </LoginButton>
          </form>
        </FormContainer>
      </CenteredContainer>
    </ThemeProvider>
  );
};

export default Login;
