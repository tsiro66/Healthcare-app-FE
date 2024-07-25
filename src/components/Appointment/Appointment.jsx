import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Container, Typography } from "@mui/material";
import AppointmentTable from "./AppointmentTable";
import AppointmentButton from "./AppointmentButton";
import ErrorSnackbar from "../ErrorSnackbar";
import FormModal from "../FormModal";
import DeleteConfirmationModal from "../DeleteConfirmationModal";

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
  const [rows, setRows] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastErrorTime, setLastErrorTime] = useState(0);

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
      const response = await axios.get("http://localhost:8080/appointment", {
        headers: {
          Authorization: `Bearer ${token}`,
          withCredentials: true,
        },
      });
      setRows(response.data);
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
    let isMounted = true;
    const fetchDataWrapper = async () => {
      try {
        const data = await fetchData();
        if (isMounted) {
          setRows(data);
        }
      } catch (error) {
        if (isMounted) {
          setErrorWithDebounce("Error fetching data");
        }
      }
    };
    fetchDataWrapper();
    return () => {
      isMounted = false;
    };
  }, [fetchData, setErrorWithDebounce]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingAppointment(null);
  };

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

      const url = `http://localhost:8080/appointment?patientId=${newAppointment.patientId}`;
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
