import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { Container, Typography } from "@mui/material";
import ErrorSnackbar from "../ErrorSnackbar";
import FormModal from "../FormModal";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import PatientTable from "./PatientTable";
import PatientButton from "./PatientButton";

const getValidationRules = (fields) => {
  const rules = {};
  fields.forEach((field) => {
    if (field.required) {
      rules[field.name] = `${field.label} cannot be empty`;
    }
  });
  return rules;
};

const Patient = () => {
  const [rows, setRows] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastErrorTime, setLastErrorTime] = useState(0);
  const isMounted = useRef(true);

  const setErrorWithDebounce = useCallback(
    (message) => {
      const now = Date.now();
      if (now - lastErrorTime > 5000) {
        setSnackbarMessage(message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setLastErrorTime(now);
      }
    },
    [lastErrorTime]
  );

  const handleSuccessMessage = (message) => {
    setSnackbarMessage(message);
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
    setTimeout(() => {
      handleSnackbarClose();
    }, 3000);
  };

  const fetchData = useCallback(async () => {
    if (isLoading) return [];
    setIsLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:8080/patient", {
        headers: {
          Authorization: `Bearer ${token}`,
          withCredentials: true,
        },
      });
      if (isMounted.current) {
        setRows(response.data);
      }
      return response.data;
    } catch (error) {
      if (error.message === "Network Error") {
        setErrorWithDebounce(
          "Network error. Please check your internet connection."
        );
      } else {
        setErrorWithDebounce("Error fetching data");
      }
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, setErrorWithDebounce]);

  useEffect(() => {
    isMounted.current = true;
    fetchData();
    return () => {
      isMounted.current = false;
    };
  }, []); // Empty dependency array

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingPatient(null);
  };

  const handleDeleteClick = (patientId) => {
    setPatientToDelete(patientId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (patientToDelete) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:8080/patient/${patientToDelete}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          },
        });
        await fetchData();
        handleSuccessMessage(
          "Patient and associated appointments deleted successfully"
        );
      } catch (error) {
        console.error("Error deleting patient", error);
        setErrorWithDebounce("Error deleting patient");
      }
    }
    setDeleteModalOpen(false);
    setPatientToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setPatientToDelete(null);
  };

  const handleEditPatient = (patient) => {
    setEditingPatient({ ...patient, originalId: patient.patientId });
    setModalOpen(true);
  };

  const handleUpdatePatient = async (updatedPatient) => {
    try {
      const token = localStorage.getItem("token");
      const originalId = editingPatient.originalId;
      await axios.put(
        `http://localhost:8080/patient/${originalId}`,
        updatedPatient,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          },
        }
      );
      await fetchData();
      setEditingPatient(null);
      handleSuccessMessage("Patient updated successfully");
    } catch (error) {
      console.error("Error updating patient", error);
      setErrorWithDebounce("Error updating patient");
    }
  };

  const handleCreatePatient = async (newPatient) => {
    try {
      const currentPatients = await fetchData();

      if (!Array.isArray(currentPatients)) {
        throw new Error("Invalid data format");
      }

      const patientExists = currentPatients.some(
        (patient) => patient.patientId === newPatient.patientId
      );

      if (patientExists) {
        setErrorWithDebounce(
          "A patient with this ID already exists. Please use a different ID."
        );
        return;
      }

      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8080/patient", newPatient, {
        headers: {
          Authorization: `Bearer ${token}`,
          withCredentials: true,
        },
      });
      await fetchData();
      handleSuccessMessage("Patient created successfully");
    } catch (error) {
      console.error("Error creating patient", error);
      setErrorWithDebounce("Error creating patient");
    }
  };

  const initialFormData = {
    patientId: "",
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
  };

  const fields = [
    { name: "patientId", label: "Patient ID", required: true },
    { name: "firstName", label: "First Name", required: true },
    { name: "lastName", label: "Last Name", required: true },
    { name: "dob", label: "Date of Birth", type: "date", required: true },
    { name: "gender", label: "Gender" },
  ];

  const validationRules = getValidationRules(fields);

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        paddingTop: "40px",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontFamily: "'Poppins', sans-serif",
          marginBottom: "30px",
          fontWeight: "medium",
          "@media (max-width: 600px)": {
            fontSize: "25px",
          },
        }}
      >
        My Patients
      </Typography>
      <PatientTable
        rows={rows}
        onDeleteClick={handleDeleteClick}
        onEditClick={handleEditPatient}
      />
      <PatientButton onModalOpen={handleModalOpen} />

      <ErrorSnackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        severity={snackbarSeverity}
        message={snackbarMessage}
      />
      <FormModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={editingPatient ? handleUpdatePatient : handleCreatePatient}
        title={editingPatient ? "Edit Patient" : "Create New Patient"}
        initialFormData={editingPatient || initialFormData}
        fields={fields}
        disabledFields={editingPatient ? ["patientId"] : []}
        validationRules={validationRules}
      />
      <DeleteConfirmationModal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName="patient"
      />
    </Container>
  );
};

export default Patient;
