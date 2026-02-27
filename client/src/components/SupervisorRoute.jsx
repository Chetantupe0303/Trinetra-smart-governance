import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function SupervisorRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const isSupervisorRole =
    (role) => typeof role === "string" && (role === "supervisor" || role.startsWith("supervisor_"));

  if (loading) return null;
  if (!user) return <Navigate to="/" />;
  if (!isSupervisorRole(user.role)) return <Navigate to="/dashboard" />;

  return children;
}

export default SupervisorRoute;
