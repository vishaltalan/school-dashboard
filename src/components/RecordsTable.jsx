import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

const STUDENT_COLUMNS = [
  "Sr. No", "Enrollment No", "Student ID", "Name", "Father Name", "Class", "Section", "Session", "Roll No", "Gender", "Status"
];
const STAFF_COLUMNS = [
  "Sr. No", "Employee ID", "Staff ID", "Name", "Designation", "Department", "Email", "Phone", "Gender", "Status"
];

const mockApi = async (type) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (type === "student") {
        const classList = [
          "Nursery", "LKG", "UKG", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"
        ];
        const sessionYears = [2024, 2025];
        const dummyNames = [
          "Aman Kumar", "Rohit Singh", "Priya Sharma", "Neha Verma", "Vikas Gupta", "Sonia Mehra", "Deepak Kapoor", "Riya Joshi", "Sunil Mehta", "Kiran Kapoor", "Sanjay Singh", "Pankaj Mehra", "Amit Verma", "Meena Kumari", "Anil Kumar", "Ashok Patel", "Ajay Choudhary", "Ravi Sharma", "Vikas Verma", "Manoj Gupta", "Anita Singh", "Sonia Mehra", "Deepak Kapoor", "Priya Joshi", "Sunil Mehta"
        ];
        const dummyFathers = [
          "Rajesh Kumar", "Mahesh Singh", "Suresh Sharma", "Ramesh Verma", "Prakash Gupta", "Vinod Mehra", "Mukesh Kapoor", "Dinesh Joshi", "Harish Mehta", "Kamal Kapoor", "Sanjay Singh", "Pankaj Mehra", "Amit Verma", "Meena Kumari", "Anil Kumar", "Ashok Patel", "Ajay Choudhary", "Ravi Sharma", "Vikas Verma", "Manoj Gupta", "Anita Singh", "Sonia Mehra", "Deepak Kapoor", "Priya Joshi", "Sunil Mehta"
        ];
        resolve(Array.from({ length: 25 }, (_, i) => ({
          srNo: i + 1,
          enrollmentNo: `ENR${1000 + i}`,
          studentId: `SID${2000 + i}`,
          name: dummyNames[i % dummyNames.length],
          fatherName: dummyFathers[i % dummyFathers.length],
          class: classList[i % classList.length],
          section: ["A", "B", "C"][i % 3],
          session: sessionYears[i % sessionYears.length],
          rollNo: 1 + i,
          gender: i % 2 === 0 ? "Male" : "Female",
          status: i % 2 === 0 ? "Active" : "Inactive",
        })));
      } else {
        const staffNames = [
          "Ajay Choudhary", "Ravi Sharma", "Vikas Verma", "Manoj Gupta", "Anita Singh", "Sonia Mehra", "Deepak Kapoor", "Priya Joshi", "Sunil Mehta", "Kiran Kapoor", "Sanjay Singh", "Riya Sharma", "Pankaj Mehra", "Amit Verma", "Neha Kumari", "Anil Kumar", "Meena Kumari", "Ashok Patel"
        ];
        resolve(Array.from({ length: 18 }, (_, i) => ({
          srNo: i + 1,
          employeeId: `EMP${3000 + i}`,
          staffId: `STF${4000 + i}`,
          name: staffNames[i % staffNames.length],
          designation: ["Teacher", "Admin", "Clerk"][i % 3],
          department: ["Science", "Arts", "Sports"][i % 3],
          email: `staff${i + 1}@school.com`,
          phone: `98765${10000 + i}`,
          gender: i % 2 === 0 ? "Male" : "Female",
          status: i % 2 === 0 ? "Active" : "Inactive",
        })));
      }
    }, 900);
  });
};

