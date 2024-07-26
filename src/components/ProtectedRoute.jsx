import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { checkTokenValidity } from "../utils/auth";
import { CircularProgress, Box } from "@mui/material";

const ProtectedRoute = ({ token, setToken, children, setCurrentRoute }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        console.log("No token found. Redirecting to login.");
        setCurrentRoute(location.pathname);
        navigate("/login", { replace: true });
        return;
      }

      try {
        const isValid = await checkTokenValidity(token);
        if (!isValid) {
          console.log("Token invalid. Clearing token and redirecting.");
          localStorage.removeItem("token");
          localStorage.removeItem("currentRoute");
          setToken(null); // Clear token in state
          setCurrentRoute(location.pathname);
          navigate("/login", { replace: true });
        } else {
          setIsAuthenticated(true); // Token is valid
        }
      } catch (error) {
        console.error("Error validating token:", error);
        // Handle the error by redirecting to login if necessary
        setToken(null); // Clear token on error
        setCurrentRoute(location.pathname);
        navigate("/login", { replace: true });
      } finally {
        setIsValidating(false); // Always stop validation after check
      }
    };

    validateToken();
  }, [token, location.pathname, navigate, setCurrentRoute, setToken]);

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

  if (!isAuthenticated) {
    return null; // Token is invalid or not authenticated
  }

  return children; // Token is valid, render children
};

export default ProtectedRoute;
