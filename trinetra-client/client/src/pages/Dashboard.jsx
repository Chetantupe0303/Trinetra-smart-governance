import React from "react";
import { useEffect, useState, useContext } from "react";
import API from "../services/apiService";
import { AuthContext } from "../context/AuthContext";
import ComplaintCard from "../components/ComplaintCard";
import { Link, Navigate } from "react-router-dom";
import { IconPlus, IconNote, IconClock, IconCheck, IconChart, categoryIconMap, IconOther } from "../components/icons/Icons";

function Dashboard() {
  const { user } = useContext(AuthContext);

  const [complaints, setComplaints] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
    fetchUserProfile();
  }, []);

  if (user && user.role === "admin") {
    return <Navigate to="/admin" />;
  }

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints");
      setComplaints(res.data);
    } catch {
      console.error("Error fetching complaints");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const res = await API.get("/auth/me");
      setUserName(res.data.name);
    } catch {
      try {
        const stored = JSON.parse(localStorage.getItem("user"));
        if (stored?.name) setUserName(stored.name);
      } catch {
        console.error("Error getting user info");
      }
    }
  };

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;

  const categoryStats = complaints.reduce((acc, complaint) => {
    const category = complaint.category || "Other";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const filteredComplaints =
    activeFilter === "all"
      ? complaints
      : activeFilter === "pending"
      ? complaints.filter((c) => c.status === "Pending")
      : complaints.filter((c) => c.status === "Resolved");

  const resolvedPercent = total > 0 ? Math.round((resolved / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-ivory">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-up">
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-indigo-900">
              Welcome, {userName}
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Overview of all civic complaints and their status
            </p>
          </div>
          <Link to="/submit" className="flex-shrink-0">
            <button className="group inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-brand hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-md shadow-indigo-brand/20 transition-all duration-200 active:scale-[0.98]">
              <IconPlus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
              New Report
            </button>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
          <StatCard
            label="Total Reports"
            value={total}
            sub="All complaints"
            icon={<IconNote className="w-4 h-4 text-indigo-500" />}
            iconBg="bg-indigo-50"
          />
          <StatCard
            label="Pending"
            value={pending}
            sub="Awaiting action"
            icon={<IconClock className="w-4 h-4 text-saffron-600" />}
            iconBg="bg-saffron-50"
          />
          <StatCard
            label="Resolved"
            value={resolved}
            sub="Completed"
            icon={<IconCheck className="w-4 h-4 text-emerald-500" />}
            iconBg="bg-emerald-50"
          />
          <div className="bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-500">Resolution Rate</span>
              <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                <IconChart className="w-4 h-4 text-violet-500" />
              </div>
            </div>
            <p className="font-display text-3xl font-bold text-indigo-900">{resolvedPercent}%</p>
            <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${resolvedPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 xl:col-span-3 space-y-5">
            {complaints.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-5 animate-fade-up">
                <h3 className="text-sm font-semibold text-slate-700 mb-5">Resolution Progress</h3>
                <div className="flex justify-center mb-5">
                  <div className="relative w-28 h-28">
                    <svg className="w-28 h-28 -rotate-90" viewBox="0 0 112 112">
                      <circle cx="56" cy="56" r="48" fill="none" stroke="#F2F1EE" strokeWidth="8" />
                      <circle
                        cx="56"
                        cy="56"
                        r="48"
                        fill="none"
                        stroke="#3730A3"
                        strokeWidth="8"
                        strokeDasharray={`${(resolvedPercent / 100) * 301.6} 301.6`}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-display text-2xl font-bold text-indigo-900">
                        {resolvedPercent}%
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">resolved</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-indigo-brand" />
                      <span className="text-sm text-slate-600">Resolved</span>
                    </div>
                    <span className="text-sm font-semibold text-indigo-900">{resolved}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-saffron" />
                      <span className="text-sm text-slate-600">Pending</span>
                    </div>
                    <span className="text-sm font-semibold text-indigo-900">{pending}</span>
                  </div>
                </div>
              </div>
            )}

            {complaints.length > 0 && Object.keys(categoryStats).length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-5 animate-fade-up" style={{ animationDelay: "80ms" }}>
                <h3 className="text-sm font-semibold text-slate-700 mb-4">Categories</h3>
                <div className="space-y-2">
                  {Object.entries(categoryStats).map(([category, count]) => {
                    const Icon = categoryIconMap[category] || IconOther;
                    const percent = total > 0 ? Math.round((count / total) * 100) : 0;
                    return (
                      <div key={category} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-indigo-50/60 transition-colors duration-200">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-3.5 h-3.5 text-indigo-brand" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-slate-700 truncate">{category}</span>
                            <span className="text-xs font-semibold text-slate-500 ml-2">{count}</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-400 rounded-full transition-all duration-700"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="relative overflow-hidden bg-indigo-900 rounded-xl p-5 text-white animate-fade-up" style={{ animationDelay: "160ms" }}>
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-saffron/20 blur-2xl" />
              <h3 className="relative text-sm font-semibold mb-3">Quick Tips</h3>
              <div className="relative space-y-2.5">
                {[
                  "Attach photos for faster resolution",
                  "Add exact location details",
                  "Describe the issue clearly",
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-indigo-100 leading-relaxed">
                    <span className="w-1 h-1 rounded-full bg-saffron mt-1.5 flex-shrink-0" />
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 xl:col-span-9">
            {loading ? (
              <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-5 grid grid-cols-1 xl:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="skeleton h-40 rounded-xl" />
                ))}
              </div>
            ) : complaints.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm py-20 px-8 text-center animate-fade-up">
                <div className="max-w-sm mx-auto">
                  <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-indigo-50 flex items-center justify-center animate-float">
                    <IconNote className="w-7 h-7 text-indigo-400" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-indigo-900 mb-2">No reports yet</h3>
                  <p className="text-slate-400 mb-8 text-sm leading-relaxed">
                    Be the first to make a difference — report a civic issue in your area.
                  </p>
                  <Link to="/submit">
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-brand hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-all duration-200 active:scale-[0.98]">
                      <IconPlus className="w-4 h-4" />
                      Submit First Report
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden animate-fade-up">
                <div className="px-5 py-4 border-b border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <h2 className="text-base font-semibold text-indigo-900">
                      All Complaints
                      <span className="text-slate-400 font-normal ml-2 text-sm">({filteredComplaints.length})</span>
                    </h2>
                    <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                      {[
                        { key: "all", label: "All" },
                        { key: "pending", label: "Pending" },
                        { key: "resolved", label: "Resolved" },
                      ].map((f) => (
                        <button
                          key={f.key}
                          onClick={() => setActiveFilter(f.key)}
                          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                            activeFilter === f.key
                              ? "bg-white text-indigo-900 shadow-sm"
                              : "text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {filteredComplaints.length === 0 ? (
                  <div className="py-16 text-center">
                    <IconNote className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                    <p className="text-sm text-slate-400 font-medium">
                      No {activeFilter !== "all" ? activeFilter : ""} complaints found
                    </p>
                  </div>
                ) : (
                  <div className="p-5 grid grid-cols-1 xl:grid-cols-2 gap-4 max-h-[700px] overflow-y-auto stagger-children">
                    {filteredComplaints.map((c) => (
                      <ComplaintCard key={c._id} complaint={c} />
                    ))}
                  </div>
                )}

                {filteredComplaints.length > 0 && (
                  <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-xs text-slate-400">
                      {filteredComplaints.length} complaint{filteredComplaints.length !== 1 ? "s" : ""} · Synced with authorities
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                      <span className="text-xs text-emerald-600 font-medium">Live</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, icon, iconBg }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>{icon}</div>
      </div>
      <p className="font-display text-3xl font-bold text-indigo-900 animate-count-up">{value}</p>
      <p className="text-xs text-slate-400 mt-1">{sub}</p>
    </div>
  );
}

export default Dashboard;
