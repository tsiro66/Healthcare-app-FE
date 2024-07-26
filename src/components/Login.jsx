import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";

const theme = createTheme();

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

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

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
        localStorage.setItem("token", token); // Store token in localStorage
        onLogin(token);
        navigate("/patient"); // Redirect to Patient component
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
          <form onSubmit={handleLogin}>
            <TextField
              label="Username"
              fullWidth
              size="small"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              variant="outlined" // Ensure the text field uses the outlined variant
              sx={{
                margin: theme.spacing(1, 0),
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "gray", // Change border color of the text field
                  },
                  "&:hover fieldset": {
                    borderColor: "darkgray", // Change border color on hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "black", // Change border color when focused
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "gray", // Default label color
                  "&.Mui-focused": {
                    color: "black", // Label color when focused
                  },
                },
              }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              size="small"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined" // Ensure the text field uses the outlined variant
              sx={{
                margin: theme.spacing(1, 0),
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "gray", // Change border color of the text field
                  },
                  "&:hover fieldset": {
                    borderColor: "darkgray", // Change border color on hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "black", // Change border color when focused
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "gray", // Default label color
                  "&.Mui-focused": {
                    color: "black", // Label color when focused
                  },
                },
              }}
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
