import {
  Box,
  Checkbox,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PropTypes from "prop-types";
import { useState } from "react";
import PatientModal from "./PatientModal";
import Searchbar from "./Searchbar";
import DeleteConfirmationModal from "../DeleteConfirmationModal";

const PatientTable = ({
  patients,
  handleAddPatients,
  handleDeletePatients,
  handleEditPatients,
}) => {
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  //Open/close modal functions
  const openEditModal = () => {
    const patient = patients.find((p) => p.patientId === selectedPatients[0]);
    setPatientToEdit(patient || null);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setPatientToEdit(null);
    setIsModalOpen(true);
  };

  const openConfirmlModal = () => {
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const closeModal = () => setIsModalOpen(false);

  //Functions for changing checkbox state
  const isAllSelected =
    patients.length > 0 && selectedPatients.length === patients.length;
  const isIndeterminate = selectedPatients.length > 0 && !isAllSelected;

  const handleSelectAllChange = () => {
    if (isIndeterminate || isAllSelected) {
      setSelectedPatients([]);
    } else {
      setSelectedPatients(patients.map((patient) => patient.patientId));
    }
  };

  const handleCheckboxChange = (patientId) => {
    setSelectedPatients((prevSelected) => {
      const isSelected = prevSelected.includes(patientId);
      if (isSelected) {
        return prevSelected.filter((id) => id !== patientId);
      } else {
        return [...prevSelected, patientId];
      }
    });
  };

  //Function to delete checked students
  const onDelete = () => {
    for (const patientId of selectedPatients) {
      handleDeletePatients(patientId);
    }
    setSelectedPatients([]); // remove the indeterminate checkbox
    setIsConfirmModalOpen(false);
  };

  return (
    <TableContainer
      sx={{ maxWidth: "70%", margin: "auto", mt: 5 }}
      component={Paper}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", margin: 3 }}>
        <Typography variant="h2">
          <b>My patients</b>
        </Typography>
        <Searchbar />
      </Box>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              <Checkbox
                checked={isAllSelected}
                indeterminate={isIndeterminate}
                onChange={handleSelectAllChange}
              />
            </TableCell>
            <TableCell>ID</TableCell>
            <TableCell align="right">First Name</TableCell>
            <TableCell align="right">Last Name</TableCell>
            <TableCell align="right">Gender</TableCell>
            <TableCell align="right">Date of Birth</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patients.map((patient) => (
            <TableRow
              key={patient.patientId}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>
                <Checkbox
                  checked={selectedPatients.includes(patient.patientId)}
                  onChange={() => handleCheckboxChange(patient.patientId)}
                />
              </TableCell>
              <TableCell component="th" scope="row">
                {patient.patientId}
              </TableCell>

              <TableCell align="right">{patient.firstName}</TableCell>
              <TableCell align="right">{patient.lastName}</TableCell>
              <TableCell align="right">{patient.gender}</TableCell>
              <TableCell align="right">{patient.dob}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={5}></TableCell>

            <TableCell align="right">
              <IconButton onClick={openAddModal}>
                <AddCircleIcon />
              </IconButton>
              <IconButton
                onClick={openConfirmlModal}
                disabled={selectedPatients.length == 0}
              >
                <DeleteIcon />
              </IconButton>

              <IconButton
                onClick={openEditModal}
                disabled={selectedPatients.length !== 1}
              >
                <EditIcon />
              </IconButton>
            </TableCell>
            <PatientModal
              isOpen={isModalOpen}
              closeModal={closeModal}
              handleAddPatients={handleAddPatients}
              handleEditPatients={handleEditPatients}
              patient={patientToEdit}
            />
            <DeleteConfirmationModal
              isOpen={isConfirmModalOpen}
              closeModal={closeConfirmModal}
              onDelete={onDelete}
            />
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

PatientTable.propTypes = {
  patients: PropTypes.array.isRequired,
  handleAddPatients: PropTypes.func.isRequired,
  handleDeletePatients: PropTypes.func.isRequired,
  handleEditPatients: PropTypes.func.isRequired,
};

export default PatientTable;
