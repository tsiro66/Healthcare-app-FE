import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";

const FormModal = ({
  open,
  onClose,
  onSubmit,
  title,
  initialFormData,
  fields,
  disabledFields,
  validationRules,
  showPatientDropdown = false,
}) => {
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    setFormData(initialFormData);
    setFormErrors({});
  }, [initialFormData]);

  useEffect(() => {
    if (showPatientDropdown) {
      const fetchPatients = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get("http://localhost:8080/patient", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setPatients(response.data);
        } catch (error) {
          console.error("Error fetching patients", error);
        }
      };

      fetchPatients();
    }
  }, [showPatientDropdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};
    fields.forEach((field) => {
      const value = formData[field.name];

      if (validationRules[field.name] && !formData[field.name]) {
        errors[field.name] = validationRules[field.name];
      }
      if (field.name === "dob") {
        const dobDate = new Date(value);
        if (dobDate > new Date()) {
          errors[field.name] = "Date of birth cannot be in the future";
        }
      }
    });
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: "5px",
          boxShadow: 24,
          p: 4,
          "@media (max-width: 600px)": {
            width: "80%",
            p: 2,
          },
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          align="center"
          sx={{
            "@media (max-width: 600px)": {
              fontSize: "1rem",
            },
          }}
        >
          {title}
        </Typography>
        <form onSubmit={handleSubmit}>
          {fields.map((field) => {
            if (field.name === "patientId" && showPatientDropdown) {
              return (
                <FormControl fullWidth margin="normal" key={field.name}>
                  <InputLabel id="patient-select-label">
                    {field.label}
                  </InputLabel>
                  <Select
                    labelId="patient-select-label"
                    id="patient-select"
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    label={field.label}
                    disabled={disabledFields.includes(field.name)}
                  >
                    {patients.map((patient) => (
                      <MenuItem
                        key={patient.patientId}
                        value={patient.patientId}
                      >
                        {`${patient.firstName} ${patient.lastName} (${patient.patientId})`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              );
            } else {
              return (
                <TextField
                  key={field.name}
                  name={field.name}
                  label={field.label}
                  type={field.type || "text"}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  disabled={disabledFields.includes(field.name)}
                  InputLabelProps={
                    field.type === "date" ? { shrink: true } : {}
                  }
                  error={!!formErrors[field.name]}
                  helperText={formErrors[field.name]}
                  sx={{
                    "@media (max-width: 600px)": {
                      fontSize: "0.875rem",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: formErrors[field.name] ? "red" : "gray",
                      },
                      "&:hover fieldset": {
                        borderColor: formErrors[field.name]
                          ? "darkred"
                          : "darkgray",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: formErrors[field.name]
                          ? "darkred"
                          : "black",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: formErrors[field.name] ? "red" : "gray",
                      "&.Mui-focused": {
                        color: formErrors[field.name] ? "darkred" : "black",
                      },
                    },
                  }}
                />
              );
            }
          })}
          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              type="submit"
              sx={{
                backgroundColor: "black",
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(9, 9, 9, 0.8)",
                },
                "@media (max-width: 600px)": {
                  fontSize: "0.75rem",
                },
              }}
            >
              Submit
            </Button>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                borderColor: "gray",
                backgroundColor: "white",
                color: "black",
                "&:hover": {
                  borderColor: "black",
                },
                "@media (max-width: 600px)": {
                  fontSize: "0.75rem",
                },
              }}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default FormModal;