const ResponsiveTable = ({ type = "student" }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState("");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    enrollmentNo: "",
    studentId: "",
    name: "",
    fatherName: "",
    class: "Nursery",
    section: "A",
    session: 2024,
    rollNo: "",
    gender: "Male",
    status: "Active",
    employeeId: "",
    staffId: "",
    designation: "Teacher",
    department: "Science",
    email: "",
    phone: ""
  });

  useEffect(() => {
    setLoading(true);
    mockApi(type).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [type]);

  const columns = type === "student" ? STUDENT_COLUMNS : STAFF_COLUMNS;

  // Map column names to data keys
  const studentKeyMap = {
    "Sr. No": "srNo",
    "Enrollment No": "enrollmentNo",
    "Student ID": "studentId",
    "Name": "name",
    "Father Name": "fatherName",
    "Class": "class",
    "Section": "section",
    "Session": "session",
    "Roll No": "rollNo",
    "Gender": "gender",
    "Status": "status"
  };
  const staffKeyMap = {
    "Sr. No": "srNo",
    "Employee ID": "employeeId",
    "Staff ID": "staffId",
    "Name": "name",
    "Designation": "designation",
    "Department": "department",
    "Email": "email",
    "Phone": "phone",
    "Gender": "gender",
    "Status": "status"
  };


  const yearOptions = [2024, 2025];
  const statusOptions = ["Active", "Inactive"];
  const classOptions = [
    "Nursery", "LKG", "UKG", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"
  ];
  const sectionOptions = ["A", "B", "C"];
  const designationOptions = ["Teacher", "Admin", "Clerk"];
  const departmentMap = {
    Teacher: ["Science", "Mathematics", "English", "Social Studies", "Hindi", "Computer", "Physical Education"],
    Admin: ["Administration", "Accounts", "HR", "Admissions", "Transport"],
    Clerk: ["Office", "Library", "Store", "Records", "Reception"]
  };
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const filtered = data.filter((row) => {
    let match = true;
    if (type === "staff" && selectedYear) {
      match = match && row.department.includes(selectedYear.toString()); // You may want to change this logic if year is a separate field
    }
    if (selectedStatus) {
      match = match && row.status === selectedStatus;
    }
    match = match && columns.some((col) => {
      const key = type === "student" ? studentKeyMap[col] : staffKeyMap[col];
      return row[key] && row[key].toString().toLowerCase().includes(search.toLowerCase());
    });
    return match;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortCol) return 0;
    const key = type === "student" ? studentKeyMap[sortCol] : staffKeyMap[sortCol];
    if (a[key] < b[key]) return sortDir === "asc" ? -1 : 1;
    if (a[key] > b[key]) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (col) => {
    if (sortCol === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  };


  // Excel download handler
  const handleDownload = () => {
    // Export raw table data for current view
    const keyMap = type === "student" ? studentKeyMap : staffKeyMap;
    const exportData = sorted.map(row => {
      const obj = {};
      columns.forEach(col => {
        obj[col] = row[keyMap[col]];
      });
      return obj;
    });
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${type}_table.xlsx`);
  };

  const handleAddNewClick = () => {
    setShowAddForm(true);
  };

  const handleAddEntry = () => {
    let entry;
    if (type === "student") {
      entry = {
        enrollmentNo: newEntry.enrollmentNo,
        studentId: newEntry.studentId,
        name: newEntry.name,
        fatherName: newEntry.fatherName,
        class: newEntry.class,
        section: newEntry.section,
        session: newEntry.session,
        rollNo: newEntry.rollNo,
        gender: newEntry.gender,
        status: newEntry.status
      };
    } else {
      entry = {
        employeeId: newEntry.employeeId,
        staffId: newEntry.staffId,
        name: newEntry.name,
        designation: newEntry.designation,
        department: newEntry.department,
        email: newEntry.email,
        phone: newEntry.phone,
        gender: newEntry.gender,
        status: newEntry.status
      };
    }
    const updated = [...data, entry];
    // Recalculate srNo for all rows
    const withSrNo = updated.map((row, idx) => ({ ...row, srNo: idx + 1 }));
    setData(withSrNo);
    setShowAddForm(false);
    setNewEntry({
      enrollmentNo: "",
      studentId: "",
      name: "",
      fatherName: "",
      class: "Nursery",
      section: "A",
      session: 2024,
      rollNo: "",
      gender: "Male",
      status: "Active",
      employeeId: "",
      staffId: "",
      designation: "Teacher",
      department: "Science",
      email: "",
      phone: ""
    });
  };

  return (
    <div className="container my-4">
      <div className="card shadow-lg">
        <div className="card-header bg-success text-white">
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <div className="d-flex flex-wrap">
              <div className="d-flex flex-wrap" style={{gap: '8px'}}>
                <select className="form-select form-select-sm w-auto" value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
                  <option value="">Session</option>
                  {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
                {type === "student" && (
                  <>
                    <select className="form-select form-select-sm w-auto">
                      <option>Class</option>
                      {classOptions.map((c) => <option key={c}>{c}</option>)}
                    </select>
                    <select className="form-select form-select-sm w-auto">
                      <option>Section</option>
                      {sectionOptions.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </>
                )}
                <select className="form-select form-select-sm w-auto" value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
                  <option value="">Status</option>
                  {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <input
              className="form-control form-control-sm w-auto"
              style={{ minWidth: 180 }}
              placeholder="Search by name or id"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="d-flex">
              <button
                className="btn"
                style={{ border: '2px solid #198754', background: 'white', color: 'black', fontWeight: '500', letterSpacing: '1px', borderRadius: '6px', padding: '6px 18px', textTransform: 'uppercase', marginRight: '8px', minWidth: '120px' }}
                onClick={handleAddNewClick}
              >
                Add New
              </button>
              <button
                className="btn"
                style={{ border: '2px solid #198754', background: 'white', color: 'black', fontWeight: '500', letterSpacing: '1px', borderRadius: '6px', padding: '6px 18px', textTransform: 'uppercase', marginRight: '8px', minWidth: '120px' }}
              >
                Upload
              </button>
              <button
                className="btn"
                style={{ border: '2px solid #198754', background: 'white', color: 'black', fontWeight: '500', letterSpacing: '1px', borderRadius: '6px', padding: '6px 18px', textTransform: 'uppercase', minWidth: '120px' }}
                onClick={handleDownload}
              >
                Download
              </button>
            </div>
          </div>
        </div>
        {showAddForm && (
          <div className="card-body border-bottom" style={{ background: '#f8f9fa' }}>
            <h5 className="mb-3">Add New Entry</h5>
            <div className="row g-2">
              {type === "student" ? (
                <>
                  <div className="col-md-2">
                    <input className="form-control" placeholder="Enrollment No" value={newEntry.enrollmentNo} onChange={e => setNewEntry({ ...newEntry, enrollmentNo: e.target.value })} />
                  </div>
                  <div className="col-md-2">
                    <input className="form-control" placeholder="Student ID" value={newEntry.studentId} onChange={e => setNewEntry({ ...newEntry, studentId: e.target.value })} />
                  </div>
                  <div className="col-md-2">
                    <input className="form-control" placeholder="Name" value={newEntry.name} onChange={e => setNewEntry({ ...newEntry, name: e.target.value })} />
                  </div>
                  <div className="col-md-2">
                    <input className="form-control" placeholder="Father Name" value={newEntry.fatherName} onChange={e => setNewEntry({ ...newEntry, fatherName: e.target.value })} />
                  </div>
                  <div className="col-md-1">
                    <select className="form-select" value={newEntry.class} onChange={e => setNewEntry({ ...newEntry, class: e.target.value })}>
                      {classOptions.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                    </select>
                  </div>
                  <div className="col-md-1">
                    <select className="form-select" value={newEntry.section} onChange={e => setNewEntry({ ...newEntry, section: e.target.value })}>
                      {sectionOptions.map(sec => <option key={sec} value={sec}>{sec}</option>)}
                    </select>
                  </div>
                  <div className="col-md-1">
                    <select className="form-select" value={newEntry.session} onChange={e => setNewEntry({ ...newEntry, session: Number(e.target.value) })}>
                      {[2024, 2025].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div className="col-md-1">
                    <input className="form-control" placeholder="Roll No" value={newEntry.rollNo} onChange={e => setNewEntry({ ...newEntry, rollNo: e.target.value })} />
                  </div>
                </>
              ) : (
                <>
                  <div className="col-md-2">
                    <input className="form-control" placeholder="Employee ID" value={newEntry.employeeId} onChange={e => setNewEntry({ ...newEntry, employeeId: e.target.value })} />
                  </div>
                  <div className="col-md-2">
                    <input className="form-control" placeholder="Staff ID" value={newEntry.staffId} onChange={e => setNewEntry({ ...newEntry, staffId: e.target.value })} />
                  </div>
                  <div className="col-md-2">
                    <input className="form-control" placeholder="Name" value={newEntry.name} onChange={e => setNewEntry({ ...newEntry, name: e.target.value })} />
                  </div>
                  <div className="col-md-2">
                    <select className="form-select" value={newEntry.designation} onChange={e => {
                      const newDes = e.target.value;
                      setNewEntry({ ...newEntry, designation: newDes, department: departmentMap[newDes][0] });
                    }}>
                      {designationOptions.map(des => <option key={des} value={des}>{des}</option>)}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <select className="form-select" value={newEntry.department} onChange={e => setNewEntry({ ...newEntry, department: e.target.value })}>
                      {departmentMap[newEntry.designation].map(dep => <option key={dep} value={dep}>{dep}</option>)}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <input className="form-control" placeholder="Email" value={newEntry.email} onChange={e => setNewEntry({ ...newEntry, email: e.target.value })} />
                  </div>
                  <div className="col-md-2">
                    <input className="form-control" placeholder="Phone" value={newEntry.phone} onChange={e => setNewEntry({ ...newEntry, phone: e.target.value })} />
                  </div>
                </>
              )}
              <div className="col-md-1">
                <select className="form-select" value={newEntry.gender} onChange={e => setNewEntry({ ...newEntry, gender: e.target.value })}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="col-md-1">
                <select className="form-select" value={newEntry.status} onChange={e => setNewEntry({ ...newEntry, status: e.target.value })}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="mt-3">
              <button className="btn" style={{ border: '2px solid #198754', background: 'white', color: 'black', fontWeight: '500', letterSpacing: '1px', borderRadius: '6px', padding: '6px 18px', textTransform: 'uppercase', minWidth: '120px', marginRight: '8px' }} onClick={handleAddEntry}>Add Entry</button>
              <button className="btn" style={{ border: '2px solid #6c757d', background: 'white', color: '#6c757d', fontWeight: '500', letterSpacing: '1px', borderRadius: '6px', padding: '6px 18px', textTransform: 'uppercase', minWidth: '120px' }} onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </div>
        )}
        <div className="card-body p-2" style={{ background: '#eafbe7' }}>
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-success">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSort(col)}
                    >
                      {col}
                      {sortCol === col && (
                        <span className="ms-1">{sortDir === "asc" ? "▲" : "▼"}</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-5">Loading...</td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-5">No data</td>
                  </tr>
                ) : (
                  paginated.map((row, idx) => (
                    <tr key={idx}>
                      {columns.map((col) => {
                        const key = type === "student" ? studentKeyMap[col] : staffKeyMap[col];
                        return <td key={col}>{row[key]}</td>;
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-2 flex-wrap">
            <div>
              <button
                className="btn"
                style={{ border: '2px solid #198754', background: 'white', color: 'black', fontWeight: '500', letterSpacing: '1px', borderRadius: '6px', padding: '6px 18px', textTransform: 'uppercase', minWidth: '60px', marginRight: '8px' }}
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                &lt;
              </button>
              <span className="fw-bold">Page {page} of {Math.ceil(sorted.length / pageSize)}</span>
              <button
                className="btn"
                style={{ border: '2px solid #198754', background: 'white', color: 'black', fontWeight: '500', letterSpacing: '1px', borderRadius: '6px', padding: '6px 18px', textTransform: 'uppercase', minWidth: '60px', marginLeft: '8px' }}
                disabled={page === Math.ceil(sorted.length / pageSize)}
                onClick={() => setPage((p) => Math.min(Math.ceil(sorted.length / pageSize), p + 1))}
              >
                &gt;
              </button>
            </div>
            <select
              className="form-select form-select-sm w-auto"
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            >
              {[10, 15, 20].map((size) => (
                <option key={size} value={size}>{size} / page</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveTable;
