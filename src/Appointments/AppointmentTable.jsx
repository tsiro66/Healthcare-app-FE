import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PropTypes from "prop-types";
import AppointmentModal from "./AppointmentModal";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

const AppointmentTable = ({
  handleAddAppointments,
  handleEditAppointments,
  handleDeleteAppointments,
  appointments,
  totalAppointments,
  pageNo,
  pageSize,
  setPageNo,
  setPageSize,
}) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmetToDelete] = useState(null);
  const [appointmentToEdit, setAppointmentToEdit] = useState(null);
  const [search, setSearch] = useState("");

  //Open/close modal functions
  const openEditModal = (appointment) => {
    setAppointmentToEdit(appointment);
    setIsAppointmentModalOpen(true);
  };

  const openConfirmModal = (appointment) => {
    setAppointmetToDelete(appointment);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setAppointmetToDelete(null);
    setIsConfirmModalOpen(false);
  };

  const openAddModal = () => {
    setAppointmentToEdit(null);
    setIsAppointmentModalOpen(true);
  };

  const closeModal = () => {
    setIsAppointmentModalOpen(false);
  };

  //Delete appointment function
  const onDelete = (appointment) => {
    handleDeleteAppointments(appointment.appointmentId);
    closeConfirmModal();
    setAppointmetToDelete(null);
  };

  //Pagination functions
  const handleChangePage = (event, newPage) => {
    setPageNo(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    console.log(event.target.value);
    setPageSize(parseInt(event.target.value, 10));
    setPageNo(0);
  };

  return (
    <TableContainer
      sx={{ margin: "auto", width: "1000px", m: 5 }}
      component={Paper}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", margin: 3 }}>
        <Typography variant="h2">
          <b>My appointments</b>
        </Typography>
        {/* Searchbar */}
        <Box>
          <SearchIcon sx={{ m: 1 }} />
          <TextField
            size="small"
            variant="outlined"
            label="Search"
            onChange={(e) => setSearch(e.target.value)}
          ></TextField>
        </Box>
      </Box>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Appointment ID</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Patient ID</TableCell>
            <TableCell>Appointment Date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments
            .filter((appointment) => {
              //Searchbar function
              return (
                (appointment.firstName?.toLowerCase() || "").includes(
                  search.toLowerCase()
                ) ||
                (appointment.description?.toLowerCase() || "").includes(
                  search.toLowerCase()
                ) ||
                (appointment.appointmentId?.toString() || "").includes(search)
                // ||
                // (appointment.appointmentDate?.toLowerCase() || "").includes(
                //   search
                // )
              );
            })
            .map((appointment) => (
              <TableRow key={appointment.appointmentId}>
                <TableCell component="th" scope="row">
                  {appointment.appointmentId}
                </TableCell>
                <TableCell>{appointment.description}</TableCell>
                <TableCell>{appointment.patientId}</TableCell>
                <TableCell>{appointment.appointmentDate}</TableCell>
                <TableCell>
                  <IconButton onClick={() => openEditModal(appointment)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => openConfirmModal(appointment)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          <TableRow>
            <DeleteConfirmationModal
              isOpen={isConfirmModalOpen}
              closeModal={closeConfirmModal}
              onDelete={() => onDelete(appointmentToDelete)}
            />
          </TableRow>
        </TableBody>
        {/* //todo if you delete the last patient and he is the only patient in the page it should go back a page*/}
        <TableFooter>
          <TableRow>
            <TableCell>
              <IconButton onClick={openAddModal}>
                <AddCircleIcon />
              </IconButton>
            </TableCell>
            <TablePagination
              rowsPerPageOptions={[2, 5, 10]}
              rowsPerPage={pageSize}
              count={totalAppointments}
              page={pageNo}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
        <AppointmentModal
          isOpen={isAppointmentModalOpen}
          closeModal={closeModal}
          handleAddAppointments={handleAddAppointments}
          handleEditAppointments={handleEditAppointments}
          appointment={appointmentToEdit}
        />
      </Table>
    </TableContainer>
  );
};

AppointmentTable.propTypes = {
  appointments: PropTypes.array.isRequired,
  handleAddAppointments: PropTypes.func.isRequired,
  handleEditAppointments: PropTypes.func.isRequired,
  handleDeleteAppointments: PropTypes.func.isRequired,
  totalAppointments: PropTypes.number.isRequired,
  pageNo: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  setPageNo: PropTypes.func.isRequired,
  setPageSize: PropTypes.func.isRequired,
};

export default AppointmentTable;
