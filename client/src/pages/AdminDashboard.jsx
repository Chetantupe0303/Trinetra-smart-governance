import React from "react";
import { useEffect, useState } from "react";
import API from "../services/apiService";

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

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
      fetchComplaints();
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const inProgress = complaints.filter(
    (c) => c.status === "In Progress"
  ).length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;
  const highPriority = complaints.filter(
    (c) => c.priority === "High"
  ).length;

  const filteredComplaints =
    filterStatus === "All"
      ? complaints
      : complaints.filter((c) => c.status === filterStatus);

  const categoryIcons = {
    Road: "🛣️",
    Water: "💧",
    Electricity: "⚡",
    Garbage: "🗑️",
    Sewage: "🚰",
    "Street Lights": "💡",
    Parks: "🌳",
    Traffic: "🚦",
    Sanitation: "🧹",
    Other: "📋",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Accent Bar */}
      <div className="h-1 bg-gradient-to-r from-slate-800 via-blue-900 to-slate-800"></div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Admin Panel
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900 text-white uppercase tracking-wider">
                Admin
              </span>
            </div>
            <p className="text-sm text-slate-500 ml-11">
              Complaint management and status control
            </p>
          </div>

          {/* Quick Metrics - Header */}
          <div className="flex items-center gap-6 text-sm ml-11 lg:ml-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-slate-500">Resolution Rate</span>
              <span className="font-bold text-slate-900">
                {total > 0 ? Math.round((resolved / total) * 100) : 0}%
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="text-slate-500">Active</span>
              <span className="font-bold text-slate-900">
                {pending + inProgress}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {[
            {
              label: "Total Complaints",
              value: total,
              color: "text-slate-900",
              border: "border-slate-200",
              dot: "bg-slate-400",
            },
            {
              label: "Pending Review",
              value: pending,
              color: "text-amber-600",
              border: "border-amber-200",
              dot: "bg-amber-400",
            },
            {
              label: "In Progress",
              value: inProgress,
              color: "text-blue-600",
              border: "border-blue-200",
              dot: "bg-blue-400",
            },
            {
              label: "Resolved",
              value: resolved,
              color: "text-emerald-600",
              border: "border-emerald-200",
              dot: "bg-emerald-400",
            },
            {
              label: "High Priority",
              value: highPriority,
              color: "text-red-600",
              border: "border-red-200",
              dot: "bg-red-400",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`bg-white rounded-xl p-4 border ${stat.border} hover:shadow-md transition-shadow duration-200 ${i === 4 ? "col-span-2 sm:col-span-1" : ""}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-1.5 h-1.5 rounded-full ${stat.dot}`}></span>
                <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
              </div>
              <p className={`text-2xl font-bold ${stat.color} tracking-tight`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900">
              Complaints
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              ({filteredComplaints.length})
            </span>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
            {["All", "Pending", "In Progress", "Resolved"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                  filterStatus === status
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Complaints Table / List */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          {/* Table Header - Desktop */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <div className="col-span-3">Citizen</div>
            <div className="col-span-3">Description</div>
            <div className="col-span-1">Category</div>
            <div className="col-span-1">Priority</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-3">Actions</div>
          </div>

          {/* Empty State */}
          {filteredComplaints.length === 0 && (
            <div className="py-16 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-slate-100 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <p className="text-sm font-semibold text-slate-700 mb-1">
                No complaints found
              </p>
              <p className="text-xs text-slate-400">
                {filterStatus === "All"
                  ? "When citizens submit complaints, they will appear here."
                  : `No complaints with "${filterStatus}" status.`}
              </p>
            </div>
          )}

          {/* Complaint Rows */}
          <div className="divide-y divide-slate-100">
            {filteredComplaints.map((c) => (
              <div
                key={c._id}
                className="group relative hover:bg-slate-50/50 transition-colors duration-150"
              >
                {/* Priority Indicator Line */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-[3px] transition-opacity duration-200 ${
                    c.priority === "High"
                      ? "bg-red-500"
                      : c.priority === "Medium"
                      ? "bg-amber-400"
                      : "bg-slate-300"
                  } ${c.priority === "High" ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                ></div>

                {/* Desktop Layout */}
                <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-4 items-center">
                  {/* Citizen */}
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                      {c.user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {c.user?.name || "Unknown"}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {c.location || "No location"}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="col-span-3">
                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {c.description}
                    </p>
                  </div>

                  {/* Category */}
                  <div className="col-span-1">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600">
                      <span className="text-sm">
                        {categoryIcons[c.category] || "📋"}
                      </span>
                      {c.category}
                    </span>
                  </div>

                  {/* Priority */}
                  <div className="col-span-1">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                        c.priority === "High"
                          ? "bg-red-50 text-red-700"
                          : c.priority === "Medium"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {c.priority}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-1">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold ${
                        c.status === "Resolved"
                          ? "bg-emerald-50 text-emerald-700"
                          : c.status === "In Progress"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          c.status === "Resolved"
                            ? "bg-emerald-500"
                            : c.status === "In Progress"
                            ? "bg-blue-500"
                            : "bg-amber-500"
                        }`}
                      ></span>
                      {c.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-3 flex items-center gap-2">
                    <select
                      value={c.status}
                      onChange={(e) =>
                        updateStatus(c._id, e.target.value)
                      }
                      className="appearance-none px-3 py-1.5 pr-8 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white
                        focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900
                        hover:border-slate-300 cursor-pointer transition-colors duration-200"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>

                    <button
                      onClick={() => updateStatus(c._id, "In Progress")}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 ${
                        c.status === "In Progress"
                          ? "bg-blue-600 text-white"
                          : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600"
                      }`}
                    >
                      → Progress
                    </button>

                    <button
                      onClick={() => updateStatus(c._id, "Resolved")}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 ${
                        c.status === "Resolved"
                          ? "bg-emerald-600 text-white"
                          : "bg-white text-slate-600 border border-slate-200 hover:border-emerald-300 hover:text-emerald-600"
                      }`}
                    >
                      ✓ Resolve
                    </button>
                  </div>
                </div>

                {/* Mobile / Tablet Layout */}
                <div className="lg:hidden px-4 py-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                        {c.user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {c.user?.name || "Unknown"}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-slate-400">
                            {categoryIcons[c.category] || "📋"} {c.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          c.priority === "High"
                            ? "bg-red-50 text-red-700"
                            : c.priority === "Medium"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {c.priority}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                          c.status === "Resolved"
                            ? "bg-emerald-50 text-emerald-700"
                            : c.status === "In Progress"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        <span
                          className={`w-1 h-1 rounded-full ${
                            c.status === "Resolved"
                              ? "bg-emerald-500"
                              : c.status === "In Progress"
                              ? "bg-blue-500"
                              : "bg-amber-500"
                          }`}
                        ></span>
                        {c.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {c.description}
                  </p>

                  {c.location && (
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {c.location}
                    </p>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <select
                      value={c.status}
                      onChange={(e) =>
                        updateStatus(c._id, e.target.value)
                      }
                      className="flex-1 appearance-none px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white
                        focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors duration-200"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>

                    <button
                      onClick={() => updateStatus(c._id, "In Progress")}
                      className={`px-3 py-2 rounded-lg text-[11px] font-semibold transition-all duration-200 ${
                        c.status === "In Progress"
                          ? "bg-blue-600 text-white"
                          : "bg-white text-slate-500 border border-slate-200"
                      }`}
                    >
                      →
                    </button>

                    <button
                      onClick={() => updateStatus(c._id, "Resolved")}
                      className={`px-3 py-2 rounded-lg text-[11px] font-semibold transition-all duration-200 ${
                        c.status === "Resolved"
                          ? "bg-emerald-600 text-white"
                          : "bg-white text-slate-500 border border-slate-200"
                      }`}
                    >
                      ✓
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Stats Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 px-1">
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>
              Showing {filteredComplaints.length} of {total} complaints
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              High: {highPriority}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Pending: {pending}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              Active: {inProgress}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Done: {resolved}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;