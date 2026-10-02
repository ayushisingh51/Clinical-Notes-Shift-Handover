import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="logo">
          <div className="logo-icon">✚</div>

          <div>
            <h2>ClinNotes</h2>
            <span>Clinical Care</span>
          </div>
        </div>

        <nav className="navigation">

          <p className="nav-title">MAIN MENU</p>

          <Link to="/" className="nav-item active">
            <span>▦</span>
            Dashboard
          </Link>

          <Link to="/patients" className="nav-item">
            <span>♙</span>
            Patients
          </Link>

          <Link to="/clinical-notes" className="nav-item">
            <span>▤</span>
            Clinical Notes
          </Link>

          <Link to="/shift-handover" className="nav-item">
            <span>⇄</span>
            Shift Handover
          </Link>

            {user?.role === "admin" && (
            <Link to="/user-management" className="nav-item">
              <span>👥</span>
              User Management
            </Link>
            )}

          <p className="nav-title">ACCOUNT</p>

          <Link to="/settings" className="nav-item">
            <span>⚙</span>
            Settings
          </Link>

        </nav>

        <div className="sidebar-bottom">

          <div className="help-box">
            <strong>Need help?</strong>

            <p>
              Contact your administrator
            </p>

            <button>
              Get Support
            </button>
          </div>

        </div>

      </aside>

      {/* Main Content */}
      <main className="main-content">

        {/* Header */}
        <header className="topbar">

          <div>
            <h1>Dashboard</h1>

            <p>
              Clinical overview and shift activity
            </p>
          </div>

          <div className="profile">

            <div className="notification">
              ♢
            </div>

            <div className="avatar">
              {user?.name
                ? user.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()
                : "U"}
            </div>

            <div>
              <strong>
                {user?.name || "User"}
              </strong>

              <span>
                {user?.role
                  ? user.role.charAt(0).toUpperCase() +
                    user.role.slice(1)
                  : "User"}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="logout-button"
            >
              Logout
            </button>

          </div>

        </header>

        {/* Welcome */}
        <section className="welcome">

          <div>
            <h2>
              Good morning 👋
            </h2>

            <p>
              Here's what's happening with your patients today.
            </p>
          </div>

          {user &&
            ["admin", "doctor", "staff"].includes(user.role) && (
              <button
                className="primary-button"
                onClick={() => navigate("/clinical-notes")}
              >
                + New Clinical Note
              </button>
            )}

        </section>

        {/* Statistics */}
        <section className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon blue">
              ♙
            </div>

            <div>
              <span>Total Patients</span>
              <h3>24</h3>
              <small>Active patients</small>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon green">
              ✓
            </div>

            <div>
              <span>Clinical Notes</span>
              <h3>18</h3>
              <small>Updated today</small>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon orange">
              ⇄
            </div>

            <div>
              <span>Shift Handovers</span>
              <h3>5</h3>
              <small>Today's handovers</small>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon purple">
              !
            </div>

            <div>
              <span>Pending Actions</span>
              <h3>7</h3>
              <small>Require attention</small>
            </div>

          </div>

        </section>

        {/* Dashboard Grid */}
        <section className="dashboard-grid">

          {/* Patients */}
          <div className="panel patients-panel">

            <div className="panel-header">

              <div>
                <h2>Recent Patients</h2>

                <p>
                  Recently updated patient records
                </p>
              </div>

              <button className="view-button">
                View All
              </button>

            </div>

            <div className="patient-table">

              <div className="table-header">
                <span>Patient</span>
                <span>Status</span>
                <span>Last Update</span>
              </div>

              <div className="patient-row">

                <div className="patient-info">

                  <div className="patient-avatar">
                    RK
                  </div>

                  <div>
                    <strong>Rahul Kumar</strong>
                    <span>
                      Patient ID: #1024
                    </span>
                  </div>

                </div>

                <span className="status stable">
                  Stable
                </span>

                <span className="update-time">
                  10 min ago
                </span>

              </div>

              <div className="patient-row">

                <div className="patient-info">

                  <div className="patient-avatar">
                    PS
                  </div>

                  <div>
                    <strong>Priya Sharma</strong>
                    <span>
                      Patient ID: #1025
                    </span>
                  </div>

                </div>

                <span className="status attention">
                  Attention
                </span>

                <span className="update-time">
                  25 min ago
                </span>

              </div>

              <div className="patient-row">

                <div className="patient-info">

                  <div className="patient-avatar">
                    AM
                  </div>

                  <div>
                    <strong>Amit Mehta</strong>
                    <span>
                      Patient ID: #1026
                    </span>
                  </div>

                </div>

                <span className="status stable">
                  Stable
                </span>

                <span className="update-time">
                  1 hr ago
                </span>

              </div>

            </div>

          </div>

          {/* Handover */}
          <div className="panel handover-panel">

            <div className="panel-header">

              <div>
                <h2>Shift Handover</h2>

                <p>
                  Current shift information
                </p>
              </div>

            </div>

            <div className="shift-info">

              <div className="shift-icon">
                ⇄
              </div>

              <div>
                <span>Current Shift</span>

                <h3>
                  Morning Shift
                </h3>

                <p>
                  08:00 AM – 04:00 PM
                </p>
              </div>

            </div>

            <div className="handover-status">

              <span className="status-dot"></span>

              <div>
                <strong>
                  Handover in progress
                </strong>

                <p>
                  3 patients require attention
                </p>
              </div>

            </div>

            <button
              className="handover-button"
              onClick={() => navigate("/shift-handover")}
            >
              Open Handover
            </button>

          </div>

        </section>

        {/* Activity */}
        <section className="panel activity-panel">

          <div className="panel-header">

            <div>
              <h2>Recent Activity</h2>

              <p>
                Latest updates from your team
              </p>
            </div>

          </div>

          <div className="activity-list">

            <div className="activity">

              <div className="activity-icon blue">
                N
              </div>

              <div>
                <strong>
                  Clinical note updated
                </strong>

                <p>
                  Dr. Sharma updated Rahul Kumar's clinical note
                </p>
              </div>

              <span>
                10 min ago
              </span>

            </div>

            <div className="activity">

              <div className="activity-icon green">
                ✓
              </div>

              <div>
                <strong>
                  Shift handover completed
                </strong>

                <p>
                  Evening shift handover was completed
                </p>
              </div>

              <span>
                1 hr ago
              </span>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;