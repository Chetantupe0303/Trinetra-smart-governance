import React from "react";
import { useEffect, useState } from "react";
import API from "../services/apiService";

// 👇 Styles outside component
const cardStyle = {
  padding: "15px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  minWidth: "120px",
  textAlign: "center",
  fontWeight: "bold",
  backgroundColor: "#f5f5f5"
};

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints");
      setComplaints(res.data);
    } catch (error) {
      console.error("Error fetching complaints", error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await API.patch(`/complaints/${id}/status`, {
        status: newStatus,
      });

      fetchComplaints(); // refresh list
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  // 👇 Analytics calculations
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === "Pending").length;
  const inProgress = complaints.filter(c => c.status === "In Progress").length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;
  const highPriority = complaints.filter(c => c.priority === "High").length;

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
    <div className="max-w-7xl mx-auto px-6">

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-800 tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-slate-500 mt-2">
          Monitor and manage all user complaints
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-14">

        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 hover:shadow-xl transition">
          <p className="text-sm text-slate-500 mb-2">Total</p>
          <p className="text-3xl font-bold text-indigo-600">{total}</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 hover:shadow-xl transition">
          <p className="text-sm text-slate-500 mb-2">Pending</p>
          <p className="text-3xl font-bold text-amber-500">{pending}</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 hover:shadow-xl transition">
          <p className="text-sm text-slate-500 mb-2">In Progress</p>
          <p className="text-3xl font-bold text-blue-500">{inProgress}</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 hover:shadow-xl transition">
          <p className="text-sm text-slate-500 mb-2">Resolved</p>
          <p className="text-3xl font-bold text-green-600">{resolved}</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 hover:shadow-xl transition">
          <p className="text-sm text-slate-500 mb-2">High Priority</p>
          <p className="text-3xl font-bold text-red-600">{highPriority}</p>
        </div>

      </div>

      {/* Complaint List */}
      <div className="space-y-8">
        {complaints.map((c) => (
          <div
            key={c._id}
            className="bg-white rounded-3xl p-8 shadow-md border border-slate-100 hover:shadow-xl transition"
          >

            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">

              <div className="space-y-2">
                <p className="text-slate-600">
                  <span className="font-semibold text-slate-800">User:</span>{" "}
                  {c.user?.name}
                </p>

                <p className="text-slate-600">
                  <span className="font-semibold text-slate-800">Description:</span>{" "}
                  {c.description}
                </p>

                <p className="text-slate-600">
                  <span className="font-semibold text-slate-800">Category:</span>{" "}
                  {c.category}
                </p>

                <div className="flex items-center gap-4 mt-2">

                  <span className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${c.priority === "High"
                      ? "bg-red-100 text-red-600"
                      : c.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-green-100 text-green-600"
                    }`}>
                    {c.priority}
                  </span>

                  <span className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${c.status === "Resolved"
                      ? "bg-green-100 text-green-600"
                      : c.status === "In Progress"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-amber-100 text-amber-600"
                    }`}>
                    {c.status}
                  </span>

                </div>
              </div>

              {/* Status Update Dropdown */}
              <div>
                <select
                  value={c.status}
                  onChange={(e) => updateStatus(c._id, e.target.value)}
                  className="px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  </div>
);

}

export default AdminDashboard;
