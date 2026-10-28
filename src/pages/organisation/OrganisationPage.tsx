
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import type {
  Organisation,
  CreateOrganisation,
  UpdateOrganisation,
  Industry,
  CreateAdmin,
} from "../../types/organisation";

import {
  getOrganisations,
  getIndustries,
  createOrganisation,
  updateOrganisation,
} from "../../services/OrganisationService";

import Header from "../../components/common/Header";
import OrganisationFilters from "../../components/organisation/OrganisationFilters";
import OrganisationTable from "../../components/organisation/OrganisationTable";
import OrganisationModal from "../../components/organisation/OrganisationModal";

export default function OrganisationPage() {
  const navigate = useNavigate();

  const [organisations, setOrganisations] =
    useState<Organisation[]>([]);

  const [industries, setIndustries] =
    useState<Industry[]>([]);

  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] =
    useState("All");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [modalMode, setModalMode] =
    useState<"create" | "edit">("create");

  const [selectedOrganisation, setSelectedOrganisation] =
    useState<Organisation | null>(null);

  const [form, setForm] =
    useState<UpdateOrganisation>({
      name: "",
      orgContact: "",
      orgContactEmail: "",
      orgContactPhone: "",
      industryId: 0,
      description: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      country: "",
      zipcode: "",
      active: true,
    });

  const [admin, setAdmin] =
    useState<CreateAdmin>({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      notify: true,
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  // -------------------------------------------------------
  // Current User
  // -------------------------------------------------------

  const userString =
    localStorage.getItem("user");

  const user = userString
    ? JSON.parse(userString)
    : null;

  const isSuperAdmin =
    user?.role?.toLowerCase() === "superadmin";

  // -------------------------------------------------------
  // Load Data
  // -------------------------------------------------------

  useEffect(() => {
    loadOrganisations();
    loadIndustries();
  }, []);

  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const loadOrganisations = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data =
        await getOrganisations();

      setOrganisations(data);
    } catch (error: any) {
      console.error(
        "Error loading organisations:",
        error
      );

      if (
        error?.response?.status === 401 ||
        error?.response?.status === 403
      ) {
        handleUnauthorized();
        return;
      }

      setErrorMessage(
        error?.response?.data?.message ||
          "Failed to load organisations."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadIndustries = async () => {
    try {
      const data =
        await getIndustries();

      setIndustries(data);
    } catch (error: any) {
      console.error(
        "Error loading industries:",
        error
      );

      if (
        error?.response?.status === 401 ||
        error?.response?.status === 403
      ) {
        handleUnauthorized();
      }
    }
  };

  // -------------------------------------------------------
  // Filtering
  // -------------------------------------------------------

  const filteredOrganisations =
    useMemo(() => {
      return organisations.filter(
        (organisation) => {
          const searchValue =
            search
              .trim()
              .toLowerCase();

          const matchesSearch =
            !searchValue ||
            organisation.name
              ?.toLowerCase()
              .includes(searchValue) ||
            organisation.orgContact
              ?.toLowerCase()
              .includes(searchValue) ||
            organisation.city
              ?.toLowerCase()
              .includes(searchValue);

          const matchesIndustry =
            industryFilter === "All" ||
            organisation.industryName ===
              industryFilter;

          const matchesStatus =
            statusFilter === "All" ||
            (statusFilter === "Active" &&
              organisation.active) ||
            (statusFilter === "Inactive" &&
              !organisation.active);

          return (
            matchesSearch &&
            matchesIndustry &&
            matchesStatus
          );
        }
      );
    }, [
      organisations,
      search,
      industryFilter,
      statusFilter,
    ]);

  // -------------------------------------------------------
  // Create Organisation
  // -------------------------------------------------------

  const openCreateModal = () => {
    setErrorMessage("");

    setSelectedOrganisation(null);

    const defaultIndustryId =
      industries.length > 0
        ? industries[0].id
        : 0;

    setForm({
      name: "",
      orgContact: "",
      orgContactEmail: "",
      orgContactPhone: "",
      industryId: defaultIndustryId,
      description: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      country: "",
      zipcode: "",
      active: true,
    });

    setAdmin({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      notify: true,
    });

    setModalMode("create");
    setModalOpen(true);
  };

  // -------------------------------------------------------
  // Open Organisation Directly in Edit Mode
  // -------------------------------------------------------

  const openEditModal = (
    organisation: Organisation
  ) => {
    setErrorMessage("");

    setSelectedOrganisation(
      organisation
    );

    setForm({
      name:
        organisation.name ?? "",

      orgContact:
        organisation.orgContact ?? "",

      orgContactEmail:
        organisation.orgContactEmail ?? "",

      orgContactPhone:
        organisation.orgContactPhone ?? "",

      industryId:
        organisation.industryId ?? 0,

      description:
        organisation.description ?? "",

      address1:
        organisation.address1 ?? "",

      address2:
        organisation.address2 ?? "",

      city:
        organisation.city ?? "",

      state:
        organisation.state ?? "",

      country:
        organisation.country ?? "",

      zipcode:
        organisation.zipcode ?? "",

      active:
        organisation.active ?? true,
    });

    setModalMode("edit");
    setModalOpen(true);
  };

  // -------------------------------------------------------
  // Close Modal
  // -------------------------------------------------------

  const closeModal = () => {
    if (saving) {
      return;
    }

    setModalOpen(false);

    setSelectedOrganisation(null);

    setErrorMessage("");
  };

  // -------------------------------------------------------
  // Update Organisation Form
  // -------------------------------------------------------

  const updateForm = (
    field: keyof UpdateOrganisation,
    value: string | number | boolean
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  // -------------------------------------------------------
  // Update Admin Form
  // -------------------------------------------------------

  const updateAdmin = (
    field: keyof CreateAdmin,
    value: string | boolean
  ) => {
    setAdmin((current) => ({
      ...current,
      [field]: value,
    }));
  };

  // -------------------------------------------------------
  // Validation
  // -------------------------------------------------------

  const validateForm = () => {
    setErrorMessage("");

    if (!form.name.trim()) {
      setErrorMessage(
        "Organisation name is required."
      );
      return false;
    }

    if (!form.orgContact.trim()) {
      setErrorMessage(
        "Organisation contact is required."
      );
      return false;
    }

    if (!form.orgContactEmail.trim()) {
      setErrorMessage(
        "Organisation contact email is required."
      );
      return false;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(
        form.orgContactEmail.trim()
      )
    ) {
      setErrorMessage(
        "Please enter a valid organisation contact email."
      );
      return false;
    }

    if (!form.orgContactPhone.trim()) {
      setErrorMessage(
        "Organisation contact phone is required."
      );
      return false;
    }

    if (!form.industryId) {
      setErrorMessage(
        "Please select an industry."
      );
      return false;
    }

    if (!form.address1.trim()) {
      setErrorMessage(
        "Address is required."
      );
      return false;
    }

    if (!form.city.trim()) {
      setErrorMessage(
        "City is required."
      );
      return false;
    }

    if (!form.state.trim()) {
      setErrorMessage(
        "State is required."
      );
      return false;
    }

    if (!form.country.trim()) {
      setErrorMessage(
        "Country is required."
      );
      return false;
    }

    if (!form.zipcode.trim()) {
      setErrorMessage(
        "Zipcode is required."
      );
      return false;
    }

    // Admin validation only during creation
    if (modalMode === "create") {
      if (!admin.firstName.trim()) {
        setErrorMessage(
          "Admin first name is required."
        );
        return false;
      }

      if (!admin.lastName.trim()) {
        setErrorMessage(
          "Admin last name is required."
        );
        return false;
      }

      if (!admin.email.trim()) {
        setErrorMessage(
          "Admin email is required."
        );
        return false;
      }

      if (
        !emailRegex.test(
          admin.email.trim()
        )
      ) {
        setErrorMessage(
          "Please enter a valid admin email."
        );
        return false;
      }

      if (!admin.password) {
        setErrorMessage(
          "Admin password is required."
        );
        return false;
      }

      if (admin.password.length < 8) {
        setErrorMessage(
          "Admin password must be at least 8 characters."
        );
        return false;
      }
    }

    return true;
  };

  // -------------------------------------------------------
  // Create
  // -------------------------------------------------------

  const handleCreate = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setErrorMessage("");

      const payload: CreateOrganisation = {
        name:
          form.name.trim(),

        orgContact:
          form.orgContact.trim(),

        orgContactEmail:
          form.orgContactEmail.trim(),

        orgContactPhone:
          form.orgContactPhone.trim(),

        industryId:
          form.industryId,

        description:
          form.description.trim(),

        address1:
          form.address1.trim(),

        address2:
          form.address2.trim(),

        city:
          form.city.trim(),

        state:
          form.state.trim(),

        country:
          form.country.trim(),

        zipcode:
          form.zipcode.trim(),

        admin: {
          firstName:
            admin.firstName.trim(),

          lastName:
            admin.lastName.trim(),

          email:
            admin.email.trim(),

          password:
            admin.password,

          notify:
            admin.notify,
        },
      };

      const createdOrganisation =
        await createOrganisation(
          payload
        );

      setOrganisations(
        (current) => [
          ...current,
          createdOrganisation,
        ]
      );

      setModalOpen(false);

      setSelectedOrganisation(
        null
      );

      setErrorMessage("");

      setAdmin({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        notify: true,
      });
    } catch (error: any) {
      console.error(
        "Error creating organisation:",
        error
      );

      if (
        error?.response?.status === 401 ||
        error?.response?.status === 403
      ) {
        handleUnauthorized();
        return;
      }

      setErrorMessage(
        error?.response?.data?.message ||
          "Failed to create organisation."
      );
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------------------------------
  // Update
  // -------------------------------------------------------

  const handleUpdate = async () => {
    if (!selectedOrganisation) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setErrorMessage("");

      const payload: UpdateOrganisation = {
        name:
          form.name.trim(),

        orgContact:
          form.orgContact.trim(),

        orgContactEmail:
          form.orgContactEmail.trim(),

        orgContactPhone:
          form.orgContactPhone.trim(),

        industryId:
          form.industryId,

        description:
          form.description.trim(),

        address1:
          form.address1.trim(),

        address2:
          form.address2.trim(),

        city:
          form.city.trim(),

        state:
          form.state.trim(),

        country:
          form.country.trim(),

        zipcode:
          form.zipcode.trim(),

        active:
          form.active,
      };

      const updatedOrganisation =
        await updateOrganisation(
          selectedOrganisation.id,
          payload
        );

      setOrganisations(
        (current) =>
          current.map(
            (organisation) =>
              organisation.id ===
              selectedOrganisation.id
                ? updatedOrganisation
                : organisation
          )
      );

      setModalOpen(false);

      setSelectedOrganisation(
        null
      );

      setErrorMessage("");
    } catch (error: any) {
      console.error(
        "Error updating organisation:",
        error
      );

      if (
        error?.response?.status === 401 ||
        error?.response?.status === 403
      ) {
        handleUnauthorized();
        return;
      }

      setErrorMessage(
        error?.response?.data?.message ||
          "Failed to update organisation."
      );
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------------------------------
  // Render
  // -------------------------------------------------------

  return (
    <div className="app-container">

      <Header user={user} />

      <main className="main-content">

        <div className="page-header">

          <div>
            <h1>
              Organisations
            </h1>

            <p>
              Manage your organisations
            </p>
          </div>

          {isSuperAdmin && (
            <button
              type="button"
              className="add-button"
              onClick={
                openCreateModal
              }
            >
              + Add Organisation
            </button>
          )}

        </div>


        {errorMessage &&
          !modalOpen && (
            <div className="page-error">
              {errorMessage}
            </div>
          )}


        <OrganisationFilters
          search={search}
          industryFilter={
            industryFilter
          }
          statusFilter={
            statusFilter
          }
          industries={industries}
          onSearchChange={
            setSearch
          }
          onIndustryChange={
            setIndustryFilter
          }
          onStatusChange={
            setStatusFilter
          }
        />


        <OrganisationTable
          organisations={
            filteredOrganisations
          }
          loading={loading}
          onView={
            openEditModal
          }
        />

      </main>


      {modalOpen && (
        <OrganisationModal
          mode={modalMode}

          selectedOrganisation={
            selectedOrganisation
          }

          form={form}

          admin={admin}

          industries={industries}

          saving={saving}

          errorMessage={
            errorMessage
          }

          onClose={
            closeModal
          }

          onChange={
            updateForm
          }

          onAdminChange={
            updateAdmin
          }

          onCreate={
            handleCreate
          }

          onUpdate={
            handleUpdate
          }
        />
      )}

    </div>
  );
}

