
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes
} from "react-router-dom";

import Login from "./pages/auth/Login";
import ActivateAccount from "./pages/auth/ActivateAccount";

import OrganisationPage from "./pages/organisation/OrganisationPage";
import ProjectPage from "./pages/project/ProjectPage";
import EmployeePage from "./pages/employee/EmployeeManagementPage";

import ManagerDashboard from "./pages/manager/ManagerDashboard";
import EmployeeDashboard from "./pages/dashboard/EmployeeDashboard";

import EmployeeProjects from "./components/employee/EmployeeProjects";

import DailyWorkPage from "./pages/daily-work/DailyWorkPage";

import ProtectedRoute from "./components/common/ProtectedRoute";
import HomeRedirect from "./components/common/HomeRedirect";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =====================================
            PUBLIC ROUTES
        ====================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/activate-account"
          element={<ActivateAccount />}
        />


        {/* =====================================
            PROTECTED ROUTES
        ====================================== */}

        <Route element={<ProtectedRoute />}>

          {/* ================================
              HOME
              Role-based redirect
          ================================ */}

          <Route
            path="/"
            element={<HomeRedirect />}
          />


          {/* ================================
              SUPER ADMIN
              Home → Organisation Management
          ================================ */}

          <Route
            path="/organisations"
            element={<OrganisationPage />}
          />


          {/* ================================
              ADMIN
              Projects → Project Management
          ================================ */}

          <Route
            path="/projects"
            element={<ProjectPage />}
          />


          {/* ================================
              ADMIN
              Employees → Employee Management
          ================================ */}

          <Route
            path="/employees"
            element={<EmployeePage />}
          />


          {/* ================================
              ADMIN / MANAGER / EMPLOYEE
              Common Home
          ================================ */}

          <Route
            path="/employee-dashboard"
            element={<EmployeeDashboard />}
          />


          {/* ================================
              MANAGER
              Projects → Manager Dashboard
          ================================ */}

          <Route
            path="/manager-dashboard"
            element={<ManagerDashboard />}
          />


          {/* ================================
              EMPLOYEE
              Projects → Assigned Projects
          ================================ */}

          <Route
            path="/employee-projects"
            element={<EmployeeProjects />}
          />


          {/* ================================
              MANAGER / EMPLOYEE
              Daily Work
          ================================ */}

          <Route
            path="/daily-work"
            element={<DailyWorkPage />}
          />

        </Route>


        {/* =====================================
            UNKNOWN ROUTES
        ====================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;

