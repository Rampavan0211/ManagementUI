
import type { Employee } from "../../types/employee";

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: number) => void;
}

const EmployeeTable = ({
  employees,
  onEdit,
  onDelete,
}: EmployeeTableProps) => {
  return (
    <div className="table-container">
      {employees.length === 0 ? (
        <div className="empty">
          No employees found.
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Organisation ID</th>
              <th>Status</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>
                  {employee.firstName} {employee.lastName}
                </td>

                <td>{employee.email}</td>

                <td>
                  {employee.phone || "-"}
                </td>

                <td>
                  {employee.roleName || "-"}
                </td>

                <td>
                  {employee.organisationId ?? "-"}
                </td>

                <td>
                  <span
                    className={
                      employee.active
                        ? "status active"
                        : "status inactive"
                    }
                  >
                    {employee.active
                      ? "Active"
                      : "Inactive"}
                  </span>
                </td>

                <td>
                  {employee.createdDate
                    ? new Date(
                        employee.createdDate
                      ).toLocaleDateString()
                    : "-"}
                </td>

                <td>
                  <button
                    type="button"
                    className="action-button"
                    onClick={() => onEdit(employee)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="action-button delete-button"
                    onClick={() =>
                      onDelete(employee.id)
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

export default EmployeeTable;

