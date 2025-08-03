// Auto-fill values for each fees type
const AUTO_FEES = {
  Tuition: 1000,
  Mess: 2000,
  Exam: 500,
  Sports: 1500,
};
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import Dropdown from "./Dropdown";
import Button from "./Button";

// Class, session, fees type, and collection options
const CLASSES = [
  "Nursery", "LKG", "UKG", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"
];
const SESSION_YEARS = [2024, 2025];
const FEES_TYPES = [
  { type: "Tuition", collection: "Monthly" },
  { type: "Mess", collection: "Monthly" },
  { type: "Exam", collection: "Yearly" },
  { type: "Sports", collection: "Quarterly" },
];
const COLLECTION_OPTIONS = ["Monthly", "Yearly", "Quarterly"];
const MONTHS = [
  "April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February", "March"
];
const YEARS = [2024, 2025];

// Helper to generate initial rows based on collection type
function getRows(collectionType) {
  let rows = [];
  if (collectionType === "Monthly") {
    MONTHS.forEach((month, idx) => {
      rows.push({
        srNo: idx + 1,
        month,
        year: idx < 9 ? 2024 : 2025,
        frequency: "Monthly",
        amount: "",
        comment: "",
      });
    });
  } else if (collectionType === "Quarterly") {
    for (let i = 0; i < MONTHS.length; i += 3) {
      rows.push({
        srNo: rows.length + 1,
        month: MONTHS[i],
        year: i < 9 ? 2024 : 2025,
        frequency: "Quarterly",
        amount: "",
        comment: "",
      });
    }
  } else if (collectionType === "Yearly") {
    // For yearly, show only one row for the year
    rows.push({
      srNo: 1,
      month: "-",
      year: YEARS[0],
      frequency: "Yearly",
      amount: "AUTO_YEARLY",
      comment: "",
    });
  }
  return rows;
}

// Simulate API call for loading
const fakeApi = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 800);
  });
};

