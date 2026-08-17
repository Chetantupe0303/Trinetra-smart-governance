import React from "react";
import { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { TrinetraMark } from "../pages/Login";
import {
  IconGear,
  IconWrench,
  IconSupervisor,
  IconChart,
  IconNote,
  IconKey,
  IconSparkle,
  IconLogout,
} from "./icons/Icons";

function NavLink({ to, icon: Icon, children, accent = "indigo", currentPath }) {
  const active = currentPath === to;
  const accentClasses =
    accent === "saffron"
      ? "hover:bg-saffron-50 hover:text-saffron-700 hover:border-saffron-200/80"
      : "hover:bg-indigo-50 hover:text-indigo-brand hover:border-indigo-200/80";
  return (
    <Link
      to={to}
      className={`group flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 border ${
        active
          ? "bg-indigo-50 text-indigo-brand border-indigo-200/80"
          : `text-slate-600 border-transparent ${accentClasses}`
      }`}
    >
      <Icon className="w-4 h-4" />
      {children}
    </Link>
  );
}

function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isSupervisorRole = (role) =>
    typeof role === "string" && (role === "supervisor" || role.startsWith("supervisor_"));

  const handleLogout = () => {
    toast.success("Logged out successfully!");
    setTimeout(() => {
      localStorage.removeItem("token");
      setUser(null);
      navigate("/");
    }, 800);
  };

  const roleLabel = user?.role === "admin"
    ? "Administrator"
    : user?.role === "worker"
    ? "Field Worker"
    : isSupervisorRole(user?.role)
    ? "Supervisor"
    : "Citizen";

  return (
    <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-2xl border-b border-slate-100/80 shadow-[0_1px_20px_rgba(30,27,75,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-[4.5rem]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="w-10 h-10 bg-indigo-900 rounded-xl flex items-center justify-center shadow-md shadow-indigo-900/20 group-hover:shadow-lg group-hover:shadow-indigo-900/25 transition-all duration-300 group-hover:scale-105">
                <TrinetraMark className="w-6 h-6 text-saffron" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-saffron rounded-full border-2 border-white animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-lg font-bold text-indigo-900 tracking-tight">
                Trinetra
              </span>
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] -mt-0.5">
                Civic Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1.5">
            {user && (
              <>
                {user.role === "admin" ? (
                  <NavLink to="/admin" icon={IconGear} currentPath={location.pathname}>Admin Panel</NavLink>
                ) : user.role === "worker" ? (
                  <NavLink to="/worker" icon={IconWrench} currentPath={location.pathname}>Worker Panel</NavLink>
                ) : isSupervisorRole(user.role) ? (
                  <NavLink to="/supervisor" icon={IconSupervisor} currentPath={location.pathname}>Supervisor Panel</NavLink>
                ) : (
                  <>
                    <NavLink to="/dashboard" icon={IconChart} currentPath={location.pathname}>Dashboard</NavLink>
                    <NavLink to="/submit" icon={IconNote} accent="saffron" currentPath={location.pathname}>Report Issue</NavLink>
                  </>
                )}

                <div className="mx-2 h-8 w-px bg-slate-200/80" />

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <div className="w-7 h-7 rounded-lg bg-indigo-brand flex items-center justify-center shadow-sm">
                    <span className="text-xs font-bold text-white font-display">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-600 hidden lg:block max-w-[80px] truncate">
                    {user?.name || "User"}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="group flex items-center gap-2 ml-1 px-4 py-2.5 border border-slate-200/80 text-sm font-semibold text-slate-500 rounded-xl hover:bg-red-50 hover:border-red-200/80 hover:text-red-600 transition-all duration-300"
                >
                  <IconLogout className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  Logout
                </button>
              </>
            )}

            {!user && (
              <>
                <Link
                  to="/"
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-600 rounded-xl hover:bg-slate-50 hover:text-indigo-900 transition-all duration-300 border border-transparent hover:border-slate-200/60"
                >
                  <IconKey className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="group flex items-center gap-2 px-5 py-2.5 bg-indigo-brand text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-brand/20 hover:bg-indigo-700 hover:shadow-lg transition-all duration-300"
                >
                  <IconSparkle className="w-4 h-4" />
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center hover:bg-slate-100 transition-colors duration-300"
          >
            <svg
              className={`w-5 h-5 text-indigo-900 transition-transform duration-300 ${mobileOpen ? "rotate-90" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            mobileOpen ? "max-h-[500px] opacity-100 pb-5" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pt-3 space-y-1.5 border-t border-slate-100/80">
            {user && (
              <>
                <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-slate-50 border border-slate-200/60">
                  <div className="w-9 h-9 rounded-xl bg-indigo-brand flex items-center justify-center shadow-md">
                    <span className="text-sm font-bold text-white font-display">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-indigo-900">{user?.name || "User"}</p>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      {roleLabel}
                    </p>
                  </div>
                </div>

                {user.role === "admin" ? (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 rounded-xl hover:bg-indigo-50 hover:text-indigo-brand transition-all duration-300"
                  >
                    <IconGear className="w-4 h-4" /> Admin Panel
                  </Link>
                ) : user.role === "worker" ? (
                  <Link
                    to="/worker"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 rounded-xl hover:bg-indigo-50 hover:text-indigo-brand transition-all duration-300"
                  >
                    <IconWrench className="w-4 h-4" /> Worker Panel
                  </Link>
                ) : isSupervisorRole(user.role) ? (
                  <Link
                    to="/supervisor"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 rounded-xl hover:bg-indigo-50 hover:text-indigo-brand transition-all duration-300"
                  >
                    <IconSupervisor className="w-4 h-4" /> Supervisor Panel
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 rounded-xl hover:bg-indigo-50 hover:text-indigo-brand transition-all duration-300"
                    >
                      <IconChart className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link
                      to="/submit"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 rounded-xl hover:bg-saffron-50 hover:text-saffron-700 transition-all duration-300"
                    >
                      <IconNote className="w-4 h-4" /> Report Issue
                    </Link>
                  </>
                )}

                <div className="pt-2">
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-red-200/80 text-sm font-bold text-red-600 rounded-xl bg-red-50/50 hover:bg-red-50 transition-all duration-300"
                  >
                    <IconLogout className="w-4 h-4" /> Logout
                  </button>
                </div>
              </>
            )}

            {!user && (
              <>
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 rounded-xl hover:bg-slate-50 hover:text-indigo-900 transition-all duration-300"
                >
                  <IconKey className="w-4 h-4" /> Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-brand text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-brand/20"
                >
                  <IconSparkle className="w-4 h-4" /> Get Started
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
