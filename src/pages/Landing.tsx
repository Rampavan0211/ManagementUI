
import { useNavigate } from "react-router-dom";
import type { LoginUser } from "../types/auth";
import Header from "../components/common/Header";

const Landing = () => {
  const navigate = useNavigate();

  const userString = localStorage.getItem("user");

  const user: LoginUser | null = userString
    ? JSON.parse(userString)
    : null;

  if (!user) {
    return null;
  }

  const role = user.role?.toLowerCase();

  const isSuperAdmin = role === "superadmin";
  const isAdmin = role === "admin";
  const isManager = role === "manager";
  const isEmployee = role === "employee";

  return (
    <div className="app-container">
      <Header user={user} />

      <main className="main-content">

        {/* =================================================
            PAGE HEADER
        ================================================== */}

        <div className="page-header">
          <div>
            <h1>Dashboard</h1>

            <p>
              Welcome to the Organisational Management System.
            </p>
          </div>
        </div>

        <div className="landing-content">

          {/* =================================================
              SUPER ADMIN
          ================================================== */}

          {isSuperAdmin && (
            <div className="landing-card">

              <h2>Organisation Management</h2>

              <p className="card-description">
                Manage organisations and system-level
                settings.
              </p>

              <button
                type="button"
                className="landing-action-btn"
                onClick={() =>
                  navigate("/organisations")
                }
              >
                Manage Organisations
              </button>

            </div>
          )}

          {/* =================================================
              ADMIN
          ================================================== */}

          {isAdmin && (
            <>
              <div className="landing-card">

                <h2>Project Management</h2>

                <p className="card-description">
                  Create projects and assign managers
                  to projects.
                </p>

                <button
                  type="button"
                  className="landing-action-btn"
                  onClick={() =>
                    navigate("/projects")
                  }
                >
                  Manage Projects
                </button>

              </div>

              <div className="landing-card">

                <h2>Employee Management</h2>

                <p className="card-description">
                  Manage employees and organisational
                  roles.
                </p>

                <button
                  type="button"
                  className="landing-action-btn"
                  onClick={() =>
                    navigate("/employees")
                  }
                >
                  Manage Employees
                </button>

              </div>

              <div className="landing-card">

                <h2>Attendance</h2>

                <p className="card-description">
                  View and manage employee attendance
                  and working sessions.
                </p>

                <button
                  type="button"
                  className="landing-action-btn"
                  onClick={() =>
                    navigate("/attendance")
                  }
                >
                  Open Attendance
                </button>

              </div>
            </>
          )}

          {/* =================================================
              MANAGER
          ================================================== */}

          {isManager && (
            <>
              <div className="landing-card">

                <h2>Manager Dashboard</h2>

                <p className="card-description">
                  View your assigned projects and
                  manage employees assigned to them.
                </p>

                <button
                  type="button"
                  className="landing-action-btn"
                  onClick={() =>
                    navigate("/manager-dashboard")
                  }
                >
                  My Projects
                </button>

              </div>

              <div className="landing-card">

                <h2>Attendance</h2>

                <p className="card-description">
                  View your attendance and
                  working sessions.
                </p>

                <button
                  type="button"
                  className="landing-action-btn"
                  onClick={() =>
                    navigate("/attendance")
                  }
                >
                  Open Attendance
                </button>

              </div>
            </>
          )}

          {/* =================================================
              EMPLOYEE
          ================================================== */}

          {isEmployee && (
            <>
              <div className="landing-card">

                <h2>My Dashboard</h2>

                <p className="card-description">
                  View your attendance, leave and
                  working sessions.
                </p>

                <button
                  type="button"
                  className="landing-action-btn"
                  onClick={() =>
                    navigate("/employee-dashboard")
                  }
                >
                  Open Dashboard
                </button>

              </div>

              <div className="landing-card">

                <h2>My Projects</h2>

                <p className="card-description">
                  View projects assigned to you.
                </p>

                <button
                  type="button"
                  className="landing-action-btn"
                  onClick={() =>
                    navigate("/employee-projects")
                  }
                >
                  View My Projects
                </button>

              </div>

              <div className="landing-card">

                <h2>Attendance</h2>

                <p className="card-description">
                  View your attendance and
                  working sessions.
                </p>

                <button
                  type="button"
                  className="landing-action-btn"
                  onClick={() =>
                    navigate("/attendance")
                  }
                >
                  Open Attendance
                </button>

              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
};

export default Landing;

