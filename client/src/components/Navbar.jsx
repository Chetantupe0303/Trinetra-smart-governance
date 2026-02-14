import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <nav style={{ padding: "10px", background: "#eee" }}>
      {user && (
        <>
          {user.role === "admin" ? (
            <Link to="/admin">Admin Panel</Link>
          ) : (
            <>
              <Link to="/dashboard">Dashboard</Link>{" | "}
              <Link to="/submit">Submit Complaint</Link>
            </>
          )}

          {" | "}
          <button onClick={handleLogout}>Logout</button>
        </>
      )}

      {!user && (
        <>
          <Link to="/">Login</Link>{" | "}
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
