
import {
  useEffect,
  type MouseEvent,
} from "react";

import { createPortal } from "react-dom";

import type {
  Organisation,
  UpdateOrganisation,
  Industry,
  CreateAdmin,
} from "../../types/organisation";

interface Props {
  mode: "create" | "edit";

  selectedOrganisation: Organisation | null;

  form: UpdateOrganisation;

  admin: CreateAdmin;

  industries: Industry[];

  saving: boolean;

  errorMessage: string;

  onClose: () => void;

  onChange: (
    field: keyof UpdateOrganisation,
    value: string | number | boolean
  ) => void;

  onAdminChange: (
    field: keyof CreateAdmin,
    value: string | boolean
  ) => void;

  onCreate: () => void;

  onUpdate: () => void;
}

const OrganisationModal = ({
  mode,
  form,
  admin,
  industries,
  saving,
  errorMessage,
  onClose,
  onChange,
  onAdminChange,
  onCreate,
  onUpdate,
}: Props) => {

  // ==========================================
  // Prevent background scrolling
  // ==========================================

  useEffect(() => {
    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, []);

  // ==========================================
  // Escape key
  // ==========================================

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (
        event.key === "Escape" &&
        !saving
      ) {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [onClose, saving]);

  // ==========================================
  // Overlay click
  // ==========================================

  const handleOverlayClick = (
    event: MouseEvent<HTMLDivElement>
  ) => {
    if (
      event.target === event.currentTarget &&
      !saving
    ) {
      onClose();
    }
  };

  // ==========================================
  // Modal
  // ==========================================

  const modalContent = (
    <div
      className="modal-overlay"
      onMouseDown={handleOverlayClick}
    >
      <div
        className="modal-container"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >

        {/* ====================================
            HEADER
        ==================================== */}

        <div className="modal-header">

          <div className="modal-header-content">

            <h2>
              {mode === "create"
                ? "Add Organisation"
                : "Edit Organisation"}
            </h2>

            <p>
              {mode === "create"
                ? "Create a new organisation"
                : "Update organisation information"}
            </p>

          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
          >
            ×
          </button>

        </div>


        {/* ====================================
            ERROR
        ==================================== */}

        {errorMessage && (
          <div className="modal-error">
            {errorMessage}
          </div>
        )}


        {/* ====================================
            FORM
        ==================================== */}

        <div className="modal-form">

          {/* ==================================
              ORGANISATION DETAILS
          ================================== */}

          <FormInput
            label="Organisation Name *"
            value={form.name}
            placeholder="Enter organisation name"
            disabled={saving}
            onChange={(value) =>
              onChange(
                "name",
                value
              )
            }
          />


          {/* Industry */}

          <div className="form-group">

            <label>
              Industry *
            </label>

            <select
              value={form.industryId}
              onChange={(event) =>
                onChange(
                  "industryId",
                  Number(
                    event.target.value
                  )
                )
              }
              disabled={saving}
            >

              <option value={0}>
                Select Industry
              </option>

              {industries.map(
                (industry) => (
                  <option
                    key={industry.id}
                    value={industry.id}
                  >
                    {industry.name}
                  </option>
                )
              )}

            </select>

          </div>


          {/* Organisation Contact */}

          <FormInput
            label="Organisation Contact *"
            value={
              form.orgContact
            }
            placeholder="Contact person"
            disabled={saving}
            onChange={(value) =>
              onChange(
                "orgContact",
                value
              )
            }
          />


          {/* Contact Email */}

          <div className="form-group">

            <label>
              Organisation Contact Email *
            </label>

            <input
              type="email"
              value={
                form.orgContactEmail
              }
              onChange={(event) =>
                onChange(
                  "orgContactEmail",
                  event.target.value
                )
              }
              placeholder="Enter contact email"
              disabled={saving}
            />

          </div>


          {/* Contact Phone */}

          <FormInput
            label="Contact Phone *"
            value={
              form.orgContactPhone
            }
            placeholder="Contact phone"
            disabled={saving}
            onChange={(value) =>
              onChange(
                "orgContactPhone",
                value
              )
            }
          />


          {/* Description */}

          <div className="form-group full-width">

            <label>
              Description
            </label>

            <textarea
              value={
                form.description
              }
              onChange={(event) =>
                onChange(
                  "description",
                  event.target.value
                )
              }
              placeholder="Enter description"
              rows={3}
              disabled={saving}
            />

          </div>


          {/* Address 1 */}

          <FormInput
            label="Address 1 *"
            value={
              form.address1
            }
            placeholder="Address"
            disabled={saving}
            onChange={(value) =>
              onChange(
                "address1",
                value
              )
            }
          />


          {/* Address 2 */}

          <FormInput
            label="Address 2"
            value={
              form.address2
            }
            placeholder="Address 2"
            disabled={saving}
            onChange={(value) =>
              onChange(
                "address2",
                value
              )
            }
          />


          {/* City */}

          <FormInput
            label="City *"
            value={
              form.city
            }
            placeholder="City"
            disabled={saving}
            onChange={(value) =>
              onChange(
                "city",
                value
              )
            }
          />


          {/* State */}

          <FormInput
            label="State *"
            value={
              form.state
            }
            placeholder="State"
            disabled={saving}
            onChange={(value) =>
              onChange(
                "state",
                value
              )
            }
          />


          {/* Country */}

          <FormInput
            label="Country *"
            value={
              form.country
            }
            placeholder="Country"
            disabled={saving}
            onChange={(value) =>
              onChange(
                "country",
                value
              )
            }
          />


          {/* Zipcode */}

          <FormInput
            label="Zipcode *"
            value={
              form.zipcode
            }
            placeholder="Zipcode"
            disabled={saving}
            onChange={(value) =>
              onChange(
                "zipcode",
                value
              )
            }
          />


          {/* ==================================
              ADMIN DETAILS
          ================================== */}

          {mode === "create" && (
            <div className="form-section full-width">

              <div className="form-section-header">

                <h3>
                  Admin Details
                </h3>

                <p>
                  Create the primary
                  administrator account
                  for this organisation.
                </p>

              </div>


              {/* First Name */}

              <FormInput
                label="First Name *"
                value={
                  admin.firstName
                }
                placeholder="Enter first name"
                disabled={saving}
                onChange={(value) =>
                  onAdminChange(
                    "firstName",
                    value
                  )
                }
              />


              {/* Last Name */}

              <FormInput
                label="Last Name *"
                value={
                  admin.lastName
                }
                placeholder="Enter last name"
                disabled={saving}
                onChange={(value) =>
                  onAdminChange(
                    "lastName",
                    value
                  )
                }
              />


              {/* Admin Email */}

              <div className="form-group">

                <label>
                  Admin Email *
                </label>

                <input
                  type="email"
                  value={
                    admin.email
                  }
                  onChange={(event) =>
                    onAdminChange(
                      "email",
                      event.target.value
                    )
                  }
                  placeholder="Enter admin email"
                  disabled={saving}
                />

              </div>


              {/* Password */}

              <div className="form-group">

                <label>
                  Password *
                </label>

                <input
                  type="password"
                  value={
                    admin.password
                  }
                  onChange={(event) =>
                    onAdminChange(
                      "password",
                      event.target.value
                    )
                  }
                  placeholder="Enter admin password"
                  disabled={saving}
                />

              </div>


              {/* Notify */}

              <div className="form-group">

                <label>
                  Account Notification
                </label>

                <label className="checkbox-label">

                  <input
                    type="checkbox"
                    checked={
                      admin.notify
                    }
                    onChange={(event) =>
                      onAdminChange(
                        "notify",
                        event.target.checked
                      )
                    }
                    disabled={saving}
                  />

                  <span>
                    Send activation email
                    to admin
                  </span>

                </label>

              </div>

            </div>
          )}


          {/* ==================================
              STATUS - EDIT MODE ONLY
          ================================== */}

          {mode === "edit" && (
            <div className="form-group">

              <label>
                Status
              </label>

              <select
                value={
                  form.active
                    ? "Active"
                    : "Inactive"
                }
                onChange={(event) =>
                  onChange(
                    "active",
                    event.target.value ===
                      "Active"
                  )
                }
                disabled={saving}
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


        {/* ====================================
            ACTIONS
        ==================================== */}

        <div className="modal-actions">

          <button
            type="button"
            className="cancel-button"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="button"
            className="save-button"
            onClick={
              mode === "create"
                ? onCreate
                : onUpdate
            }
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : mode === "create"
                ? "Create"
                : "Save"}
          </button>

        </div>

      </div>
    </div>
  );

  // ==========================================
  // Portal
  // ==========================================

  return createPortal(
    modalContent,
    document.body
  );
};


/* ============================================
   FORM INPUT
============================================ */

const FormInput = ({
  label,
  value,
  placeholder,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  disabled: boolean;
  onChange: (
    value: string
  ) => void;
}) => {
  return (
    <div className="form-group">

      <label>
        {label}
      </label>

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
      />

    </div>
  );
};

export default OrganisationModal;

