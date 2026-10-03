import { useEffect, useState } from "react";
import axios from "axios";

import {
  Search,
  Bell,
  ChevronDown,
  Users,
  UserCheck,
  BookOpen,
  UserPlus,
  UserRoundPlus,
  BarChart3,
  Settings,
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import StudentDirectory from "./components/StudentDirectory";
import StudentForm from "./components/StudentForm";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/students";

function App() {
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [topSearch, setTopSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState("dashboard");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const response = await axios.get(API_URL);

      setStudents(response.data);
      setError("");
    } catch (err) {
      console.error(err);

      setError(
        "Unable to connect to backend. Make sure the server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStudentAdded = (student) => {
    setStudents((currentStudents) => [
      ...currentStudents,
      student,
    ]);

    setShowStudentForm(false);
    setCurrentPage("dashboard");
    setError("");
  };

  const handleStudentDeleted = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);

      setStudents((currentStudents) =>
        currentStudents.filter(
          (student) =>
            student._id !== id &&
            student.id !== id &&
            student.studentId !== id
        )
      );
    } catch (err) {
      console.error(err);
      setError("Unable to delete the student.");
    }
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setShowStudentForm(true);
  };

  const handleStudentUpdated = (updatedStudent) => {
    setStudents((currentStudents) =>
      currentStudents.map((student) => {
        const studentId =
          student._id ||
          student.id ||
          student.studentId;

        const updatedId =
          updatedStudent._id ||
          updatedStudent.id ||
          updatedStudent.studentId;

        return studentId === updatedId
          ? updatedStudent
          : student;
      })
    );

    setEditingStudent(null);
    setShowStudentForm(false);
    setError("");
  };

  const handleCloseForm = () => {
    setShowStudentForm(false);
    setEditingStudent(null);
  };

  const handleDashboard = () => {
    setCurrentPage("dashboard");
    window.scrollTo(0, 0);
  };

  const handleStudents = () => {
    setCurrentPage("students");
    window.scrollTo(0, 0);
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setShowStudentForm(true);
  };

  const handleReports = () => {
    setCurrentPage("reports");
    window.scrollTo(0, 0);
  };

  const handleSettings = () => {
    setCurrentPage("settings");
    window.scrollTo(0, 0);
  };

  const totalStudents = students.length;

  const activeStudents = students.length;

  const courseCounts = students.reduce(
    (counts, student) => {
      const course = student.course || "Unknown";

      counts[course] =
        (counts[course] || 0) + 1;

      return counts;
    },
    {}
  );

  const courses =
    Object.keys(courseCounts).length;

  const newThisMonth = students.length;

  const currentDate = new Date();

  const formattedDate =
    currentDate.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const filteredStudents = students.filter(
    (student) => {
      const search =
        topSearch.toLowerCase();

      return (
        (student.name || "")
          .toLowerCase()
          .includes(search) ||

        (student.studentId || "")
          .toLowerCase()
          .includes(search) ||

        (student.id || "")
          .toLowerCase()
          .includes(search) ||

        (student.course || "")
          .toLowerCase()
          .includes(search)
      );
    }
  );

  return (
    <div className="app-shell">

      <Sidebar
        onDashboard={handleDashboard}
        onStudents={handleStudents}
        onAddStudent={handleAddStudent}
        onReports={handleReports}
        onSettings={handleSettings}
      />

      <div className="main-content">

        {/* TOP BAR */}

        <header className="topbar">

          <div className="top-search">

            <Search size={20} />

            <input
              type="text"
              placeholder="Search students by name, ID or course..."
              value={topSearch}
              onChange={(e) =>
                setTopSearch(e.target.value)
              }
            />

            <div className="shortcut">
              <span>Ctrl</span>
              <span>S</span>
            </div>

          </div>

          <div className="topbar-right">

            <button className="notification-btn">
              <Bell size={20} />
              <span className="notification-dot"></span>
            </button>

            <div className="topbar-divider"></div>

            <div className="date-section">
              <strong>{formattedDate}</strong>
              <span>Good morning</span>
            </div>

            <div className="profile-section">
              <div className="profile-avatar">
                S
              </div>

              <ChevronDown size={17} />
            </div>

          </div>

        </header>

        <main className="dashboard-content">

          {/* DASHBOARD */}

          {currentPage === "dashboard" && (
            <>

              <section className="welcome-section">

                <div className="welcome-text">

                  <h1>
                    Welcome back
                    <span className="wave">
                      👋
                    </span>
                  </h1>

                  <p>
                    Here's what's happening with
                    your students today.
                  </p>

                </div>

                <button
                  className="add-student-btn"
                  onClick={handleAddStudent}
                >
                  <UserRoundPlus size={19} />
                  Add Student
                </button>

              </section>

              {error && (
                <div className="app-error">
                  {error}
                </div>
              )}

              <section className="stats-grid">

                <StatCard
                  icon={<Users size={23} />}
                  title="Total Students"
                  value={
                    loading
                      ? "..."
                      : totalStudents
                  }
                  subtitle="↑ Student records"
                  variant="pink"
                />

                <StatCard
                  icon={<UserCheck size={23} />}
                  title="Active Students"
                  value={
                    loading
                      ? "..."
                      : activeStudents
                  }
                  subtitle="↑ Currently enrolled"
                  variant="gold"
                />

                <StatCard
                  icon={<BookOpen size={23} />}
                  title="Courses"
                  value={
                    loading
                      ? "..."
                      : courses
                  }
                  subtitle="Available courses"
                  variant="gold"
                />

                <StatCard
                  icon={<UserPlus size={23} />}
                  title="New This Month"
                  value={
                    loading
                      ? "..."
                      : newThisMonth
                  }
                  subtitle="↑ Recently added"
                  variant="pink"
                />

              </section>

              <div className="student-directory">

                <StudentDirectory
                  students={students}
                  onStudentDeleted={
                    handleStudentDeleted
                  }
                  onEditStudent={
                    handleEditStudent
                  }
                />

              </div>

            </>
          )}

          {/* STUDENTS */}

          {currentPage === "students" && (
            <>

              <section className="welcome-section">

                <div className="welcome-text">

                  <h1>
                    Student Directory
                  </h1>

                  <p>
                    View and manage all registered
                    students.
                  </p>

                </div>

                <button
                  className="add-student-btn"
                  onClick={handleAddStudent}
                >
                  <UserRoundPlus size={19} />
                  Add Student
                </button>

              </section>

              <div className="student-directory">

                <StudentDirectory
                  students={
                    topSearch
                      ? filteredStudents
                      : students
                  }
                  onStudentDeleted={
                    handleStudentDeleted
                  }
                  onEditStudent={
                    handleEditStudent
                  }
                />

              </div>

            </>
          )}

          {/* REPORTS */}

          {currentPage === "reports" && (
            <section className="reports-page">

              <section className="welcome-section">

                <div className="welcome-text">

                  <h1>
                    Reports
                    <BarChart3
                      size={28}
                      className="title-icon"
                    />
                  </h1>

                  <p>
                    Student statistics and course
                    reports.
                  </p>

                </div>

              </section>

              <section className="stats-grid">

                <StatCard
                  icon={<Users size={23} />}
                  title="Total Students"
                  value={totalStudents}
                  subtitle="Registered students"
                  variant="pink"
                />

                <StatCard
                  icon={<UserCheck size={23} />}
                  title="Active Students"
                  value={activeStudents}
                  subtitle="Currently enrolled"
                  variant="gold"
                />

                <StatCard
                  icon={<BookOpen size={23} />}
                  title="Courses"
                  value={courses}
                  subtitle="Different courses"
                  variant="gold"
                />

                <StatCard
                  icon={<UserPlus size={23} />}
                  title="New Students"
                  value={newThisMonth}
                  subtitle="Student records"
                  variant="pink"
                />

              </section>

              <div className="report-card">

                <div className="report-card-header">

                  <h2>
                    Course-wise Student Report
                  </h2>

                  <p>
                    Number of students in each
                    course
                  </p>

                </div>

                <div className="course-report-list">

                  {Object.keys(courseCounts)
                    .length === 0 ? (

                    <p className="no-data">
                      No student data available.
                    </p>

                  ) : (

                    Object.entries(
                      courseCounts
                    ).map(
                      ([course, count]) => (
                        <div
                          className="course-report-row"
                          key={course}
                        >
                          <span>{course}</span>

                          <strong>
                            {count} student
                            {count !== 1
                              ? "s"
                              : ""}
                          </strong>
                        </div>
                      )
                    )
                  )}

                </div>

              </div>

              <div className="report-card">

                <div className="report-card-header">

                  <h2>
                    Student Report
                  </h2>

                  <p>
                    Complete list of registered
                    students
                  </p>

                </div>

                <div className="report-table-container">

                  <table className="report-table">

                    <thead>

                      <tr>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Course</th>
                        <th>Year</th>
                      </tr>

                    </thead>

                    <tbody>

                      {students.length === 0 ? (

                        <tr>
                          <td
                            colSpan="5"
                            className="no-data"
                          >
                            No student records
                            available.
                          </td>
                        </tr>

                      ) : (

                        students.map(
                          (student) => (
                            <tr
                              key={student._id}
                            >
                              <td>
                                {student.studentId ||
                                  student.id ||
                                  "-"}
                              </td>

                              <td>
                                {student.name || "-"}
                              </td>

                              <td>
                                {student.email || "-"}
                              </td>

                              <td>
                                {student.course || "-"}
                              </td>

                              <td>
                                {student.year || "-"}
                              </td>
                            </tr>
                          )
                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            </section>
          )}

          {/* SETTINGS */}

          {currentPage === "settings" && (
            <section className="settings-page">

              <section className="welcome-section">

                <div className="welcome-text">

                  <h1>
                    Settings
                    <Settings
                      size={28}
                      className="title-icon"
                    />
                  </h1>

                  <p>
                    Manage your StudentHub
                    application settings.
                  </p>

                </div>

              </section>

              <div className="settings-card">

                <div className="settings-header">
                  <div className="settings-icon">
                    <Settings size={22} />
                  </div>

                  <div>
                    <h2>General Settings</h2>
                    <p>
                      Basic application information
                    </p>
                  </div>
                </div>

                <div className="settings-row">
                  <span>
                    Application Name
                  </span>

                  <strong>
                    StudentHub
                  </strong>
                </div>

                <div className="settings-row">
                  <span>
                    Database
                  </span>

                  <strong>
                    MongoDB
                  </strong>
                </div>

                <div className="settings-row">
                  <span>
                    Backend
                  </span>

                  <strong className="status">
                    ● Connected
                  </strong>
                </div>

                <div className="settings-row">
                  <span>
                    Total Students
                  </span>

                  <strong>
                    {totalStudents}
                  </strong>
                </div>

              </div>

            </section>
          )}

        </main>

        {/* STUDENT FORM */}

        {showStudentForm && (
          <StudentForm
            onClose={handleCloseForm}
            onStudentAdded={handleStudentAdded}
            editingStudent={editingStudent}
            onStudentUpdated={
              handleStudentUpdated
            }
          />
        )}

      </div>

    </div>
  );
}

export default App;