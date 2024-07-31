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

  // Reset form data and errors when initial data changes
  useEffect(() => {
    setFormData(initialFormData);
    setFormErrors({});
  }, [initialFormData]);

  // Fetch patients when patient dropdown is needed
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

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Validate form fields
  const validateForm = () => {
    const errors = {};
    fields.forEach((field) => {
      const value = formData[field.name];

      // Check if form field is empty
      if (validationRules[field.name] && !formData[field.name]) {
        errors[field.name] = validationRules[field.name];
      }

      // Check if the date is from the future
      if (field.name === "dob") {
        const dobDate = new Date(value);
        if (dobDate > new Date()) {
          errors[field.name] = "Date of birth cannot be in the future";
        }
      }
    });

    // Return any errors
    return errors;
  };

  // Handle form submission
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

  // Styles for form fields
  const fieldStyles = {
    "@media (max-width: 600px)": { fontSize: "0.875rem" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "gray" },
      "&:hover fieldset": { borderColor: "darkgray" },
      "&.Mui-focused fieldset": { borderColor: "black" },
    },
    "& .MuiInputLabel-root": {
      color: "gray",
      "&.Mui-focused": { color: "black" },
    },
  };

  // Render form fields
  const renderField = (field) => {
    // If the field name is patientId and showPatientDropdown is true make patient id field a dropdown list of patients
    if (field.name === "patientId" && showPatientDropdown) {
      return (
        <FormControl
          fullWidth
          margin="normal"
          key={field.name}
          sx={fieldStyles}
        >
          <InputLabel id="patient-select-label">{field.label}</InputLabel>
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
              <MenuItem key={patient.patientId} value={patient.patientId}>
                {`${patient.firstName} ${patient.lastName} (${patient.patientId})`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

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
        InputLabelProps={field.type === "date" ? { shrink: true } : {}}
        error={!!formErrors[field.name]}
        helperText={formErrors[field.name]}
        sx={fieldStyles}
      />
    );
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
          "@media (max-width: 600px)": { width: "80%", p: 2 },
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          align="center"
          sx={{ "@media (max-width: 600px)": { fontSize: "1rem" } }}
        >
          {title}
        </Typography>
        <form onSubmit={handleSubmit}>
          {fields.map(renderField)}
          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              type="submit"
              sx={{
                backgroundColor: "black",
                color: "white",
                "&:hover": { backgroundColor: "rgba(9, 9, 9, 0.8)" },
                "@media (max-width: 600px)": { fontSize: "0.75rem" },
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
                "&:hover": { borderColor: "black" },
                "@media (max-width: 600px)": { fontSize: "0.75rem" },
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
