import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  GlobalStyles,
} from "@mui/material";
import Patients from "./Patients/Patients.jsx";
import Appointments from "./Appointments.jsx";
import NotFoundPage from "./NotFoundPage.jsx";
import "@fontsource/roboto";
import Layout from "./Layout.jsx";
import Login from "./Login.jsx";
import { AuthProvider } from "./Auth/AuthProvider.jsx";
import PrivateRoute from "./PrivateRoute.jsx";

const theme = createTheme({
  palette: {
    background: {
      default: "#FEFEFE",
    },
    text: {
      primary: "#000000",
    },
    primary: {
      main: "#000000",
      secondary: "#FEFEFE",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Arial', sans-serif",
    h1: {
      fontSize: "3rem",
      fontWeight: "600",
    },
    h2: {
      fontSize: "1.75rem",
      fontWeight: "600",
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: "600",
    },
  },
});

const globalStyles = (
  <GlobalStyles
    styles={{
      body: {
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
        minHeight: "100vh",
      },
    }}
  />
);

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "patients",
        element: (
          <PrivateRoute>
            <Patients />
          </PrivateRoute>
        ),
      },
      {
        path: "appointments",
        element: (
          <PrivateRoute>
            <Appointments />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider theme={theme}>
        {globalStyles}
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);
