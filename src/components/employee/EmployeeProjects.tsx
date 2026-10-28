
import { useEffect, useState } from "react";

import api from "../../api/axiosInstance";
import Header from "../common/Header";
import type { LoginUser } from "../../types/auth";

interface EmployeeProject {
  id: number;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export default function EmployeeProjects() {
  const [projects, setProjects] =
    useState<EmployeeProject[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // Get logged-in user
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

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get<EmployeeProject[]>(
          "/Project/employee/my-projects"
        );

      setProjects(response.data);

    } catch (err: any) {
      console.error(
        "Failed to load projects:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Failed to load projects."
      );

    } finally {
      setLoading(false);
    }
  };

  const formatDate = (
    date?: string
  ) => {
    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleDateString();
  };

  // User not available
  if (!user) {
    return null;
  }

  // Loading
  if (loading) {
    return (
      <div className="app-container">

        <Header user={user} />

        <main className="main-content">
          <div className="loading">
            Loading projects...
          </div>
        </main>

      </div>
    );
  }

  return (
    <div className="app-container">

      {/* Common Header */}
      <Header user={user} />

      <main className="main-content">

        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1>
              My Projects
            </h1>

            <p>
              Projects assigned to you.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="modal-error">
            {error}
          </div>
        )}

        {/* Projects Table */}
        <div className="table-container">

          {projects.length === 0 ? (

            <div className="empty">
              No projects assigned to you.
            </div>

          ) : (

            <table className="data-table">

              <thead>
                <tr>
                  <th>Project</th>
                  <th>Description</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {projects.map(
                  (project) => (

                    <tr key={project.id}>

                      <td>
                        {project.name}
                      </td>

                      <td>
                        {project.description || "-"}
                      </td>

                      <td>
                        {formatDate(
                          project.startDate
                        )}
                      </td>

                      <td>
                        {formatDate(
                          project.endDate
                        )}
                      </td>

                      <td>
                        <span
                          className={
                            project.status?.toLowerCase() ===
                            "active"
                              ? "status active"
                              : "status inactive"
                          }
                        >
                          {project.status || "-"}
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

