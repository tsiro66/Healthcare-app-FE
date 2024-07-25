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
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this {itemName}? This action cannot be
          undone.
          {itemName === "patient" &&
            " All associated appointments will also be deleted."}
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "center",
          padding: "16px",
        }}
      >
        <Button
          onClick={onConfirm}
          variant="contained"
          type="submit"
          color="error"
          sx={{
            marginRight: 4,
            "&:hover": {
              backgroundColor: "rgba(255, 55, 55, 1)",
            },
          }}
          autoFocus
        >
          Delete
        </Button>
        <Button
          onClick={onClose}
          variant="contained"
          type="submit"
          sx={{
            backgroundColor: "black",
            color: "white",
            marginLeft: 4,
            "&:hover": {
              backgroundColor: "rgba(9, 9, 9, 0.8)",
            },
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
