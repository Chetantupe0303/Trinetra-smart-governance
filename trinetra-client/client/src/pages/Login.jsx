import React from "react";
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API from "../services/apiService";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { IconKey, IconEye } from "../components/icons/Icons";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const isSupervisorRole = (role) =>
    typeof role === "string" && (role === "supervisor" || role.startsWith("supervisor_"));

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await API.post(
        "/auth/login",
        { email, password },
        { withCredentials: true }
      );

      const token = res.data.token;
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      setUser(decoded);

      toast.success("Login successful!");
      setTimeout(() => {
        if (decoded.role === "admin") navigate("/admin");
        else if (isSupervisorRole(decoded.role)) navigate("/supervisor");
        else if (decoded.role === "worker") navigate("/worker");
        else navigate("/dashboard");
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-ivory">
      {/* Left: Brand panel */}
      <div className="hidden lg:flex relative overflow-hidden bg-indigo-900 items-center justify-center px-14">
        {/* Ambient decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-indigo-brand/40 blur-[110px] animate-float" />
          <div
            className="absolute bottom-0 right-0 w-[380px] h-[380px] rounded-full bg-saffron/20 blur-[110px] animate-float"
            style={{ animationDelay: "1.5s" }}
          />
          <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse">
                <path d="M 42 0 L 0 0 0 42" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-md animate-fade-up">
          <div className="flex items-center gap-3 mb-10">
            <TrinetraMark className="w-11 h-11 text-saffron animate-scale-in" />
            <div>
              <p className="font-display font-bold text-xl text-white tracking-tight">Trinetra</p>
              <p className="text-[11px] font-semibold text-indigo-200 uppercase tracking-[0.2em]">
                Civic Intelligence
              </p>
            </div>
          </div>

          <h1 className="font-display text-4xl xl:text-[2.75rem] font-bold text-white leading-[1.1] tracking-tight">
            Every civic issue,
            <br />
            <span className="text-saffron">seen and resolved.</span>
          </h1>
          <p className="text-indigo-200 mt-5 text-[15px] leading-relaxed">
            One connected system for citizens, field workers, supervisors,
            and administrators — routed automatically, resolved
            transparently.
          </p>

          <div className="mt-10 flex items-center gap-6 stagger-children">
            {[
              ["24/7", "Live monitoring"],
              ["AI", "Auto-routing"],
              ["4", "Role workflows"],
            ].map(([stat, label]) => (
              <div key={label}>
                <p className="font-display text-2xl font-bold text-white">{stat}</p>
                <p className="text-[11px] text-indigo-300 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form panel */}
      <div className="flex items-center justify-center px-6 py-16 relative">
        <div className="lg:hidden absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5">
          <TrinetraMark className="w-8 h-8 text-indigo-brand" />
          <span className="font-display font-bold text-lg text-indigo-900">Trinetra</span>
        </div>

        <div className="w-full max-w-sm animate-fade-up" style={{ animationDelay: "100ms" }}>
          <div className="mb-9">
            <h2 className="font-display text-[1.7rem] font-bold text-indigo-900">
              Welcome back
            </h2>
            <p className="text-slate-500 text-sm mt-1.5">
              Sign in to continue to your civic dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-indigo-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-saffron/60 focus:border-saffron transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 bg-white text-indigo-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-saffron/60 focus:border-saffron transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-brand transition-colors"
                  aria-label="Toggle password visibility"
                >
                  <IconEye className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="group relative w-full overflow-hidden bg-indigo-brand hover:bg-indigo-700 disabled:opacity-70 text-white py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-brand/20 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <IconKey className="w-4 h-4" />
              {submitting ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-brand font-semibold hover:text-saffron-600 transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function TrinetraMark({ className = "w-8 h-8" }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 4C11 4 4 12 4 20c0 8 7 16 16 16s16-8 16-16C36 12 29 4 20 4z"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.3"
      />
      <ellipse cx="20" cy="20" rx="15" ry="8" stroke="currentColor" strokeWidth="2" />
      <circle cx="20" cy="20" r="5.5" fill="currentColor" />
      <circle cx="20" cy="20" r="2" fill="#1E1B4B" />
    </svg>
  );
}

export default Login;
