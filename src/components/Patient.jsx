import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomTable from "./CustomTable";
import { Container, Typography, Button, styled, Box } from "@mui/material";
import ErrorSnackbar from "./ErrorSnackbar";
import FormModal from "./FormModal";

const Patient = () => {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:8080/patient", {
        headers: {
          Authorization: `Bearer ${token}`,
          withCredentials: true,
        },
      });
      setRows(response.data);
      setError("");
    } catch (error) {
      setError("Error fetching data");
      console.error("Error fetching data", error);
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleDeletePatient = async (patientId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/patient/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          withCredentials: true,
        },
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting patient", error);
      setError("Error deleting patient");
      setSnackbarOpen(true);
    }
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
      fetchData();
      setEditingPatient(null);
    } catch (error) {
      console.error("Error updating patient", error);
      setError("Error updating patient");
      setSnackbarOpen(true);
    }
  };

  const handleCreatePatient = async (newPatient) => {
    try {
      console.log(newPatient);
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8080/patient", newPatient, {
        headers: {
          Authorization: `Bearer ${token}`,
          withCredentials: true,
        },
      });
      fetchData();
    } catch (error) {
      console.error("Error creating patient", error);
      setError("Error creating patient");
      setSnackbarOpen(true);
    }
  };

  const columns = [
    { id: "patientId", label: "Patient ID" },
    { id: "firstName", label: "First Name" },
    { id: "lastName", label: "Last Name" },
    { id: "dob", label: "Date of Birth" },
    { id: "gender", label: "Gender" },
  ];

  const initialFormData = {
    patientId: "",
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
  };

  const fields = [
    { name: "patientId", label: "Patient ID" },
    { name: "firstName", label: "First Name" },
    { name: "lastName", label: "Last Name" },
    { name: "dob", label: "Date of Birth", type: "date" },
    { name: "gender", label: "Gender" },
  ];

  const CustomButton = styled(Button)(({ theme }) => ({
    variant: "contained",
    backgroundColor: "black",
    color: "white",
    "&:hover": {
      backgroundColor: "black",
    },
  }));

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
          marginBottom: "10px",
          fontWeight: "medium",
        }}
      >
        Patients
      </Typography>
      <CustomTable
        rows={rows}
        columns={columns}
        onDeleteClick={handleDeletePatient}
        onEditClick={handleEditPatient}
      />
      <Box sx={{ m: 3, display: "flex", justifyContent: "space-between" }}>
        <CustomButton onClick={handleModalOpen}>
          Create New Patient
        </CustomButton>
      </Box>

      <ErrorSnackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        severity="error"
        message={error}
      />
      <FormModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={editingPatient ? handleUpdatePatient : handleCreatePatient}
        title={editingPatient ? "Edit Patient" : "Create New Patient"}
        initialFormData={editingPatient || initialFormData}
        fields={fields}
        disabledFields={editingPatient ? ["patientId"] : []}
      />
    </Container>
  );
};

export default Patient;
