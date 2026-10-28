
import { useEffect, useState } from "react";

import { getTodayAttendance } from "../../services/AttendanceService";

import Header from "../../components/common/Header";
import type { LoginUser } from "../../types/auth";

import type {
  Attendance,
  AttendanceSession,
} from "../../services/AttendanceService";

export default function EmployeeDashboard() {
  const [attendance, setAttendance] =
    useState<Attendance | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==============================
  // GET LOGGED-IN USER
  // ==============================

  const userString =
    localStorage.getItem("user");

  let user: LoginUser | null = null;

  try {
    user = userString
      ? JSON.parse(userString)
      : null;
  } catch {
    user = null;
  }

  // ==============================
  // LOAD TODAY'S ATTENDANCE
  // ==============================

  const loadTodayAttendance = async () => {
    try {
      setError("");

      const data =
        await getTodayAttendance();

      setAttendance(data);
    } catch (err: any) {
      console.error(
        "Failed to load attendance:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load today's attendance."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // INITIAL LOAD
  // ==============================

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    loadTodayAttendance();

    /*
     * Refresh attendance every 30 seconds.
     * This keeps the dashboard updated when
     * Clock In / Clock Out is performed from Header.
     */
    const interval = setInterval(() => {
      loadTodayAttendance();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // ==============================
  // FORMAT TIME
  // ==============================

  const formatTime = (
    dateString: string | null
  ) => {
    if (!dateString) {
      return "-";
    }

    return new Date(
      dateString
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==============================
  // FORMAT DURATION
  // ==============================

  const formatDuration = (
    hours: number
  ) => {
    if (!hours || hours <= 0) {
      return "0h 0m";
    }

    const totalMinutes =
      Math.floor(hours * 60);

    const h =
      Math.floor(totalMinutes / 60);

    const m =
      totalMinutes % 60;

    return `${h}h ${m}m`;
  };

  // ==============================
  // GET ATTENDANCE STATUS
  // ==============================

  const getStatus = () => {
    if (!attendance) {
      return {
        text: "Not Clocked In",
        className: "status inactive",
      };
    }

    if (attendance.isClockedIn) {
      return {
        text: "Clocked In",
        className: "status active",
      };
    }

    return {
      text: "Clocked Out",
      className: "status inactive",
    };
  };

  const status = getStatus();

  // ==============================
  // USER NOT AVAILABLE
  // ==============================

  if (!user) {
    return null;
  }

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="app-container">
        <Header user={user} />

        <main className="main-content">
          <div className="loading">
            Loading attendance...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">

      {/* ================= HEADER ================= */}

      <Header user={user} />

      {/* ================= MAIN CONTENT ================= */}

      <main className="main-content">

        {/* ================= PAGE HEADER ================= */}

        <div className="page-header">
          <div>
            <h1>
              Dashboard
            </h1>

            <p>
               Welcome, {user.name || "User"}.
            </p>
          </div>
        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="page-error">
            {error}
          </div>
        )}

        {/* ================= TODAY'S ATTENDANCE ================= */}

        <div className="table-container">

          <div className="dashboard-section-header">
            <div>
              <h2>
                Today's Attendance
              </h2>

              <p>
                Your attendance status for today.
              </p>
            </div>
          </div>

          <div className="details-grid">

            {/* Status */}
            <div className="detail-item">
              <span className="detail-label">
                Status
              </span>

              <span className={status.className}>
                {status.text}
              </span>
            </div>

            {/* Total Hours */}
            <div className="detail-item">
              <span className="detail-label">
                Total Hours
              </span>

              <span className="detail-value">
                {formatDuration(
                  attendance?.totalHours || 0
                )}
              </span>
            </div>

            {/* Sessions */}
            <div className="detail-item">
              <span className="detail-label">
                Sessions
              </span>

              <span className="detail-value">
                {attendance?.sessions?.length || 0}
              </span>
            </div>

            {/* Overtime */}
            <div className="detail-item">
              <span className="detail-label">
                Overtime
              </span>

              <span
                className={
                  attendance?.isOvertime
                    ? "status active"
                    : "status inactive"
                }
              >
                {attendance?.isOvertime
                  ? "Yes"
                  : "No"}
              </span>
            </div>

          </div>
        </div>

        {/* ================= TODAY'S SESSIONS ================= */}

        <div className="table-container">

          <div className="dashboard-section-header">
            <div>
              <h2>
                Today's Sessions
              </h2>

              <p>
                Your clock-in and clock-out sessions.
              </p>
            </div>
          </div>

          {!attendance ||
          !attendance.sessions ||
          attendance.sessions.length === 0 ? (

            <div className="empty">
              No attendance sessions recorded today.
            </div>

          ) : (

            <table className="data-table">

              <thead>
                <tr>
                  <th>#</th>
                  <th>Clock In</th>
                  <th>Clock Out</th>
                  <th>Duration</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {attendance.sessions.map(
                  (
                    session: AttendanceSession,
                    index: number
                  ) => (
                    <tr key={session.id}>

                      <td>
                        {index + 1}
                      </td>

                      <td>
                        {formatTime(
                          session.clockIn
                        )}
                      </td>

                      <td>
                        {formatTime(
                          session.clockOut
                        )}
                      </td>

                      <td>
                        {session.clockOut
                          ? formatDuration(
                              session.durationHours
                            )
                          : "In Progress"}
                      </td>

                      <td>
                        <span
                          className={
                            session.clockOut
                              ? "status inactive"
                              : "status active"
                          }
                        >
                          {session.clockOut
                            ? "Completed"
                            : "Active"}
                        </span>
                      </td>

                    </tr>
                  )
                )}
              </tbody>

            </table>
          )}

        </div>

      </main>
    </div>
  );
}

