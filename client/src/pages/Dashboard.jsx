import React from "react";
import { useEffect, useState } from "react";
import API from "../services/apiService";
import ComplaintCard from "../components/ComplaintCard";
import { Link } from "react-router-dom";

function Dashboard() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints");
      setComplaints(res.data);
    } catch (error) {
      console.error("Error fetching complaints");
    }
  };

  const total = complaints.length;
  const pending = complaints.filter(c => c.status === "Pending").length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;

 return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
    <div className="max-w-7xl mx-auto px-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 mt-2">
            Manage and track your complaints efficiently
          </p>
        </div>

        <Link to="/submit">
          <button className="mt-6 md:mt-0 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white px-6 py-3 rounded-xl shadow-lg transition duration-300 font-medium">
            + Submit New Complaint
          </button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">

        <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition duration-300 border border-slate-100">
          <p className="text-slate-500 text-sm uppercase tracking-wide mb-3">
            Total Complaints
          </p>
          <p className="text-4xl font-bold text-indigo-600">{total}</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition duration-300 border border-slate-100">
          <p className="text-slate-500 text-sm uppercase tracking-wide mb-3">
            Pending
          </p>
          <p className="text-4xl font-bold text-amber-500">{pending}</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition duration-300 border border-slate-100">
          <p className="text-slate-500 text-sm uppercase tracking-wide mb-3">
            Resolved
          </p>
          <p className="text-4xl font-bold text-emerald-500">{resolved}</p>
        </div>

      </div>

      {/* Empty State */}
      {complaints.length === 0 && (
        <div className="bg-white rounded-3xl shadow-md p-16 text-center border border-slate-100">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-slate-600 text-lg">
            No complaints yet.
          </p>
          <p className="text-slate-400 text-sm mt-2">
            Click “Submit New Complaint” to get started.
          </p>
        </div>
      )}

      {/* Complaint List */}
      <div className="space-y-8">
        {complaints.map((c) => (
          <ComplaintCard key={c._id} complaint={c} />
        ))}
      </div>

    </div>
  </div>
);


}


export default Dashboard;
