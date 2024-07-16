import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Patient from "./components/Patient";
import Appointment from "./components/Appointment";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/patient" element={<Patient />} />
        <Route path="/appointment" element={<Appointment />} />
      </Routes>
    </Router>
  );
};

export default App;
