import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./Auth";
import Login from "./Login";
import Dashboard from "./Dashboard";
import ResumeUpload from "./ResumeUpload";
import Interview from "./Interview";
import ResultHistory from "./ResultHistory";

function App() {
  return (
    <BrowserRouter>
      <div
        style={{
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          backgroundColor: "#f0f2f5",
          minHeight: "100vh",
          padding: "20px",
        }}
      >
        <header
  style={{
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#333",
  }}
>
  Placement Guide
</header>

        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<ResumeUpload />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/history" element={<ResultHistory />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;