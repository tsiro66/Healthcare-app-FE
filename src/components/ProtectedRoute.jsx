import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { checkTokenValidity } from "../utils/auth";
import { CircularProgress, Box } from "@mui/material";

// ProtectedRoute component to handle authentication and route protection
const ProtectedRoute = ({ token, setToken, children, setCurrentRoute }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Function to handle unauthenticated state
    const handleUnauthenticated = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("currentRoute");
      setToken(null);
      setCurrentRoute(location.pathname);
      navigate("/login", { replace: true });
    };

    const validateToken = async () => {
      if (!token) {
        console.log("No token found. Redirecting to login.");
        handleUnauthenticated();
        return;
      }

      try {
        const isValid = await checkTokenValidity(token);
        if (!isValid) {
          console.log("Token invalid. Clearing token and redirecting.");
          handleUnauthenticated();
        } else {
          // Token is valid
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error validating token:", error);
        handleUnauthenticated();
      } finally {
        // Stop validation after check
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token, location.pathname, navigate, setCurrentRoute, setToken]);

  // Show loading spinner while validating
  if (isValidating) {
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

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Token is valid, render children
  return children;
};

export default ProtectedRoute;
