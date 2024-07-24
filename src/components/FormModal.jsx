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
}) => {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
          border: "2px solid #000",
          borderRadius: "10px",
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
              value={formData[field.name]}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              disabled={disabledFields.includes(field.name)}
              InputLabelProps={field.type === "date" ? { shrink: true } : {}}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "gray", // Change border color of the text field
                  },
                  "&:hover fieldset": {
                    borderColor: "darkgray", // Change border color on hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "black", // Change border color when focused
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "gray", // Default label color
                  "&.Mui-focused": {
                    color: "black", // Label color when focused
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
