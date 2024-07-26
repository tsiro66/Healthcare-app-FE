import React, { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Login from "./Login";
import Patient from "./Patient/Patient";
import Appointment from "./Appointment/Appointment";
import Navbar from "./Navbar";
import ProtectedRoute from "./ProtectedRoute";
import useCurrentRoute from "./routes/useCurrentRoute";

const AppContent = ({ token, onLogin, onLogout, setToken }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentRoute, setCurrentRoute] = useCurrentRoute(token);

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    } else if (location.pathname === "/login") {
      navigate(currentRoute, { replace: true });
    }
  }, [location.pathname, token, navigate, currentRoute]);

  return (
    <>
      {token && location.pathname !== "/login" && (
        <Navbar onLogout={onLogout} />
      )}
      <Routes>
        <Route
          path="/"
          element={
            token ? (
              <Navigate to={currentRoute} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/login"
          element={
            token ? (
              <Navigate to={currentRoute} replace />
            ) : (
              <Login onLogin={onLogin} />
            )
          }
        />
        <Route
          path="/patient"
          element={
            <ProtectedRoute
              token={token}
              setToken={setToken}
              setCurrentRoute={setCurrentRoute}
            >
              <Patient />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointment"
          element={
            <ProtectedRoute
              token={token}
              setToken={setToken}
              setCurrentRoute={setCurrentRoute}
            >
              <Appointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            token ? (
              <Navigate to={currentRoute} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </>
  );
};

export default AppContent;
