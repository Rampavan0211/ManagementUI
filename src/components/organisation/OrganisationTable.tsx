
import type { Organisation } from "../../types/organisation";

interface Props {
  organisations: Organisation[];
  loading: boolean;
  onView: (organisation: Organisation) => void;
}

const OrganisationTable = ({
  organisations,
  loading,
  onView,
}: Props) => {
  if (loading) {
    return (
      <div className="table-container">
        <div className="loading">
          Loading organisations...
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      {organisations.length === 0 ? (
        <div className="empty">
          No organisations found.
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Industry</th>
              <th>City</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {organisations.map((organisation) => (
              <tr
                key={organisation.id}
                onClick={() =>
                  onView(organisation)
                }
                style={{
                  cursor: "pointer",
                }}
              >
                <td>{organisation.name}</td>

                <td>
                  {organisation.industryName}
                </td>

                <td>{organisation.city}</td>

                <td>
                  <span
                    className={
                      organisation.active
                        ? "status active"
                        : "status inactive"
                    }
                  >
                    {organisation.active
                      ? "Active"
                      : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrganisationTable;

