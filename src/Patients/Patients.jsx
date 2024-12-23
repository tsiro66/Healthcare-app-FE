import { useContext, useEffect, useState } from "react";
import api from "../api";
import AuthContext from "../Auth/AuthContext";
import PatientTable from "./PatientTable";

const Patients = () => {
  const { token } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  // const [search, setSearch] = useState("");

  const handleAddPatients = async (newPatient) => {
    try {
      const res = await api.post("/patient", newPatient, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res);
      fetchPatients();
    } catch (error) {
      console.error("Failed to add patient", error);
    }
  };

  const handleDeletePatients = async (patientId) => {
    try {
      const res = await api.delete(`/patient/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res);
      fetchPatients();
    } catch (error) {
      console.error("Failed to delete patient", error);
    }
  };

  const handleEditPatients = async (patientToEdit) => {
    try {
      console.log(patientToEdit);
      const res = await api.put(
        `/patient/${patientToEdit.patientId}`,
        patientToEdit,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res);
      fetchPatients();
    } catch (error) {
      console.error("Failed to edit patient", error);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await api.get("/patient", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPatients(res.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <>
      <PatientTable
        patients={patients}
        handleAddPatients={handleAddPatients}
        handleDeletePatients={handleDeletePatients}
        handleEditPatients={handleEditPatients}
      />
    </>
  );
};

export default Patients;
