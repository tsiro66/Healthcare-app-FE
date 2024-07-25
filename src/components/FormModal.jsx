import React, { useEffect, useState } from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";

const FormModal = ({
  open,
  onClose,
  onSubmit,
  title,
  initialFormData,
  fields,
  disabledFields,
  validationRules,
}) => {
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    setFormData(initialFormData);
    setFormErrors({});
  }, [initialFormData]);

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
        }}
      >
        <Typography variant="h6" component="h2" align="center">
          {title}
        </Typography>
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
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
              error={!!formErrors[field.name]} // Show error state
              helperText={formErrors[field.name]} // Display error message
              sx={{
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
                    borderColor: formErrors[field.name] ? "darkred" : "black",
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
          ))}
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
