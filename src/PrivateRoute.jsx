import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "./Auth/AuthContext";
import api from "./api";
import PropTypes from "prop-types";

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

  // Add a loading spinner
  if (loading) return <div>Loading...</div>;

  return isValid ? children : <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
