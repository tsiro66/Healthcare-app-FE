import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { Container, Typography } from "@mui/material";
import AppointmentTable from "./AppointmentTable";
import AppointmentButton from "./AppointmentButton";
import ErrorSnackbar from "../ErrorSnackbar";
import FormModal from "../FormModal";
import DeleteConfirmationModal from "../DeleteConfirmationModal";

// Generate form validation rules based on required fields
const getValidationRules = (fields) => {
  const rules = {};
  fields.forEach((field) => {
    if (field.required) {
      rules[field.name] = `${field.label} cannot be empty`;
    }
  });
  return rules;
};

const Appointment = () => {
  const [rows, setRows] = useState([]); // Data rows for the patient table
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar open state
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Snackbar severity (color)
  const [modalOpen, setModalOpen] = useState(false); // Modal open state
  const [editingAppointment, setEditingAppointment] = useState(null); // Appointment being edited
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // Delete confirmation modal state
  const [appointmentToDelete, setAppointmentToDelete] = useState(null); // Id of patient to delete
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [lastErrorTime, setLastErrorTime] = useState(0); // Timestamp of last error
  const isMounted = useRef(true); // Ref to track component mount status

  // Prevent multiple error messages in quick succession
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

  // Display success message and auto-close after 3 seconds
  const handleSuccessMessage = (message) => {
    setSnackbarMessage(message);
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
    setTimeout(() => {
      handleSnackbarClose();
    }, 3000);
  };

  // Fetch appointment data from the server
  const fetchData = useCallback(async () => {
    if (isLoading) return []; // Prevent duplicate requests if already loading
    setIsLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:8080/appointment", {
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

  // Load appointments when component mounts
  useEffect(() => {
    isMounted.current = true;
    fetchData();
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Snackbar close handler
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Modal handlers
  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingAppointment(null);
  };

  // Create Handler
  const handleCreateAppointment = async (newAppointment) => {
    try {
      const currentAppointments = await fetchData();

      if (!Array.isArray(currentAppointments)) {
        throw new Error("Invalid data format");
      }

      const appointmentExists = currentAppointments.some(
        (appointment) =>
          appointment.appointmentId === newAppointment.appointmentId
      );

      if (appointmentExists) {
        setErrorWithDebounce(
          "An appointment with this ID already exists. Please use a different ID."
        );
        return;
      }

      const url = `http://localhost:8080/appointment/${newAppointment.patientId}`;
      const token = localStorage.getItem("token");
      await axios.post(url, newAppointment, {
        headers: {
          Authorization: `Bearer ${token}`,
          withCredentials: true,
        },
      });
      await fetchData();
      handleSuccessMessage("Appointment created successfully");
    } catch (error) {
      console.error("Error creating appointment", error);
      setErrorWithDebounce("Error creating appointment");
    }
  };

  // Update handlers
  const handleEditAppointment = (appointment) => {
    setEditingAppointment({
      ...appointment,
      originalId: appointment.appointmentId,
    });
    setModalOpen(true);
  };

  const handleUpdateAppointment = async (updatedAppointment) => {
    try {
      const token = localStorage.getItem("token");
      const originalId = editingAppointment.originalId;
      await axios.put(
        `http://localhost:8080/appointment/${originalId}`,
        updatedAppointment,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          },
        }
      );
      await fetchData();
      setEditingAppointment(null);
      handleSuccessMessage("Appointment updated successfully");
    } catch (error) {
      console.error("Error updating appointment", error);
      setErrorWithDebounce("Error updating appointment");
    }
  };

  // Delete handlers
  const handleDeleteClick = (appointmentId) => {
    setAppointmentToDelete(appointmentId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (appointmentToDelete) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `http://localhost:8080/appointment/${appointmentToDelete}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              withCredentials: true,
            },
          }
        );
        await fetchData();
        handleSuccessMessage("Appointment deleted successfully");
      } catch (error) {
        console.error("Error deleting appointment", error);
        setErrorWithDebounce("Error deleting appointment");
      }
    }
    setDeleteModalOpen(false);
    setAppointmentToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setAppointmentToDelete(null);
  };

  // Initial form data and fields for form modal
  const initialFormData = {
    appointmentId: "",
    patientId: "",
    appointmentDate: "",
    description: "",
  };

  const fields = [
    { name: "appointmentId", label: "Appointment ID", required: true },
    { name: "patientId", label: "Patient ID", required: true },
    {
      name: "appointmentDate",
      label: "Appointment Date",
      type: "date",
      required: true,
    },
    { name: "description", label: "Description" },
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
        My Appointments
      </Typography>
      <AppointmentTable
        rows={rows}
        onDeleteClick={handleDeleteClick}
        onEditClick={handleEditAppointment}
      />
      <AppointmentButton onModalOpen={handleModalOpen} />
      <ErrorSnackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        severity={snackbarSeverity}
        message={snackbarMessage}
      />
      <FormModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={
          editingAppointment ? handleUpdateAppointment : handleCreateAppointment
        }
        title={
          editingAppointment ? "Edit Appointment" : "Create New Appointment"
        }
        initialFormData={editingAppointment || initialFormData}
        fields={fields}
        disabledFields={editingAppointment ? ["appointmentId"] : []}
        validationRules={validationRules}
        showPatientDropdown={true}
      />
      <DeleteConfirmationModal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName="appointment"
      />
    </Container>
  );
};

export default Appointment;
