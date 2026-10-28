
import { useEffect, useState } from "react";

import type {
  CreateProject,
  Manager,
  Project,
  UpdateProject,
} from "../../types/project";

interface ProjectModalProps {
  project: Project | null;
  managers: Manager[];
  onClose: () => void;
  onCreate: (data: CreateProject) => Promise<void>;
  onUpdate: (
    id: number,
    data: UpdateProject
  ) => Promise<void>;
}

export default function ProjectModal({
  project,
  managers,
  onClose,
  onCreate,
  onUpdate,
}: ProjectModalProps) {
  const isEdit = project !== null;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [managerId, setManagerId] = useState<number>(0);
  const [active, setActive] = useState(true);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description || "");
      setManagerId(project.managerId);
      setActive(project.active);
    } else {
      setName("");
      setDescription("");
      setManagerId(0);
      setActive(true);
    }

    setError("");
  }, [project]);

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    if (!managerId) {
      setError("Please select a manager.");
      return;
    }

    try {
      setLoading(true);

      if (isEdit) {
        await onUpdate(project.id, {
          name: name.trim(),
          description: description.trim(),
          managerId,
          active,
        });
      } else {
        await onCreate({
          name: name.trim(),
          description: description.trim(),
          managerId,
        });
      }

      onClose();
    } catch (err: any) {
      setError(
        err?.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">

        {/* Modal Header */}

        <div className="modal-header">
          <div className="modal-header-content">
            <h2>
              {isEdit
                ? "Edit Project"
                : "Create Project"}
            </h2>

            <p>
              {isEdit
                ? "Update project information"
                : "Create a new project and assign a manager"}
            </p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            disabled={loading}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Error */}

        {error && (
          <div className="modal-error">
            {error}
          </div>
        )}

        {/* Form */}

        <form onSubmit={handleSubmit}>
          <div className="modal-form">

            {/* Project Name */}

            <div className="form-group">
              <label>
                Project Name{" "}
                <span className="required">
                  *
                </span>
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Enter project name"
                disabled={loading}
              />
            </div>

            {/* Manager */}

            <div className="form-group">
              <label>
                Manager{" "}
                <span className="required">
                  *
                </span>
              </label>

              <select
                value={managerId}
                onChange={(event) =>
                  setManagerId(
                    Number(event.target.value)
                  )
                }
                disabled={loading}
              >
                <option value={0}>
                  Select Manager
                </option>

                {managers.map((manager) => (
                  <option
                    key={manager.id}
                    value={manager.id}
                  >
                    {manager.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}

            <div className="form-group full-width">
              <label>
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                placeholder="Enter project description"
                rows={4}
                disabled={loading}
              />
            </div>

            {/* Status */}

            {isEdit && (
              <div className="form-group">
                <label>
                  Status
                </label>

                <select
                  value={
                    active
                      ? "Active"
                      : "Inactive"
                  }
                  onChange={(event) =>
                    setActive(
                      event.target.value ===
                        "Active"
                    )
                  }
                  disabled={loading}
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>
              </div>
            )}
          </div>

          {/* Modal Actions */}

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-button"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : isEdit
                  ? "Update"
                  : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