// Main FeesManagement component
const FeesManagement = () => {
  // Download table as Excel
  const handleDownload = () => {
    // Prepare data for Excel
    const excelData = rows.map(row => ({
      "Sr. No": row.srNo,
      Month: row.month,
      Year: row.year,
      "Fees Type": feesType,
      Frequency: row.frequency,
      Amount: row.amount,
      Comment: row.comment
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Fees");
    XLSX.writeFile(workbook, "fees-table.xlsx");
  };

  // State for dropdowns, table rows, and loading
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedClass, setSelectedClass] = useState("");
  const [feesType, setFeesType] = useState("");
  const [collectionType, setCollectionType] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add new custom row logic
  const handleAddNew = () => {
    let newRow;
    if (collectionType === "Monthly") {
      // Find next month and year in sequence
      let lastRow = rows[rows.length - 1];
      let nextMonthIdx = 0;
      let nextYear = 2024;
      if (lastRow) {
        let lastMonthIdx = MONTHS.indexOf(lastRow.month);
        nextMonthIdx = lastMonthIdx + 1;
        nextYear = lastRow.year;
        if (nextMonthIdx >= MONTHS.length) {
          nextMonthIdx = 0;
          nextYear = lastRow.year;
        }
        // If last month is March 2025, next should be April 2025 (not 2026)
        if (lastRow.month === 'March' && lastRow.year === 2025) {
          nextMonthIdx = 0;
          nextYear = 2025;
        }
      }
      let nextMonth = MONTHS[nextMonthIdx];
      newRow = {
        srNo: rows.length + 1,
        month: nextMonth,
        year: nextYear,
        frequency: collectionType,
        amount: AUTO_FEES[feesType] || "",
        comment: "",
      };
    } else if (collectionType === "Quarterly") {
      // Find next quarter month
      const usedMonths = rows.map(r => r.month);
      const quarterMonths = MONTHS.filter((_, i) => i % 3 === 0);
      const nextMonth = quarterMonths.find(m => !usedMonths.includes(m)) || quarterMonths[rows.length % quarterMonths.length];
      const nextYear = MONTHS.indexOf(nextMonth) < 9 ? 2024 : 2025;
      newRow = {
        srNo: rows.length + 1,
        month: nextMonth,
        year: nextYear,
        frequency: collectionType,
        amount: AUTO_FEES[feesType] || "",
        comment: "",
      };
    } else if (collectionType === "Yearly") {
      newRow = {
        srNo: rows.length + 1,
        month: "-",
        year: selectedYear,
        frequency: collectionType,
        amount: (AUTO_FEES[feesType] || 0) * 12,
        comment: "",
      };
    } else {
      newRow = {
        srNo: rows.length + 1,
        month: "",
        year: selectedYear,
        frequency: collectionType,
        amount: "",
        comment: "",
      };
    }
    setRows(prev => [...prev, newRow]);
  };

  // Set collection type based on fees type
  useEffect(() => {
    if (feesType) {
      const found = FEES_TYPES.find((f) => f.type === feesType);
      setCollectionType(prev => prev || (found ? found.collection : ""));
    }
  }, [feesType]);

  // Auto-fill amount when feesType or collectionType changes
  useEffect(() => {
    if (feesType && collectionType) {
      setRows(prevRows => {
        // Only auto-fill if amount is empty
        return prevRows.map(row => ({
          ...row,
          amount: row.amount === "" ? AUTO_FEES[feesType] || "" : row.amount
        }));
      });
    }
  }, [feesType, collectionType]);

  // Load initial rows when collectionType or feesType changes
  useEffect(() => {
    if (collectionType) {
      setLoading(true);
      fakeApi().then(() => {
        let initialRows = getRows(collectionType);
        let filledRows;
        if (collectionType === "Yearly") {
          // Only one row for yearly, show total yearly amount
          let yearlyAmount = (AUTO_FEES[feesType] || 0) * 12;
          filledRows = initialRows.map(row => ({
            ...row,
            amount: yearlyAmount
          }));
        } else if (collectionType === "Quarterly") {
          filledRows = initialRows.map(row => ({
            ...row,
            amount: AUTO_FEES[feesType] || ""
          }));
        } else {
          filledRows = initialRows.map(row => ({
            ...row,
            amount: AUTO_FEES[feesType] || ""
          }));
        }
        setRows(filledRows);
        setLoading(false);
      });
    } else {
      setRows([]);
    }
  }, [collectionType, feesType]);

  // Handle row value change
  const handleRowChange = (idx, field, value) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i === idx ? { ...row, [field]: value } : row
      )
    );
  };

  // Delete row logic
  const handleDelete = (idx) => {
    setRows((prev) => prev.filter((_, i) => i !== idx));
  };

  // Calculate total amount for table footer
  const totalAmount = rows.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);

  // Render UI
  return (
    <div className="container my-5">
      <div className="card shadow-lg">
        {/* Card header: heading, dropdowns, and Add New button */}
        <div className="card-header" style={{ background: '#198754', color: 'white', textAlign: 'center' }}>
          <div className="w-100 d-flex align-items-center">
            {/* Dropdowns left */}
            <div className="d-flex align-items-center" style={{gap: '12px', flex: '1 1 0%'}}>
              <Dropdown
                options={SESSION_YEARS}
                value={selectedYear}
                onChange={e => setSelectedYear(Number(e.target.value))}
                placeholder={null}
                style={{ width: '160px' }}
                className="form-select d-inline-block me-2"
              />
              <Dropdown
                options={CLASSES}
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                placeholder="Select Class"
                style={{ width: '180px' }}
                className="form-select d-inline-block"
              />
            </div>
            {/* Heading center */}
            <div className="flex-grow-1 d-flex justify-content-center">
              <h4 style={{ textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '2px', margin: 0, whiteSpace: 'nowrap', textAlign: 'center' }}>Fees Management</h4>
            </div>
            {/* Add New button right */}
            <div className="d-flex align-items-center" style={{gap: '12px'}}>
              {collectionType === "Monthly" && (
                <Button
                  style={{ border: '2px solid #198754', background: 'white', color: 'black', fontWeight: '500', letterSpacing: '1px', borderRadius: '6px', padding: '6px 18px', textTransform: 'uppercase' }}
                  onClick={handleAddNew}
                >
                  Add New
                </Button>
              )}
            </div>
          </div>
        </div>
        {/* Card body: fees type and collection type dropdowns, table */}
        <div className="card-body">
          <div className="row g-3 mb-4">
            <div className="col-md-4 d-flex align-items-center" style={{gap: '8px'}}>
              {/* Fees type dropdown */}
              <Dropdown
                options={FEES_TYPES.map(f => f.type)}
                value={feesType}
                onChange={e => { setFeesType(e.target.value); setCollectionType(""); }}
                placeholder="Fees Type"
                style={{ width: '180px', background: '#eafbe7', borderColor: '#198754', color: '#198754', fontWeight: 'bold', textTransform: 'uppercase' }}
              />
              {/* Collection type dropdown */}
              <Dropdown
                options={COLLECTION_OPTIONS}
                value={collectionType}
                onChange={e => setCollectionType(e.target.value)}
                placeholder="Collection Type"
                style={{ width: '200px', background: '#eafbe7', borderColor: '#198754', color: '#198754', fontWeight: 'bold', textTransform: 'uppercase' }}
              />
            </div>
          </div>
          {/* Fees table */}
          <div className="table-responsive">
            <table className="table table-bordered align-middle" style={{ background: '#eafbe7' }}>
              <thead className="table-success">
                <tr>
                  <th>Sr. No</th>
                  <th>Month</th>
                  <th>Year</th>
                  <th>Fees Type</th>
                  <th>Frequency</th>
                  <th>Amount</th>
                  <th>Comment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-5">Loading...</td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-5">No data</td>
                  </tr>
                ) : (
                  // Render table rows for yearly or other collection types
                  collectionType === "Yearly" ? (
                    rows.map((row, idx) => (
                      <tr key={idx}>
                        <td className="text-center">{row.srNo}</td>
                        <td>{row.month}</td>
                        <td>{row.year}</td>
                        <td>{feesType}</td>
                        <td>{row.frequency}</td>
                        <td>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={row.amount}
                            onChange={e => handleRowChange(idx, "amount", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={row.comment}
                            onChange={e => handleRowChange(idx, "comment", e.target.value)}
                          />
                        </td>
                        <td className="text-center">
                        <button className="btn btn-sm btn-light" onClick={() => handleDelete(idx)} title="Delete">
                          <i className="bi bi-trash" style={{color: 'black'}}></i>
                        </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    rows.map((row, idx) => (
                      <tr key={idx}>
                        <td className="text-center">{row.srNo}</td>
                        <td>{row.month}</td>
                        <td>{row.year}</td>
                        <td>{feesType}</td>
                        <td>{row.frequency}</td>
                        <td>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={row.amount}
                            onChange={e => handleRowChange(idx, "amount", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={row.comment}
                            onChange={e => handleRowChange(idx, "comment", e.target.value)}
                          />
                        </td>
                        <td className="text-center">
                        <button className="btn btn-sm btn-light" onClick={() => handleDelete(idx)} title="Delete">
                          <i className="bi bi-trash" style={{color: 'black'}}></i>
                        </button>
                        </td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
              <tfoot>
                <tr className="fw-bold">
                  <td colSpan={1} className="text-start">Total Amount</td>
                  <td colSpan={3}></td>
                  <td>{totalAmount}</td>
                  <td colSpan={2}></td>
                  <td className="text-end">
                    <Button className="btn btn-primary" onClick={handleDownload}>Download</Button>
                  </td>
                </tr>
                {/* Show monthly fees for yearly collection type */}
                {collectionType === "Yearly" && (
                  <tr>
                    <td colSpan={8} className="text-end text-secondary">
                      Monthly Fees: <span style={{fontWeight:'bold'}}>{AUTO_FEES[feesType] || 0}</span>
                    </td>
                  </tr>
                )}
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeesManagement;
