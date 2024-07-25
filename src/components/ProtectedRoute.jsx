import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { checkTokenValidity } from "../utils/auth";
import { CircularProgress, Box } from "@mui/material";

const ProtectedRoute = ({ token, children, setCurrentRoute }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const checkToken = async () => {
      if (!token) {
        setCurrentRoute(location.pathname);
        navigate("/login", { replace: true });
        return;
      }

      try {
        setIsValidating(true);
        const isValid = await checkTokenValidity(token);
        if (isMounted) {
          if (!isValid) {
            localStorage.removeItem("token");
            localStorage.removeItem("currentRoute");
            setCurrentRoute(location.pathname);
            navigate("/login", { replace: true });
          }
          setIsValidating(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error validating token:", error);
          setIsValidating(false);
          // Optionally handle network errors differently
          // e.g., show a network error message instead of redirecting
        }
      }
    };

    checkToken();

    return () => {
      isMounted = false;
    };
  }, [token, location.pathname, navigate, setCurrentRoute]);

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

  return token ? children : null;
};

export default ProtectedRoute;
