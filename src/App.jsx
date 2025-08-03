import React, { useState } from "react";
import FeesManagement from "./components/FeesManagement";
import ResponsiveTable from "./components/RecordsTable";

const App = () => {
  const [view, setView] = useState("fees");
  const [tableType, setTableType] = useState("student");

  return (
    <div className="bg-light min-vh-100">
      <header style={{ background: '#eafbe7', color: '#198754', padding: '32px 0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <h1 className="text-center h2 fw-bold" style={{ color: '#198754', textTransform: 'uppercase', letterSpacing: '2px' }}>School Management Dashboard</h1>
        <nav className="d-flex justify-content-center gap-3 mt-2">
          <button
            className={`btn ${view === "fees" ? "btn" : "btn-outline-success"}`}
            style={view === "fees" ? { background: 'white', color: '#198754', border: '2px solid #198754', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' } : { fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}
            onClick={() => setView("fees")}
          >Fees Management</button>
          <button
            className={`btn ${view === "table" ? "btn" : "btn-outline-success"}`}
            style={view === "table" ? { background: 'white', color: '#198754', border: '2px solid #198754', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' } : { fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}
            onClick={() => setView("table")}
          >School Records</button>
        </nav>
      </header>
      <main className="container py-4">
        {view === "fees" ? (
          <FeesManagement />
        ) : (
          <div>
            <div className="d-flex gap-3 mb-4 justify-content-center">
              <button
                className={`btn ${tableType === "student" ? "btn-primary text-white" : "btn-outline-secondary"}`}
                onClick={() => setTableType("student")}
              >Students</button>
              <button
                className={`btn ${tableType === "staff" ? "btn-primary text-white" : "btn-outline-secondary"}`}
                onClick={() => setTableType("staff")}
              >Staff</button>
            </div>
            <ResponsiveTable type={tableType} />
          </div>
        )}
      </main>
      <footer className="text-center py-4 text-secondary">
        Showcase Project &copy; 2025
      </footer>
    </div>
  );
};

export default App;
