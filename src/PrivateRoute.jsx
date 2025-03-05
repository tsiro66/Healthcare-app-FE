import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "./Auth/AuthContext";
import api from "./api";
import PropTypes from "prop-types";
import { Box, CircularProgress } from "@mui/material";

const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        await api.get("/validate-token", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsValid(true);
      } catch (error) {
        console.error("Token validation failed", error);
        setIsValid(false);
      } finally {
        setLoading(false);
      }
    };
    validateToken();
  }, [token]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: "30%" }}>
        <CircularProgress />
      </Box>
    );

  return isValid ? children : <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
