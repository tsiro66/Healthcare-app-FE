import { Button, Container, TextField, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
import AuthContext from "./Auth/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

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
    }
  };

  return (
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
            "& .MuiInput-underline:before": { borderBottomColor: "black" },
            "& .MuiInput-underline:hover:before": {
              borderBottomColor: "black",
            },
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
            "& .MuiInput-underline:before": { borderBottomColor: "black" },
            "& .MuiInput-underline:hover:before": {
              borderBottomColor: "black",
            },
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
  );
};

export default Login;
