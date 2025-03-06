import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Alert, Box, Button, Snackbar } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../Auth/AuthContext";
import api from "../api";
import AppointmentTable from "./AppointmentTable";

const Appointments = () => {
  const { token } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
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
  const handleAddAppointments = async (appointment, patientId) => {
    try {
      const res = await api.post(`/appointment/${patientId}`, appointment, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchAppointments(pageNo, pageSize);
      openSnackbar("Appointment added successfully!", "success");
      console.log(res.data);
    } catch (error) {
      openSnackbar("Failed to add appointment. Please try again.", "error");
      console.error("Failed to add appointment", error);
    }
  };

  const handleDeleteAppointments = async (appointmentId) => {
    try {
      const res = await api.delete(`/appointment/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res);
      fetchAppointments(pageNo, pageSize);
      openSnackbar("Appointment deleted successfully!", "success");
    } catch (error) {
      openSnackbar("Failed to delete appointment. Please try again.", "error");
      console.error("Failed to delete appointment", error);
    }
  };

  const handleEditAppointments = async (appointmentToEdit) => {
    try {
      const res = await api.put(
        `/appointment/${appointmentToEdit.appointmentId}`,
        appointmentToEdit,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(res);
      fetchAppointments(pageNo, pageSize);
      openSnackbar("Appointment updated successfully!", "success");
    } catch (error) {
      openSnackbar("Failed to update appointment. Please try again.", "error");
      console.error("Failed to edit appointment", error);
    }
  };

  const fetchAppointments = async (pageNo, pageSize) => {
    try {
      const res = await api.get(
        `/appointment?pageNo=${pageNo}&pageSize=${pageSize}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(res.data);
      setTotalAppointments(res.data.totalElements || 0);
      setAppointments(res.data.content || []);
      if (res.data.content.length === 0 && pageNo > 0) {
        setPageNo(pageNo - 1);
      }
    } catch (error) {
      openSnackbar("Failed to fetch appointments. Please try again.", "error");
      console.error("Failed to fetch appointments", error);
      setAppointments([]);
    }
  };

  // Fetch on mount and on pageNo and pageSize change
  useEffect(() => {
    fetchAppointments(pageNo, pageSize);
  }, [pageNo, pageSize]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        bgcolor: "background.paper",
        borderRadius: 1,
      }}
      gap={10}
    >
      <Box
        sx={{
          position: "sticky",
          top: "20px",
          height: "fit-content",
          alignSelf: "flex-start",
          "& .MuiDateCalendar-root": {
            width: "400px",
            height: "400px",
            maxHeight: "none",
            "& .MuiPickersCalendarHeader-root": {
              paddingLeft: "32px",
              paddingRight: "32px",
              marginTop: "8px",
            },
            "& .MuiDayCalendar-header, & .MuiDayCalendar-weekContainer": {
              justifyContent: "space-around",
              margin: "8px 0",
            },
            "& .MuiDayCalendar-monthContainer": {
              height: "240px",
            },
            "& .MuiPickersDay-root": {
              width: "40px",
              height: "40px",
              fontSize: "1rem",
            },
          },
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={selectedDate || null}
            onChange={(date) => {
              if (selectedDate && date.isSame(selectedDate)) {
                setSelectedDate(null);
              } else {
                setSelectedDate(date);
              }
            }}
          />
        </LocalizationProvider>
      </Box>
      <Box>
        <AppointmentTable
          appointments={
            selectedDate
              ? appointments.filter((appointment) =>
                  appointment.appointmentDate.startsWith(
                    selectedDate.format("YYYY-MM-DD")
                  )
                )
              : appointments
          }
          totalAppointments={totalAppointments}
          handleAddAppointments={handleAddAppointments}
          handleDeleteAppointments={handleDeleteAppointments}
          handleEditAppointments={handleEditAppointments}
          pageNo={pageNo}
          pageSize={pageSize}
          setPageNo={setPageNo}
          setPageSize={setPageSize}
        />
        <Button />
      </Box>
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
    </Box>
  );
};

export default Appointments;
