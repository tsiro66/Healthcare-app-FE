import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import PageOne from "./components/PageOne";
import PageTwo from "./components/PageTwo";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/page-one" element={<PageOne />} />
        <Route path="/page-two" element={<PageTwo />} />
      </Routes>
    </Router>
  );
};

export default App;
