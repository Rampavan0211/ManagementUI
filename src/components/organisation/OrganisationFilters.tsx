import type { Industry } from "../types/organisation";

interface Props {
  search: string;

  industryFilter: string;

  statusFilter: string;

  industries: Industry[];

  onSearchChange: (
    value: string
  ) => void;

  onIndustryChange: (
    value: string
  ) => void;

  onStatusChange: (
    value: string
  ) => void;
}

const OrganisationFilters = ({
  search,
  industryFilter,
  statusFilter,
  industries,
  onSearchChange,
  onIndustryChange,
  onStatusChange,
}: Props) => {
  return (
    <div className="filters">
      <input
        type="text"
        placeholder="Search organisations..."
        value={search}
        onChange={(event) =>
          onSearchChange(
            event.target.value
          )
        }
      />

      <select
        value={industryFilter}
        onChange={(event) =>
          onIndustryChange(
            event.target.value
          )
        }
      >
        <option value="All">
          All Industries
        </option>

        {industries.map(
          (industry) => (
            <option
              key={industry.id}
              value={industry.name}
            >
              {industry.name}
            </option>
          )
        )}
      </select>

      <select
        value={statusFilter}
        onChange={(event) =>
          onStatusChange(
            event.target.value
          )
        }
      >
        <option value="All">
          All Status
        </option>

        <option value="Active">
          Active
        </option>

        <option value="Inactive">
          Inactive
        </option>
      </select>
    </div>
  );
};

export default OrganisationFilters;