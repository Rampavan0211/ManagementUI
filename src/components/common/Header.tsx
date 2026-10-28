
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  clockIn,
  clockOut,
  getTodayAttendance
} from "../../services/AttendanceService";

import type { Attendance } from "../../services/AttendanceService";

interface HeaderProps {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  } | null;
}

const Header = ({ user }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [profileOpen, setProfileOpen] = useState(false);

  const [attendance, setAttendance] =
    useState<Attendance | null>(null);

  const [attendanceLoading, setAttendanceLoading] =
    useState(false);

  const [attendanceError, setAttendanceError] =
    useState("");

  const role = user?.role?.toLowerCase();

  const attendanceRoles = [
    "employee",
    "manager",
    "admin"
  ];

  const canManageAttendance =
    user !== null &&
    attendanceRoles.includes(role || "");

  useEffect(() => {
    if (!canManageAttendance) {
      setAttendance(null);
      setAttendanceError("");
      return;
    }

    loadAttendance();
  }, [user]);

  const loadAttendance = async () => {
    try {
      setAttendanceError("");

      const data = await getTodayAttendance();

      setAttendance(data);
    } catch (error: any) {
      console.error(
        "Failed to load attendance:",
        error
      );

      setAttendanceError(
        error?.response?.data?.message ||
        "Unable to load attendance."
      );
    }
  };

  const handleAttendance = async () => {
    try {
      setAttendanceLoading(true);
      setAttendanceError("");

      let data: Attendance;

      if (attendance?.isClockedIn) {
        data = await clockOut();
      } else {
        data = await clockIn();
      }

      setAttendance(data);
    } catch (error: any) {
      console.error(
        "Attendance action failed:",
        error
      );

      setAttendanceError(
        error?.response?.data?.message ||
        "Attendance action failed."
      );
    } finally {
      setAttendanceLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const getInitials = (name: string) => {
    if (!name) {
      return "U";
    }

    const parts = name.trim().split(" ");

    if (parts.length === 1) {
      return parts[0]
        .charAt(0)
        .toUpperCase();
    }

    return (
      parts[0].charAt(0) +
      parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  /*
   * =====================================================
   * ROLE BASED NAVIGATION
   *
   * Super Admin
   * Home -> Organisations
   *
   * Admin
   * Home -> Employee Dashboard
   * Projects -> Projects
   * Employees -> Employees
   *
   * Manager
   * Home -> Employee Dashboard
   * Projects -> Manager Projects
   *
   * Employee
   * Home -> Employee Dashboard
   * Projects -> Employee Projects
   * =====================================================
   */

  const getNavigationItems = () => {
    if (!user) {
      return [];
    }

    switch (role) {

      case "superadmin":
        return [
          {
            label: "Home",
            path: "/organisations"
          }
        ];

      case "admin":
        return [
          {
            label: "Home",
            path: "/employee-dashboard"
          },
          {
            label: "Projects",
            path: "/projects"
          },
          {
            label: "Employees",
            path: "/employees"
          }
        ];

      case "manager":
        return [
          {
            label: "Home",
            path: "/employee-dashboard"
          },
          {
            label: "Projects",
            path: "/manager-dashboard"
          }
        ];

      case "employee":
        return [
          {
            label: "Home",
            path: "/employee-dashboard"
          },
          {
            label: "Projects",
            path: "/employee-projects"
          }
        ];

      default:
        return [];
    }
  };

  const navigationItems =
    getNavigationItems();

  const handleNavigation = (path: string) => {
    setProfileOpen(false);
    navigate(path);
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="top-header">

      {/* =================================================
          LOGO
      ================================================== */}

      <div className="logo">
        Organisational Management System
      </div>


      {/* =================================================
          NAVIGATION
      ================================================== */}

      {user && navigationItems.length > 0 && (
        <nav className="header-nav">

          {navigationItems.map((item) => (
            <button
              key={item.path}
              type="button"
              className={`header-nav-link ${
                isActiveRoute(item.path)
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleNavigation(item.path)
              }
            >
              {item.label}
            </button>
          ))}

        </nav>
      )}


      {/* =================================================
          RIGHT SECTION
      ================================================== */}

      {user && (
        <div className="header-right">

          {/* =================================================
              WELCOME MESSAGE
          ================================================== */}

          <div className="header-welcome">
            Welcome, {user.name || "User"}.
          </div>


          {/* =================================================
              CLOCK IN / CLOCK OUT
          ================================================== */}

          {canManageAttendance && (
            <div className="header-attendance">

              <button
                type="button"
                className="header-attendance-button"
                onClick={handleAttendance}
                disabled={attendanceLoading}
              >
                {attendanceLoading
                  ? "Processing..."
                  : attendance?.isClockedIn
                  ? "Clock Out"
                  : "Clock In"}
              </button>

              {attendanceError && (
                <span className="header-attendance-error">
                  {attendanceError}
                </span>
              )}

            </div>
          )}


          {/* =================================================
              USER MENU
          ================================================== */}

          <div className="user-menu">

            <button
              type="button"
              className="profile-trigger"
              onClick={() =>
                setProfileOpen(!profileOpen)
              }
              aria-label="Open profile menu"
            >

              {/* Only round profile icon */}
              <span className="profile-avatar">
                {getInitials(user.name)}
              </span>

              <span className="profile-arrow">
                {profileOpen
                  ? "▲"
                  : "▼"}
              </span>

            </button>


            {/* =================================================
                PROFILE DROPDOWN
            ================================================== */}

            {profileOpen && (
              <div className="profile-dropdown">

                <div className="profile-dropdown-header">

                  <span className="profile-avatar profile-avatar-large">
                    {getInitials(user.name)}
                  </span>

                  <div>

                    <strong>
                      {user.name}
                    </strong>

                    <span>
                      {user.role}
                    </span>

                  </div>

                </div>


                <div className="profile-details">

                  <div className="profile-detail">

                    <span className="profile-label">
                      Email
                    </span>

                    <span className="profile-value">
                      {user.email}
                    </span>

                  </div>


                  <div className="profile-detail">

                    <span className="profile-label">
                      User ID
                    </span>

                    <span className="profile-value">
                      {user.id}
                    </span>

                  </div>


                  {/* <div className="profile-detail">

                    <span className="profile-label">
                      Role
                    </span>

                    <span className="profile-value">
                      {user.role}
                    </span>

                  </div> */}

                </div>


                <div className="profile-dropdown-footer">

                  <button
                    type="button"
                    className="logout-button"
                    onClick={logout}
                  >
                    Logout
                  </button>

                </div>

              </div>
            )}

          </div>

        </div>
      )}

    </header>
  );
};

export default Header;
