
import { Navigate } from "react-router-dom";

const HomeRedirect = () => {
  const userString = localStorage.getItem("user");

  if (!userString) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userString);

    const role = user.role?.toLowerCase();

    if (role === "superadmin") {
      return (
        <Navigate
          to="/organisations"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/employee-dashboard"
        replace
      />
    );
  } catch {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }
};

export default HomeRedirect;

