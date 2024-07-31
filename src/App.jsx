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
  // State to store the authentication token
  const [token, setToken] = useState(null);
  // State to track whether the token check has been completed
  const [isTokenChecked, setIsTokenChecked] = useState(false);
  // State to handle any errors
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Function to validate the token stored in LocalStorage
    const validateToken = async () => {
      try {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
          // Check if the saved token is still valid
          const isValid = await checkTokenValidity(savedToken);
          if (isValid) {
            setToken(savedToken);
          } else {
            clearLocalStorage();
          }
        }
      } catch (error) {
        console.error("Network error", error);
        setHasError(true);
      } finally {
        // Token check is completed
        setIsTokenChecked(true);
      }
    };
    // Call the validation function when the component mounts
    validateToken();
  }, []);

  // Function to handle user Login
  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  // Function to clear local storage and reset token, also used to logout
  const clearLocalStorage = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentRoute");
    setToken(null);
  };

  // Show loading spinner while token is being checked
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

  // Show error page if there was an error
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
          onLogout={clearLocalStorage}
        />
      </Router>
    </ThemeProvider>
  );
};

export default App;
