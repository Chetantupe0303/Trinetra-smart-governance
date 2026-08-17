import React, { useState } from "react";
import API from "../services/apiService";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { IconSparkle } from "../components/icons/Icons";
import { TrinetraMark } from "./Login";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    setSubmitting(true);
    try {
      await API.post("/auth/register", { name, email, password });

      toast.success("Registration successful!");
      setName("");
      setEmail("");
      setPassword("");

      setTimeout(() => navigate("/"), 1200);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-ivory">
      {/* Left: Brand panel */}
      <div className="hidden lg:flex relative overflow-hidden bg-indigo-900 items-center justify-center px-14">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -bottom-24 -left-24 w-[420px] h-[420px] rounded-full bg-saffron/20 blur-[110px] animate-float" />
          <div
            className="absolute top-0 right-0 w-[380px] h-[380px] rounded-full bg-indigo-brand/40 blur-[110px] animate-float"
            style={{ animationDelay: "1.5s" }}
          />
          <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid2" width="42" height="42" patternUnits="userSpaceOnUse">
                <path d="M 42 0 L 0 0 0 42" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid2)" />
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
            Report it once.
            <br />
            <span className="text-saffron">Watch it get fixed.</span>
          </h1>
          <p className="text-indigo-200 mt-5 text-[15px] leading-relaxed">
            Join thousands of citizens making their neighborhoods better —
            every report tracked from submission to resolution.
          </p>

          <div className="mt-10 space-y-3 stagger-children">
            {[
              "AI auto-classifies your issue instantly",
              "Routed directly to the right department",
              "Track status in real time, end to end",
            ].map((line) => (
              <div key={line} className="flex items-center gap-3 text-indigo-100 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-saffron flex-shrink-0" />
                {line}
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
              Create your account
            </h2>
            <p className="text-slate-500 text-sm mt-1.5">
              Start reporting issues in your neighborhood
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Name
              </label>
              <input
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-indigo-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-saffron/60 focus:border-saffron transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
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
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-indigo-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-saffron/60 focus:border-saffron transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="group relative w-full overflow-hidden bg-indigo-brand hover:bg-indigo-700 disabled:opacity-70 text-white py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-brand/20 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <IconSparkle className="w-4 h-4" />
              {submitting ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8">
            Already have an account?{" "}
            <Link to="/" className="text-indigo-brand font-semibold hover:text-saffron-600 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
