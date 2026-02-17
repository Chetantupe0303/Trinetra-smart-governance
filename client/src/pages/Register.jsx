import React from "react";
import { useState } from "react";
import API from "../services/apiService";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
      });

      alert("Registration successful");
      navigate("/");
    } catch (error) {
      alert("Registration failed");
    }
  };

return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 px-6">

    <div className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-10">

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight">
          Create Account
        </h2>
        <p className="text-slate-300 text-sm mt-2">
          Join Smart Urban Governance today
        </p>
      </div>

      <div className="space-y-6">

        <input
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          className="w-full px-5 py-3 rounded-xl bg-white/20 text-white placeholder-slate-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300"
        />

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-5 py-3 rounded-xl bg-white/20 text-white placeholder-slate-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300"
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-5 py-3 rounded-xl bg-white/20 text-white placeholder-slate-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300"
        />

        <button
          onClick={handleRegister}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 active:scale-95 text-white py-3 rounded-xl font-semibold shadow-lg transition-all duration-300"
        >
          Register
        </button>
      </div>

      <p className="text-center text-sm text-slate-300 mt-8">
        Already have an account?{" "}
        <span
          onClick={() => navigate("/")}
          className="text-indigo-400 hover:text-indigo-300 cursor-pointer font-medium transition"
        >
          Login
        </span>
      </p>

    </div>

  </div>
);

}

export default Register;
