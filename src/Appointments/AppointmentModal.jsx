import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const AppointmentModal = ({
  isOpen,
  closeModal,
  handleAddAppointments,
  handleEditAppointments,
  appointment,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (appointment) {
      reset({
        appointmentId: appointment.appointmentId || "",
        description: appointment.description || "",
        patientId: appointment.patientId || "",
        appointmentDate: appointment.appointmentDate || "",
      });
    } else {
      reset({
        appointmentId: "",
        description: "",
        patientId: "",
        appointmentDate: "",
      });
    }
  }, [appointment, reset]);

  const onSubmit = async (data) => {
    const { patientId, ...newAppointment } = data;
    if (appointment) {
      handleEditAppointments(data);
    } else {
      handleAddAppointments(newAppointment, patientId);
    }
    closeModal();
  };

  return (
    <Modal open={isOpen} onClose={closeModal}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Box>
          <Typography variant="h6">Add Appointment</Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, py: 2 }}
            >
              <TextField
                label="Description"
                {...register("description", {
                  required: "Description is required",
                })}
              />
              {errors.description && (
                <Box sx={{ color: "#f44336" }}>
                  {errors.description.message}
                </Box>
              )}
              <TextField
                label="Patient ID"
                {...register("patientId", {
                  required: "Patient ID is required",
                })}
              />
              {errors.patientId && (
                <Box sx={{ color: "#f44336" }}>{errors.patientId.message}</Box>
              )}
              <TextField
                slotProps={{ inputLabel: { shrink: true } }}
                type="date"
                {...register("appointmentDate", {
                  required: "Appointment Date is required",
                })}
                label="Appointment Date"
              />
              {errors.appointmentDate && (
                <Box sx={{ color: "#f44336" }}>
                  {errors.appointmentDate.message}
                </Box>
              )}
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                Submit
              </Button>
              <Button onClick={closeModal} variant="contained" color="error">
                Close
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Modal>
  );
};

AppointmentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  handleAddAppointments: PropTypes.func.isRequired,
  handleEditAppointments: PropTypes.func.isRequired,
  appointment: PropTypes.object,
};

export default AppointmentModal;
