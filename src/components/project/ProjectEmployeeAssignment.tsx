
import { useEffect, useState } from "react";

import {
  getEmployees,
  getManagerAvailableEmployees,
} from "../../services/EmployeeService";

import type { Employee } from "../../types/employee";

import {
  getProjectEmployees,
  assignEmployeeToProject,
  removeEmployeeFromProject,
  type ProjectEmployee,
} from "../../services/ProjectEmployeeService";

interface ProjectEmployeeAssignmentProps {
  projectId: number;
  organisationId: number;
}

export default function ProjectEmployeeAssignment({
  projectId,
  organisationId,
}: ProjectEmployeeAssignmentProps) {
  // =========================================================
  // State
  // =========================================================

  const [employees, setEmployees] = useState<Employee[]>([]);

  const [assignedEmployees, setAssignedEmployees] =
    useState<ProjectEmployee[]>([]);

  const [selectedEmployeeId, setSelectedEmployeeId] =
    useState<number>(0);

  const [searchEmployee, setSearchEmployee] =
    useState("");

  const [loadingEmployees, setLoadingEmployees] =
    useState(true);

  const [loadingAssignments, setLoadingAssignments] =
    useState(true);

  const [assigning, setAssigning] =
    useState(false);

  const [removingId, setRemovingId] =
    useState<number | null>(null);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [removePopupOpen, setRemovePopupOpen] =
    useState(false);

  const [employeeToRemove, setEmployeeToRemove] =
    useState<ProjectEmployee | null>(null);

  // =========================================================
  // Get Logged-in User Role
  // =========================================================

  const getRole = (): string => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return localStorage.getItem("role") || "";
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      return (
        parsedUser.role ||
        parsedUser.Role ||
        localStorage.getItem("role") ||
        ""
      );
    } catch {
      return localStorage.getItem("role") || "";
    }
  };

  // =========================================================
  // Load Data
  // =========================================================

  useEffect(() => {
    loadEmployees();
    loadAssignments();
  }, [projectId, organisationId]);

  const loadEmployees = async () => {
    try {
      setLoadingEmployees(true);
      setError("");

      const role = getRole();

      let data: Employee[];

      if (role.toLowerCase() === "manager") {
        data = await getManagerAvailableEmployees();
      } else {
        data = await getEmployees();
      }

      const filteredEmployees = data.filter(
        (employee) =>
          employee.organisationId === organisationId &&
          employee.active
      );

      setEmployees(filteredEmployees);
    } catch (err: any) {
      console.error(
        "Failed to load employees:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load employees."
      );
    } finally {
      setLoadingEmployees(false);
    }
  };

  const loadAssignments = async () => {
    try {
      setLoadingAssignments(true);
      setError("");

      const data =
        await getProjectEmployees(projectId);

      setAssignedEmployees(data);
    } catch (err: any) {
      console.error(
        "Failed to load project employees:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load assigned employees."
      );
    } finally {
      setLoadingAssignments(false);
    }
  };

  // =========================================================
  // Assign Employee
  // =========================================================

  const handleAssign = async () => {
    if (!selectedEmployeeId) {
      setError("Please select an employee.");
      setSuccess("");
      return;
    }

    try {
      setAssigning(true);
      setError("");
      setSuccess("");

      const result =
        await assignEmployeeToProject(
          projectId,
          selectedEmployeeId
        );

      setAssignedEmployees((current) => [
        ...current,
        result,
      ]);

      setSelectedEmployeeId(0);
      setSearchEmployee("");

      setSuccess(
        `${result.employeeName} assigned to the project successfully.`
      );
    } catch (err: any) {
      console.error(
        "Failed to assign employee:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to assign employee."
      );
    } finally {
      setAssigning(false);
    }
  };

  // =========================================================
  // Remove Employee
  // =========================================================

  const handleRemoveClick = (
    assignment: ProjectEmployee
  ) => {
    setEmployeeToRemove(assignment);
    setRemovePopupOpen(true);
    setError("");
    setSuccess("");
  };

  const handleCancelRemove = () => {
    if (removingId !== null) {
      return;
    }

    setRemovePopupOpen(false);
    setEmployeeToRemove(null);
  };

  const handleConfirmRemove = async () => {
    if (!employeeToRemove) {
      return;
    }

    try {
      setRemovingId(employeeToRemove.id);
      setError("");
      setSuccess("");

      await removeEmployeeFromProject(
        employeeToRemove.id
      );

      setAssignedEmployees((current) =>
        current.filter(
          (item) =>
            item.id !== employeeToRemove.id
        )
      );

      setSuccess(
        `${employeeToRemove.employeeName} removed from the project successfully.`
      );

      setRemovePopupOpen(false);
      setEmployeeToRemove(null);
    } catch (err: any) {
      console.error(
        "Failed to remove employee:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to remove employee."
      );
    } finally {
      setRemovingId(null);
    }
  };

  // =========================================================
  // Available Employees
  // =========================================================

  const availableEmployees =
    employees.filter(
      (employee) =>
        !assignedEmployees.some(
          (assignment) =>
            assignment.employeeId === employee.id &&
            assignment.active
        )
    );

  // =========================================================
  // Search Employees
  // =========================================================

  const filteredEmployees =
    availableEmployees.filter((employee) => {
      const searchText =
        searchEmployee.trim().toLowerCase();

      if (!searchText) {
        return true;
      }

      const fullName =
        `${employee.firstName} ${employee.lastName}`
          .toLowerCase();

      const email =
        employee.email?.toLowerCase() || "";

      return (
        fullName.includes(searchText) ||
        email.includes(searchText)
      );
    });

  // =========================================================
  // Render
  // =========================================================

  return (
    <>
      <div className="modal-form project-assignment">

        {/* =================================================
            Messages
        ================================================= */}

        {error && (
          <div className="page-error">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        {/* =================================================
            Assign Employee
        ================================================= */}

        <div className="form-section">

          <div className="form-section-header">
            <div>
              <h3>Assign Employee</h3>

              <p>
                Search and select an available employee
                to assign to this project.
              </p>
            </div>
          </div>

          {/* Search */}

          <div className="form-group">
            <label htmlFor="employee-search">
              Search Employee
            </label>

            <input
              id="employee-search"
              type="text"
              value={searchEmployee}
              onChange={(event) =>
                setSearchEmployee(
                  event.target.value
                )
              }
              placeholder="Search by name or email..."
              disabled={
                loadingEmployees || assigning
              }
            />
          </div>

          {/* Employee Selection */}

          <div className="form-group">
            <label htmlFor="employee">
              Select Employee
            </label>

            {loadingEmployees ? (
              <div className="loading">
                Loading employees...
              </div>
            ) : (
              <select
                id="employee"
                value={selectedEmployeeId}
                onChange={(event) =>
                  setSelectedEmployeeId(
                    Number(event.target.value)
                  )
                }
                disabled={
                  assigning ||
                  filteredEmployees.length === 0
                }
              >
                <option value={0}>
                  -- Select Employee --
                </option>

                {filteredEmployees.map(
                  (employee) => (
                    <option
                      key={employee.id}
                      value={employee.id}
                    >
                      {employee.firstName}{" "}
                      {employee.lastName} -{" "}
                      {employee.email}
                    </option>
                  )
                )}
              </select>
            )}

            {!loadingEmployees &&
              availableEmployees.length === 0 && (
                <small>
                  No available employees to assign.
                </small>
              )}

            {!loadingEmployees &&
              availableEmployees.length > 0 &&
              filteredEmployees.length === 0 && (
                <small>
                  No employees found matching your
                  search.
                </small>
              )}
          </div>

          {/* Assign Button */}

          <div className="modal-actions">
            <button
              type="button"
              className="action-button"
              onClick={handleAssign}
              disabled={
                assigning ||
                loadingEmployees ||
                selectedEmployeeId === 0
              }
            >
              {assigning
                ? "Assigning..."
                : "Assign Employee"}
            </button>
          </div>
        </div>

        {/* =================================================
            Assigned Employees
        ================================================= */}

        <div className="form-section">

          <div className="form-section-header">
            <div>
              <h3>Assigned Employees</h3>

              <p>
                Employees currently assigned to this
                project.
              </p>
            </div>
          </div>

          {loadingAssignments ? (
            <div className="loading">
              Loading assigned employees...
            </div>
          ) : assignedEmployees.length === 0 ? (
            <div className="empty">
              No employees are currently assigned
              to this project.
            </div>
          ) : (
            <div className="assigned-employees-table-container">

              <table className="data-table assigned-employees-table">

                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Email</th>
                    <th>Assigned Date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {assignedEmployees.map(
                    (assignment) => (
                      <tr key={assignment.id}>

                        <td>
                          <strong>
                            {assignment.employeeName}
                          </strong>
                        </td>

                        <td>
                          {assignment.employeeEmail}
                        </td>

                        <td>
                          {new Date(
                            assignment.assignedDate
                          ).toLocaleDateString()}
                        </td>

                        <td>
                          <button
                            type="button"
                            className="action-button delete-button"
                            onClick={() =>
                              handleRemoveClick(
                                assignment
                              )
                            }
                            disabled={
                              removingId ===
                              assignment.id
                            }
                          >
                            {removingId ===
                            assignment.id
                              ? "Removing..."
                              : "Remove"}
                          </button>
                        </td>

                      </tr>
                    )
                  )}
                </tbody>

              </table>

            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          Remove Employee Confirmation Popup
      ===================================================== */}

      {removePopupOpen &&
        employeeToRemove && (
          <div
            className="modal-overlay delete-confirm-overlay"
            onClick={handleCancelRemove}
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

                <h2>Remove Employee?</h2>

                <p>
                  Are you sure you want to remove{" "}
                  <strong>
                    {
                      employeeToRemove.employeeName
                    }
                  </strong>{" "}
                  from this project?
                </p>

                <span className="delete-confirm-warning">
                  The employee will no longer be
                  assigned to this project.
                </span>

              </div>

              <div className="delete-confirm-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCancelRemove}
                  disabled={removingId !== null}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="confirm-delete-button"
                  onClick={handleConfirmRemove}
                  disabled={removingId !== null}
                >
                  {removingId !== null
                    ? "Removing..."
                    : "Remove"}
                </button>

              </div>

            </div>
          </div>
        )}
    </>
  );
}

