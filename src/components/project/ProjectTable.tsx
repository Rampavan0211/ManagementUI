import type { Project } from "../types/project";

interface ProjectTableProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
}

const ProjectTable = ({
  projects,
  onEdit,
  onDelete,
}: ProjectTableProps) => {
  return (
    <div className="table-container">

      {projects.length === 0 ? (
        <div className="empty">
          No projects found.
        </div>
      ) : (
        <table className="data-table">

          <thead>
            <tr>
              <th>Project Name</th>
              <th>Description</th>
              <th>Manager</th>
              <th>Manager Email</th>
              <th>Status</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>

                <td>
                  {project.name}
                </td>

                <td>
                  {project.description || "-"}
                </td>

                <td>
                  {project.managerName || "-"}
                </td>

                <td>
                  {project.managerEmail || "-"}
                </td>

                <td>
                  <span
                    className={
                      project.active
                        ? "status active"
                        : "status inactive"
                    }
                  >
                    {project.active
                      ? "Active"
                      : "Inactive"}
                  </span>
                </td>

                <td>
                  {project.createdDate
                    ? new Date(
                        project.createdDate
                      ).toLocaleDateString()
                    : "-"}
                </td>

                <td>

                  <button
                    type="button"
                    className="action-button"
                    onClick={() =>
                      onEdit(project)
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="action-button delete-button"
                    onClick={() =>
                      onDelete(project.id)
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}
          </tbody>

        </table>
      )}

    </div>
  );
};

export default ProjectTable;