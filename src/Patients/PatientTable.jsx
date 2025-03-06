import {
  Box,
  Checkbox,
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
  Typography,
  useMediaQuery,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PropTypes from "prop-types";
import { useState } from "react";
import PatientModal from "./PatientModal";
import SearchIcon from "@mui/icons-material/Search";
import { TextField } from "@mui/material";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import { useTheme } from "@emotion/react";

const PatientTable = ({
  patients,
  handleAddPatients,
  handleDeletePatients,
  handleEditPatients,
  pageNo,
  pageSize,
  setPageNo,
  setPageSize,
  totalPatients,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  //Open/close modal functions
  const openEditModal = () => {
    const patient = patients.find((p) => p.patientId === selectedPatients[0]);
    setPatientToEdit(patient || null);
    setIsPatientModalOpen(true);
    setSelectedPatients([]);
  };

  const openAddModal = () => {
    setPatientToEdit(null);
    setIsPatientModalOpen(true);
  };

  const openConfirmlModal = () => {
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const closeModal = () => setIsPatientModalOpen(false);

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
      sx={{ width: isMobile ? "100%" : "70%", margin: "auto", my: 5 }}
      component={Paper}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", margin: 3 }}>
        <Typography variant="h2">
          <b>My patients</b>
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
          {patients
            .filter((patient) => {
              //Searchbar function
              return (
                patient.firstName
                  .toLowerCase()
                  .includes(search.toLowerCase()) ||
                patient.lastName.toLowerCase().includes(search.toLowerCase()) ||
                patient.gender.toLowerCase().includes(search.toLowerCase()) ||
                patient.patientId.toString().includes(search)
              );
            })
            .map((patient) => (
              <TableRow key={patient.patientId}>
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
            <PatientModal
              isOpen={isPatientModalOpen}
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
        <TableFooter>
          <TableRow>
            <TableCell>
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
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              rowsPerPage={pageSize}
              count={totalPatients}
              page={pageNo}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

PatientTable.propTypes = {
  patients: PropTypes.array.isRequired,
  handleAddPatients: PropTypes.func.isRequired,
  handleDeletePatients: PropTypes.func.isRequired,
  handleEditPatients: PropTypes.func.isRequired,
  pageNo: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  setPageNo: PropTypes.func.isRequired,
  setPageSize: PropTypes.func.isRequired,
  totalPatients: PropTypes.number.isRequired,
};

export default PatientTable;
