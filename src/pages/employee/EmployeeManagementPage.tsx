
import { useEffect, useState } from "react";

import Header from "../../components/common/Header";
import EmployeeTable from "../../components/employee/EmployeeTable";
import EmployeeModal from "../../components/employee/EmployeeModal";

import type { LoginUser } from "../../types/auth";

import type {
  Employee,
  Role,
  OrganisationOption,
  CreateEmployee,
  UpdateEmployee,
} from "../../types/employee";

import {
  getEmployees,
  getEmployeeRoles,
  getEmployeeOrganisations,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../services/EmployeeService";

export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [organisations, setOrganisations] =
    useState<OrganisationOption[]>([]);

  const [selectedEmployee, setSelectedEmployee] =
    useState<Employee | null>(null);

  const [modalOpen, setModalOpen] = useState(false);

  // Delete confirmation popup
  const [deletePopupOpen, setDeletePopupOpen] =
    useState(false);

  const [employeeToDelete, setEmployeeToDelete] =
    useState<Employee | null>(null);

  const [deleting, setDeleting] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const userRole =
    user?.role?.toLowerCase() || "";

  const isAdmin =
    userRole === "admin";

  const isSuperAdmin =
    userRole === "superadmin";

  // ============================================
  // Load Employees
  // ============================================

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getEmployees();

      setEmployees(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load employees."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // Load Roles
  // ============================================

  const loadRoles = async () => {
    try {
      const data =
        await getEmployeeRoles();

      setRoles(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load roles."
      );
    }
  };

  // ============================================
  // Load Organisations
  // Super Admin only
  // ============================================

  const loadOrganisations = async () => {
    if (!isSuperAdmin) return;

    try {
      const data =
        await getEmployeeOrganisations();

      setOrganisations(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load organisations."
      );
    }
  };

  // ============================================
  // Initial Load
  // ============================================

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    loadEmployees();
    loadRoles();
    loadOrganisations();
  }, []);

  // ============================================
  // Create Employee
  // ============================================

  const handleCreateClick = () => {
    setSelectedEmployee(null);
    setModalOpen(true);
  };

  // ============================================
  // Edit Employee
  // ============================================

  const handleEdit = (
    employee: Employee
  ) => {
    setSelectedEmployee(employee);
    setModalOpen(true);
  };

  // ============================================
  // Open Delete Confirmation
  // ============================================

  const handleDelete = (
    id: number
  ) => {
    const employee =
      employees.find(
        (existingEmployee) =>
          existingEmployee.id === id
      );

    if (!employee) return;

    setEmployeeToDelete(employee);
    setDeletePopupOpen(true);
  };

  // ============================================
  // Cancel Delete
  // ============================================

  const handleCancelDelete = () => {
    if (deleting) return;

    setDeletePopupOpen(false);
    setEmployeeToDelete(null);
  };

  // ============================================
  // Confirm Delete
  // ============================================

  const handleConfirmDelete =
    async () => {
      if (!employeeToDelete) return;

      try {
        setDeleting(true);
        setError("");

        await deleteEmployee(
          employeeToDelete.id
        );

        setEmployees(
          (previous) =>
            previous.filter(
              (employee) =>
                employee.id !==
                employeeToDelete.id
            )
        );

        setDeletePopupOpen(false);
        setEmployeeToDelete(null);
      } catch (err: any) {
        console.error(
          "Failed to delete employee:",
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to delete employee."
        );
      } finally {
        setDeleting(false);
      }
    };

  // ============================================
  // Create
  // ============================================

  const handleCreate =
    async (
      data: CreateEmployee
    ) => {
      await createEmployee(data);
      await loadEmployees();
    };

  // ============================================
  // Update
  // ============================================

  const handleUpdate =
    async (
      id: number,
      data: UpdateEmployee
    ) => {
      await updateEmployee(
        id,
        data
      );

      await loadEmployees();
    };

  // ============================================
  // Close Modal
  // ============================================

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEmployee(null);
  };

  // ============================================
  // User Not Available
  // ============================================

  if (!user) {
    return null;
  }

  // ============================================
  // Authorization
  // ============================================

  if (!isAdmin && !isSuperAdmin) {
    return (
      <div className="app-container">
        <Header user={user} />

        <div className="main-content">
          <div className="page-error">
            You are not authorized to access
            Employee Management.
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // Page
  // ============================================

  return (
    <div className="app-container">

      <Header user={user} />

      <div className="main-content">

        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1>
              Employee Management
            </h1>

            <p>
              Manage employees and
              organisational roles.
            </p>
          </div>

          <button
            type="button"
            className="add-button"
            onClick={
              handleCreateClick
            }
          >
            + Add Employee
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="page-error">
            {error}
          </div>
        )}

        {/* Employee Table */}
        {loading ? (
          <div className="loading">
            Loading employees...
          </div>
        ) : (
          <EmployeeTable
            employees={employees}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

      </div>

      {/* Employee Create/Edit Modal */}
      {modalOpen && (
        <EmployeeModal
          employee={selectedEmployee}
          roles={roles}
          organisations={organisations}
          onClose={handleCloseModal}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
        />
      )}

      {/* Delete Confirmation Popup */}
      {deletePopupOpen &&
        employeeToDelete && (
          <div
            className="modal-overlay delete-confirm-overlay"
            onClick={
              handleCancelDelete
            }
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

                <h2>
                  Delete Employee?
                </h2>

                <p>
                  Are you sure you want
                  to delete{" "}
                  <strong>
                    {
                      employeeToDelete.firstName
                    }{" "}
                    {
                      employeeToDelete.lastName
                    }
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
                  onClick={
                    handleCancelDelete
                  }
                  disabled={deleting}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="confirm-delete-button"
                  onClick={
                    handleConfirmDelete
                  }
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

