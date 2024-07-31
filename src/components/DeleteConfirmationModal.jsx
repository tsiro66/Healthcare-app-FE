import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

const DeleteConfirmationModal = ({ open, onClose, onConfirm, itemName }) => {
  // Styles for the dialog actions
  const dialogActionsStyles = {
    display: "flex",
    justifyContent: "center",
    padding: "16px",
  };

  // Styles for the delete button
  const deleteButtonStyles = {
    marginRight: 4,
    "&:hover": {
      backgroundColor: "rgba(255, 55, 55, 1)",
    },
  };

  // Styles for the cancel button
  const cancelButtonStyles = {
    backgroundColor: "black",
    color: "white",
    marginLeft: 4,
    "&:hover": {
      backgroundColor: "rgba(9, 9, 9, 0.8)",
    },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" align="center">
        Confirm Deletion
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" align="center">
          Are you sure you want to delete this {itemName}? This action cannot be
          undone.
          {itemName === "patient" &&
            " All associated appointments will also be deleted."}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={dialogActionsStyles}>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          sx={deleteButtonStyles}
          autoFocus
        >
          Delete
        </Button>
        <Button onClick={onClose} variant="contained" sx={cancelButtonStyles}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
