import { Navigate, Outlet } from "react-router-dom";

const RoleProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    if (role === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    }
    if (role === "doctor") {
      return <Navigate to="/doctor-dashboard" replace />;
    }
    if (role === "patient") {
      return <Navigate to="/log-home" replace />;
    }
  }

  return <Outlet />;
};

export default RoleProtectedRoute;
