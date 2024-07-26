import React from "react";
import CustomTable from "../CustomTable";

const PatientTable = ({ rows, onDeleteClick, onEditClick }) => {
  const columns = [
    { id: "patientId", label: "ID" },
    { id: "firstName", label: "First Name" },
    { id: "lastName", label: "Last Name" },
    { id: "dob", label: "Date of Birth", hideOnMobile: true },
    { id: "gender", label: "Gender" },
  ];

  return (
    <CustomTable
      rows={rows}
      columns={columns}
      onDeleteClick={onDeleteClick}
      onEditClick={onEditClick}
      idField="patientId"
    />
  );
};

export default PatientTable;
