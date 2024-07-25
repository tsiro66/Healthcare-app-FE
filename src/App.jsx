import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import AppContent from "./components/AppContent";
import { theme } from "./theme";
import { checkTokenValidity } from "./utils/auth";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const App = () => {
  const [token, setToken] = useState(null);
  const [isTokenChecked, setIsTokenChecked] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        const isValid = await checkTokenValidity(savedToken);
        if (isValid) {
          setToken(savedToken);
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("currentRoute");
          setToken(null);
        }
      }
      setIsTokenChecked(true);
    };

    validateToken();
  }, []);

  const handleLogin = (token) => {
    console.log("Token received in App:", token);
    localStorage.setItem("token", token);
    setToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentRoute");
    setToken(null);
  };

  if (!isTokenChecked) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppContent
          token={token}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
      </Router>
    </ThemeProvider>
  );
};

export default App;
