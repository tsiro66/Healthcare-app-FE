import { useContext, useEffect, useState } from "react";
import api from "../api";
import AuthContext from "../Auth/AuthContext";
import PatientTable from "./PatientTable";
import { Snackbar, Alert } from "@mui/material";

const Patients = () => {
  const { token } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPatients, setTotalPatients] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Snackbar functions
  const openSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const closeSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  // CRUD operations
  const handleAddPatients = async (newPatient) => {
    try {
      const res = await api.post("/patient", newPatient, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchPatients(pageNo, pageSize);
      openSnackbar(
        `You successfully added a new patient, ${newPatient.firstName}!`,
        "success"
      );
      return res;
    } catch (error) {
      openSnackbar("Failed to add patient. Please try again.", "error");
      console.error("Failed to add patient", error);
    }
  };

  const handleDeletePatients = async (patientId) => {
    try {
      const res = await api.delete(`/patient/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchPatients(pageNo, pageSize);
      openSnackbar("Patient deleted successfully!", "success");
      return res;
    } catch (error) {
      openSnackbar("Failed to delete patient. Please try again.", "error");
      console.error("Failed to delete patient", error);
    }
  };

  const handleEditPatients = async (patientToEdit) => {
    try {
      const res = await api.put(
        `/patient/${patientToEdit.patientId}`,
        patientToEdit,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchPatients(pageNo, pageSize);
      openSnackbar("Patient updated successfully!", "success");
      return res;
    } catch (error) {
      openSnackbar("Failed to update patient. Please try again.", "error");
      console.error("Failed to edit patient", error);
    }
  };

  const fetchPatients = async (pageNo, pageSize) => {
    try {
      const res = await api.get(
        `/patient?pageNo=${pageNo}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPatients(res.data.content);
      setTotalPatients(res.data.totalElements);
      if (res.data.content.length === 0 && pageNo > 0) {
        setPageNo(pageNo - 1);
      }
    } catch (error) {
      openSnackbar("Failed to fetch patient data. Please try again.", "error");
      console.error("Failed to fetch data", error);
    }
  };

  useEffect(() => {
    fetchPatients(pageNo, pageSize);
  }, [pageNo, pageSize]);

  return (
    <>
      <PatientTable
        patients={patients}
        totalPatients={totalPatients}
        handleAddPatients={handleAddPatients}
        handleDeletePatients={handleDeletePatients}
        handleEditPatients={handleEditPatients}
        pageNo={pageNo}
        pageSize={pageSize}
        setPageNo={setPageNo}
        setPageSize={setPageSize}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={closeSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Patients;
