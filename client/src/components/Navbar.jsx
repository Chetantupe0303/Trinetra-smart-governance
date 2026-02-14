import React from "react";
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
  <nav className="sticky top-0 z-50 bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 shadow-lg">
    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

      {/* Logo */}
      <Link
        to="/"
        className="text-white text-2xl font-extrabold tracking-tight hover:scale-105 transition-transform duration-300"
      >
        Trinetra
      </Link>

      {/* Navigation */}
      <div className="flex items-center space-x-10 text-white font-medium">

        {user && (
          <>
            {user.role === "admin" ? (
              <Link
                to="/admin"
                className="relative group text-white"
              >
                <span className="group-hover:text-yellow-300 transition duration-300">
                  Admin Panel
                </span>
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="relative group text-white"
                >
                  <span className="group-hover:text-yellow-300 transition duration-300">
                    Dashboard
                  </span>
                  <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
                </Link>

                <Link
                  to="/submit"
                  className="relative group text-white"
                >
                  <span className="group-hover:text-yellow-300 transition duration-300">
                    Submit Complaint
                  </span>
                  <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </>
            )}

            <button
              onClick={handleLogout}
              className="ml-4 bg-red-500 hover:bg-red-600 hover:shadow-lg hover:scale-105 active:scale-95 px-5 py-2 rounded-xl transition-all duration-300 font-semibold"
            >
              Logout
            </button>
          </>
        )}

        {!user && (
          <>
            <Link
              to="/"
              className="relative group text-white"
            >
              <span className="group-hover:text-yellow-300 transition duration-300">
                Login
              </span>
              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link
              to="/register"
              className="relative group text-white"
            >
              <span className="group-hover:text-yellow-300 transition duration-300">
                Register
              </span>
              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </>
        )}

      </div>
    </div>
  </nav>
);



}

export default Navbar;
