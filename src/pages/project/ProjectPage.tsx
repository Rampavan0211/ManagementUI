
import { useEffect, useState } from "react";

import ProjectTable from "../../components/project/ProjectTable";
import ProjectModal from "../../components/project/ProjectModal";
import Header from "../../components/common/Header";

import type {
  Project,
  Manager,
  CreateProject,
  UpdateProject,
} from "../../types/project";

import type { LoginUser } from "../../types/auth";

import {
  getProjects,
  getManagers,
  createProject,
  updateProject,
  deleteProject,
} from "../../services/ProjectService";

export default function ProjectPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);

  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);

  const [modalOpen, setModalOpen] = useState(false);

  // Delete confirmation popup
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] =
    useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==============================
  // GET CURRENT USER
  // ==============================

  const userString = localStorage.getItem("user");

  let user: LoginUser | null = null;

  try {
    user = userString
      ? JSON.parse(userString)
      : null;
  } catch {
    user = null;
  }

  // ==============================
  // LOAD PROJECTS
  // ==============================

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProjects();

      setProjects(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load projects."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // LOAD MANAGERS
  // ==============================

  const loadManagers = async () => {
    try {
      const data = await getManagers();

      setManagers(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load managers."
      );
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

    loadProjects();
    loadManagers();
  }, []);

  // ==============================
  // CREATE BUTTON
  // ==============================

  const handleCreateClick = () => {
    setSelectedProject(null);
    setModalOpen(true);
  };

  // ==============================
  // EDIT
  // ==============================

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  // ==============================
  // DELETE
  // ==============================

  const handleDelete = (id: number) => {
    const project = projects.find(
      (existingProject) =>
        existingProject.id === id
    );

    if (!project) return;

    setProjectToDelete(project);
    setDeletePopupOpen(true);
  };

  // ==============================
  // CANCEL DELETE
  // ==============================

  const handleCancelDelete = () => {
    if (deleting) return;

    setDeletePopupOpen(false);
    setProjectToDelete(null);
  };

  // ==============================
  // CONFIRM DELETE
  // ==============================

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;

    try {
      setDeleting(true);
      setError("");

      await deleteProject(projectToDelete.id);

      setProjects((previous) =>
        previous.filter(
          (project) =>
            project.id !== projectToDelete.id
        )
      );

      setDeletePopupOpen(false);
      setProjectToDelete(null);
    } catch (err: any) {
      console.error(
        "Failed to delete project:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete project."
      );
    } finally {
      setDeleting(false);
    }
  };

  // ==============================
  // CREATE
  // ==============================

  const handleCreate = async (
    data: CreateProject
  ) => {
    await createProject(data);

    await loadProjects();
  };

  // ==============================
  // UPDATE
  // ==============================

  const handleUpdate = async (
    id: number,
    data: UpdateProject
  ) => {
    await updateProject(id, data);

    await loadProjects();
  };

  // ==============================
  // CLOSE MODAL
  // ==============================

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProject(null);
  };

  // ==============================
  // USER CHECK
  // ==============================

  if (!user) {
    return null;
  }

  return (
    <div className="app-container">

      {/* ================= HEADER ================= */}

      <Header
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }}
      />

      {/* ================= PAGE CONTENT ================= */}

      <main className="main-content">

        <div className="page-header">

          <div>
            <h1>Project Management</h1>

            <p>
              Manage projects and assign managers.
            </p>
          </div>

          <button
            type="button"
            className="add-button"
            onClick={handleCreateClick}
          >
            + Create Project
          </button>

        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="page-error">
            {error}
          </div>
        )}

        {/* ================= PROJECT TABLE ================= */}

        {loading ? (
          <div className="loading">
            Loading projects...
          </div>
        ) : (
          <ProjectTable
            projects={projects}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

      </main>

      {/* ================= PROJECT MODAL ================= */}

      {modalOpen && (
        <ProjectModal
          project={selectedProject}
          managers={managers}
          onClose={handleCloseModal}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
        />
      )}

      {/* ================= DELETE CONFIRMATION ================= */}

      {deletePopupOpen && projectToDelete && (
        <div
          className="modal-overlay delete-confirm-overlay"
          onClick={handleCancelDelete}
        >
          <div
            className="delete-confirm-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="delete-confirm-icon">
              !
            </div>

            <div className="delete-confirm-content">
              <h2>Delete Project?</h2>

              <p>
                Are you sure you want to delete{" "}
                <strong>
                  {projectToDelete.name}
                </strong>
                ?
              </p>

              <span className="delete-confirm-warning">
                This action cannot be undone.
              </span>
            </div>

            <div className="delete-confirm-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={handleCancelDelete}
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="confirm-delete-button"
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting
                  ? "Deleting..."
                  : "Delete"}
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

