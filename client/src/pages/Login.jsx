import React from "react";
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API from "../services/apiService";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      setUser(decoded);

      if (decoded.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      alert("Invalid credentials");
    }
  };

 return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 px-6">

    <div className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-10">

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight">
          Welcome Back
        </h2>
        <p className="text-slate-300 text-sm mt-2">
          Sign in to continue to Smart Urban Governance
        </p>
      </div>

      <div className="space-y-6">

        <input
          type="email"
          placeholder="Enter Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-5 py-3 rounded-xl bg-white/20 text-white placeholder-slate-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300"
        />

        <input
          type="password"
          placeholder="Enter Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-5 py-3 rounded-xl bg-white/20 text-white placeholder-slate-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 active:scale-95 text-white py-3 rounded-xl font-semibold shadow-lg transition-all duration-300"
        >
          Login
        </button>
      </div>

      <p className="text-center text-sm text-slate-300 mt-8">
        Don’t have an account?{" "}
        <Link
          to="/register"
          className="text-indigo-400 hover:text-indigo-300 font-medium transition"
        >
          Register
        </Link>
      </p>

    </div>
  </div>
);


}

export default Login;
