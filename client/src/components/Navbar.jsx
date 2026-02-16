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
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 backdrop-blur-xl border-b border-white/10 shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">

          {/* Logo Section */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 border border-white/30">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
              </svg>
            </div>
            <span className="text-2xl font-bold text-white group-hover:text-indigo-100 transition-colors duration-300">
              Trinetra
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">

            {user && (
              <>
                {user.role === "admin" ? (
                  <Link
                    to="/admin"
                    className="px-5 py-2.5 text-white font-medium rounded-lg hover:bg-white/20 backdrop-blur-sm transition-all duration-300 border border-transparent hover:border-white/30"
                  >
                    Admin Panel
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/dashboard"
                      className="px-5 py-2.5 text-white font-medium rounded-lg hover:bg-white/20 backdrop-blur-sm transition-all duration-300 border border-transparent hover:border-white/30"
                    >
                      Dashboard
                    </Link>

                    <Link
                      to="/submit"
                      className="px-5 py-2.5 text-white font-medium rounded-lg hover:bg-white/20 backdrop-blur-sm transition-all duration-300 border border-transparent hover:border-white/30"
                    >
                      Submit Complaint
                    </Link>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="ml-2 px-6 py-2.5 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-red-500 hover:shadow-lg transition-all duration-300 border border-white/30 hover:border-red-400"
                >
                  Logout
                </button>
              </>
            )}

            {!user && (
              <>
                <Link
                  to="/"
                  className="px-5 py-2.5 text-white font-medium rounded-lg hover:bg-white/20 backdrop-blur-sm transition-all duration-300 border border-transparent hover:border-white/30"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/30 transition-all duration-300 border border-white/30 shadow-lg"
                >
                  Register
                </Link>
              </>
            )}

          </div>
        </div>
      </div>
    </nav>
  );

}

export default Navbar;
