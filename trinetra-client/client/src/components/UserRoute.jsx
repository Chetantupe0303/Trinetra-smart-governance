import React from "react";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function UserRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const isSupervisorRole =
    (role) => typeof role === "string" && (role === "supervisor" || role.startsWith("supervisor_"));

  if (loading) return null;

  if (!user) {
    return <Navigate to="/" />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin" />;
  }

  if (user.role === "worker") {
    return <Navigate to="/worker" />;
  }

  if (isSupervisorRole(user.role)) {
    return <Navigate to="/supervisor" />;
  }

  return children;
}

export default UserRoute;
