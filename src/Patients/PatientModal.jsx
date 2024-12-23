import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const PatientModal = ({
  isOpen,
  closeModal,
  handleAddPatients,
  handleEditPatients,
  patient,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (patient) {
      reset({
        firstName: patient.firstName || "",
        lastName: patient.lastName || "",
        gender: patient.gender || "",
        dob: patient.dob || "",
      });
    } else {
      reset({
        firstName: "",
        lastName: "",
        gender: "",
        dob: "",
      });
    }
  }, [patient, reset]);

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (patient) {
      handleEditPatients({ ...patient, ...data });
    } else {
      handleAddPatients(data);
    }
    console.log(data);
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
          <Typography variant="h6" component="h2">
            {patient ? `Edit patient ${patient.firstName}` : "Add a patient"}
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, py: 2 }}
            >
              <TextField
                {...register("firstName", {
                  required: "First name is required",
                  minLength: {
                    value: 2,
                    message: "First name must be more than one character",
                  },
                })}
                type="text"
                placeholder="First Name"
              />
              {errors.firstName && (
                <Box sx={{ color: "#f44336" }}>{errors.firstName.message}</Box>
              )}
              <TextField
                {...register("lastName", {
                  required: "Last name is required",
                  minLength: {
                    value: 2,
                    message: "Last name must be more than one character",
                  },
                })}
                type="text"
                placeholder="Last Name"
              />
              {errors.lastName && (
                <Box sx={{ color: "#f44336" }}>{errors.lastName.message}</Box>
              )}
              <TextField
                {...register("gender")}
                type="text"
                placeholder="Gender"
              />
              <TextField
                {...register("dob", {
                  required: "Date of birth is required",
                })}
                type="date"
                placeholder="Date of Birth"
              />
              {errors.dob && (
                <Box sx={{ color: "#f44336" }}>{errors.dob.message}</Box>
              )}
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Button disabled={isSubmitting} type="submit">
                {isSubmitting
                  ? "Loading..."
                  : patient
                  ? "Edit Patient"
                  : "Add Patient"}
              </Button>
              <Button onClick={closeModal}>Close</Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Modal>
  );
};

PatientModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  handleAddPatients: PropTypes.func.isRequired,
  handleEditPatients: PropTypes.func.isRequired,
  patient: PropTypes.object,
};

export default PatientModal;
