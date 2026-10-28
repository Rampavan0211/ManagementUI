
import { useEffect, useState } from "react";

import Header from "../../components/common/Header";
import ProjectEmployeeAssignment from "../../components/project/ProjectEmployeeAssignment";

import {
  getMyProjects,
  type ManagerProject,
} from "../../services/ManagerService";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function ManagerDashboard() {
  const [user, setUser] = useState<User | null>(null);

  const [projects, setProjects] = useState<ManagerProject[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedProject, setSelectedProject] =
    useState<ManagerProject | null>(null);

  useEffect(() => {
    loadUser();
    loadProjects();
  }, []);

  const loadUser = () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setError("User information not found.");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      const currentUser: User = {
        id: Number(parsedUser.id),
        name:
          parsedUser.name ||
          `${parsedUser.firstName || ""} ${
            parsedUser.lastName || ""
          }`.trim(),
        email: parsedUser.email || "",
        role: parsedUser.role || "",
      };

      setUser(currentUser);
    } catch (error) {
      console.error(
        "Failed to parse logged-in user:",
        error
      );

      setError("Invalid user information.");
    }
  };

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyProjects();

      setProjects(data);
    } catch (err: any) {
      console.error(
        "Failed to load manager projects:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load your projects."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {user && <Header user={user} />}

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1>My Projects</h1>

            <p>
              View your projects and manage assigned
              employees.
            </p>
          </div>
        </div>

        {error && (
          <div className="page-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading">
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="table-container">
            <div className="empty">
              <h3>No Projects Assigned</h3>

              <p>
                You currently do not have any projects
                assigned to you.
              </p>
            </div>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Description</th>
                  <th>Organisation</th>
                  <th>Created Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td>
                      <strong>
                        {project.name}
                      </strong>
                    </td>

                    <td>
                      {project.description || "-"}
                    </td>

                    <td>
                      {project.organisationName}
                    </td>

                    <td>
                      {new Date(
                        project.createdDate
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      <button
                        type="button"
                        className="action-button"
                        onClick={() =>
                          setSelectedProject(project)
                        }
                      >
                        Manage Employees
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedProject && (
          <div
            className="modal-overlay"
            onClick={() =>
              setSelectedProject(null)
            }
          >
            <div
              className="modal-container"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <div className="modal-header">
                <div className="modal-header-content">
                  <div>
                    <h2>
                      {selectedProject.name}
                    </h2>

                    <p>
                      Assign employees to this
                      project
                    </p>
                  </div>

                  <button
                    type="button"
                    className="modal-close"
                    onClick={() =>
                      setSelectedProject(null)
                    }
                  >
                    ×
                  </button>
                </div>
              </div>

              <ProjectEmployeeAssignment
                projectId={selectedProject.id}
                organisationId={
                  selectedProject.organisationId
                }
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

