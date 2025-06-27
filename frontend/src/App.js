import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FundList from "./FundList";
import FundDetail from "./FundDetail";
import './index.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FundList />} />
        <Route path="/fund/:id" element={<FundDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
