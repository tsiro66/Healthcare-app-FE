import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import AppContent from "./components/AppContent";
import { theme } from "./theme";
import { checkTokenValidity } from "./utils/auth";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import ErrorPage from "./components/ErrorPage/ErrorPage";

const App = () => {
  const [token, setToken] = useState(null);
  const [isTokenChecked, setIsTokenChecked] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      try {
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
      } catch (error) {
        console.error("Network error", error);
        setHasError(true);
      } finally {
        setIsTokenChecked(true);
      }
    };

    validateToken();
  }, []);

  const handleLogin = (token) => {
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

  if (hasError) {
    return <ErrorPage />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppContent
          token={token}
          setToken={setToken}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
      </Router>
    </ThemeProvider>
  );
};

export default App;
