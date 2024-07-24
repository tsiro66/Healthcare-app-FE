import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Login from "./components/Login";
import Patient from "./components/Patient";
import Appointment from "./components/Appointment";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "'Poppins', sans-serif",
  },
});

// Custom hook to manage current route
const useCurrentRoute = (token) => {
  const [currentRoute, setCurrentRoute] = useState(() => {
    return (
      localStorage.getItem("currentRoute") || (token ? "/patient" : "/login")
    );
  });

  useEffect(() => {
    localStorage.setItem("currentRoute", currentRoute);
  }, [currentRoute]);

  return [currentRoute, setCurrentRoute];
};

const ProtectedRoute = ({ token, children, setCurrentRoute }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setCurrentRoute(location.pathname);
      navigate("/login", { replace: true });
    }
  }, [token, location.pathname, navigate, setCurrentRoute]);

  return token ? children : null;
};

const AppContent = ({ token, onLogin, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentRoute, setCurrentRoute] = useCurrentRoute(token);

  useEffect(() => {
    console.log("Current location:", location.pathname);
    if (token && location.pathname === "/login") {
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
            <ProtectedRoute token={token} setCurrentRoute={setCurrentRoute}>
              <Patient />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointment"
          element={
            <ProtectedRoute token={token} setCurrentRoute={setCurrentRoute}>
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

const App = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
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
