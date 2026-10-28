
import { useEffect, useState } from "react";

import type {
  CreateEmployee,
  Employee,
  OrganisationOption,
  Role,
  UpdateEmployee,
} from "../../types/employee";

interface EmployeeModalProps {
  employee: Employee | null;
  roles: Role[];
  organisations: OrganisationOption[];
  onClose: () => void;
  onCreate: (data: CreateEmployee) => Promise<void>;
  onUpdate: (
    id: number,
    data: UpdateEmployee
  ) => Promise<void>;
}

export default function EmployeeModal({
  employee,
  roles,
  organisations,
  onClose,
  onCreate,
  onUpdate,
}: EmployeeModalProps) {
  const isEdit = employee !== null;

  const userString = localStorage.getItem("user");

  const user = userString
    ? JSON.parse(userString)
    : null;

  const userRole = user?.role?.toLowerCase() || "";

  const isSuperAdmin = userRole === "superadmin";
  const isAdmin = userRole === "admin";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [roleId, setRoleId] = useState<number>(0);

  const [organisationId, setOrganisationId] =
    useState<number | null>(null);

  const [active, setActive] = useState(true);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /*
   * Filter roles based on logged-in user.
   *
   * SuperAdmin:
   *   Can see all roles.
   *
   * Admin:
   *   Cannot create/select SuperAdmin.
   */
  const availableRoles = isAdmin
    ? roles.filter(
        (role) =>
          role.name?.toLowerCase() !== "superadmin"
      )
    : roles;

  useEffect(() => {
    if (employee) {
      setFirstName(employee.firstName);
      setLastName(employee.lastName);
      setEmail(employee.email);
      setPhone(employee.phone || "");
      setPassword("");
      setRoleId(employee.roleId);
      setOrganisationId(employee.organisationId);
      setActive(employee.active);
    } else {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setRoleId(0);
      setActive(true);

      /*
       * Admin organisation is determined by the
       * logged-in user's organisation.
       *
       * SuperAdmin must select an organisation.
       */
      if (isAdmin && user?.organisationId) {
        setOrganisationId(Number(user.organisationId));
      } else {
        setOrganisationId(null);
      }
    }

    setError("");
  }, [employee]);

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError("");

    if (!firstName.trim()) {
      setError("First name is required.");
      return;
    }

    if (!lastName.trim()) {
      setError("Last name is required.");
      return;
    }

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!isEdit && !password.trim()) {
      setError("Password is required.");
      return;
    }

    if (!roleId) {
      setError("Please select a role.");
      return;
    }

    /*
     * Extra frontend protection:
     * Admin cannot submit SuperAdmin role even
     * if an invalid roleId somehow gets selected.
     */
    const selectedRole = roles.find(
      (role) => role.id === roleId
    );

    if (
      isAdmin &&
      selectedRole?.name?.toLowerCase() === "superadmin"
    ) {
      setError(
        "Admin users cannot create or assign the SuperAdmin role."
      );
      return;
    }

    /*
     * Only SuperAdmin needs to explicitly select
     * an organisation.
     */
    if (isSuperAdmin && !organisationId) {
      setError("Please select an organisation.");
      return;
    }

    try {
      setLoading(true);

      if (isEdit) {
        const updateData: UpdateEmployee = {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim() || undefined,
          roleId,
          organisationId,
        };

        await onUpdate(employee.id, updateData);
      } else {
        const createData: CreateEmployee = {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          password: password.trim(),
          roleId,
          organisationId,
        };

        await onCreate(createData);
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

        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-content">
            <h2>
              {isEdit
                ? "Edit Employee"
                : "Add Employee"}
            </h2>

            <p>
              {isEdit
                ? "Update employee information"
                : "Create a new employee account"}
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

            {/* First Name */}
            <div className="form-group">
              <label>
                First Name{" "}
                <span className="required">*</span>
              </label>

              <input
                type="text"
                value={firstName}
                onChange={(event) =>
                  setFirstName(event.target.value)
                }
                placeholder="Enter first name"
                disabled={loading}
              />
            </div>

            {/* Last Name */}
            <div className="form-group">
              <label>
                Last Name{" "}
                <span className="required">*</span>
              </label>

              <input
                type="text"
                value={lastName}
                onChange={(event) =>
                  setLastName(event.target.value)
                }
                placeholder="Enter last name"
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label>
                Email{" "}
                <span className="required">*</span>
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Enter email address"
                disabled={loading || isEdit}
              />
            </div>

            {/* Phone */}
            <div className="form-group">
              <label>Phone</label>

              <input
                type="text"
                value={phone}
                onChange={(event) =>
                  setPhone(event.target.value)
                }
                placeholder="Enter phone number"
                disabled={loading}
              />
            </div>

            {/* Password - Create only */}
            {!isEdit && (
              <div className="form-group">
                <label>
                  Password{" "}
                  <span className="required">*</span>
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter password"
                  disabled={loading}
                />
              </div>
            )}

            {/* Role */}
            <div className="form-group">
              <label>
                Role{" "}
                <span className="required">*</span>
              </label>

              <select
                value={roleId}
                onChange={(event) =>
                  setRoleId(
                    Number(event.target.value)
                  )
                }
                disabled={loading}
              >
                <option value={0}>
                  Select Role
                </option>

                {availableRoles.map((role) => (
                  <option
                    key={role.id}
                    value={role.id}
                  >
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Organisation - SuperAdmin only */}
            {isSuperAdmin && (
              <div className="form-group">
                <label>
                  Organisation{" "}
                  <span className="required">*</span>
                </label>

                <select
                  value={organisationId ?? 0}
                  onChange={(event) => {
                    const value = Number(
                      event.target.value
                    );

                    setOrganisationId(
                      value === 0 ? null : value
                    );
                  }}
                  disabled={loading}
                >
                  <option value={0}>
                    Select Organisation
                  </option>

                  {organisations.map(
                    (organisation) => (
                      <option
                        key={organisation.id}
                        value={organisation.id}
                      >
                        {organisation.name}
                      </option>
                    )
                  )}
                </select>
              </div>
            )}

            {/* Status - Edit only */}
            {isEdit && (
              <div className="form-group">
                <label>Status</label>

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

          {/* Actions */}
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

