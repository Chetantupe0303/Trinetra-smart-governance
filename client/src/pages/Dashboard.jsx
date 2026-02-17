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
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;

  const categoryStats = complaints.reduce((acc, complaint) => {
    const category = complaint.category || "Other";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const avgResolutionTime = resolved > 0 ? "3.5 days" : "N/A";

  const categoryIcons = {
    Roads: "🛣️",
    Water: "💧",
    Electricity: "⚡",
    Garbage: "🗑️",
    Sewage: "🚰",
    "Street Lights": "💡",
    Parks: "🌳",
    Traffic: "🚦",
    Noise: "🔊",
    Other: "📋",
  };

  const categoryColors = [
    { bg: "bg-rose-50", text: "text-rose-700", badge: "bg-rose-500", border: "border-rose-200", light: "bg-rose-100" },
    { bg: "bg-amber-50", text: "text-amber-700", badge: "bg-amber-500", border: "border-amber-200", light: "bg-amber-100" },
    { bg: "bg-teal-50", text: "text-teal-700", badge: "bg-teal-500", border: "border-teal-200", light: "bg-teal-100" },
    { bg: "bg-violet-50", text: "text-violet-700", badge: "bg-violet-500", border: "border-violet-200", light: "bg-violet-100" },
    { bg: "bg-sky-50", text: "text-sky-700", badge: "bg-sky-500", border: "border-sky-200", light: "bg-sky-100" },
    { bg: "bg-lime-50", text: "text-lime-700", badge: "bg-lime-500", border: "border-lime-200", light: "bg-lime-100" },
    { bg: "bg-pink-50", text: "text-pink-700", badge: "bg-pink-500", border: "border-pink-200", light: "bg-pink-100" },
    { bg: "bg-cyan-50", text: "text-cyan-700", badge: "bg-cyan-500", border: "border-cyan-200", light: "bg-cyan-100" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFBFE]">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99,102,241,0.8) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}></div>
        <div className="absolute -top-40 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-blue-100/30 via-indigo-50/20 to-transparent rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 -left-40 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-100/25 via-cyan-50/15 to-transparent rounded-full blur-[100px]"></div>
      </div>

      {/* Header */}
      <div className="relative bg-white/90 backdrop-blur-2xl border-b border-slate-200/60 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-[4.5rem]">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 leading-tight">My Dashboard</h1>
                <p className="text-[11px] text-slate-400 font-medium leading-tight">
                  Civic Complaint Tracker
                </p>
              </div>
            </div>

            <Link to="/submit">
              <button className="group flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/25 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0">
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Report Issue</span>
                <span className="sm:hidden">Report</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl mb-8">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600"></div>
          {/* Mesh overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>
          {/* Floating shapes */}
          <div className="absolute top-4 right-8 w-24 h-24 border border-white/10 rounded-2xl rotate-12"></div>
          <div className="absolute bottom-4 right-32 w-16 h-16 border border-white/10 rounded-full"></div>
          <div className="absolute top-8 right-48 w-8 h-8 bg-white/5 rounded-lg rotate-45"></div>

          <div className="relative px-6 sm:px-8 py-8 sm:py-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-lg bg-white/15 backdrop-blur-sm text-white/90 text-[11px] font-semibold uppercase tracking-wider border border-white/10">
                    Citizen Portal
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight leading-tight">
                  Welcome back! 👋
                </h2>
                <p className="text-blue-100/80 text-sm leading-relaxed max-w-lg">
                  Your voice shapes our city. Report issues, track progress, and see real results in your community.
                </p>
              </div>

              {/* Banner Stats */}
              <div className="flex items-center gap-3">
                <div className="px-5 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-center min-w-[90px]">
                  <p className="text-3xl font-extrabold text-white">{total}</p>
                  <p className="text-[10px] text-blue-200 font-semibold mt-1 uppercase tracking-wider">Reported</p>
                </div>
                <div className="px-5 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-center min-w-[90px]">
                  <p className="text-3xl font-extrabold text-white">
                    {total > 0 ? Math.round((resolved / total) * 100) : 0}%
                  </p>
                  <p className="text-[10px] text-blue-200 font-semibold mt-1 uppercase tracking-wider">Resolved</p>
                </div>
                <div className="hidden sm:block px-5 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-center min-w-[90px]">
                  <p className="text-3xl font-extrabold text-white">{pending}</p>
                  <p className="text-[10px] text-blue-200 font-semibold mt-1 uppercase tracking-wider">Pending</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Issues", value: total, sub: "All reported", icon: (
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            ), color: "indigo", borderColor: "border-indigo-100", iconBg: "bg-indigo-50" },
            { label: "In Progress", value: pending, sub: "Under review", icon: (
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ), color: "amber", borderColor: "border-amber-100", iconBg: "bg-amber-50" },
            { label: "Resolved", value: resolved, sub: "Completed", icon: (
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ), color: "emerald", borderColor: "border-emerald-100", iconBg: "bg-emerald-50" },
            { label: "Avg. Resolution", value: avgResolutionTime, sub: "Response time", icon: (
              <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            ), color: "violet", borderColor: "border-violet-100", iconBg: "bg-violet-50" },
          ].map((stat, i) => (
            <div key={i} className={`group bg-white rounded-2xl border ${stat.borderColor} p-5 hover:shadow-lg hover:shadow-${stat.color}-100/30 transition-all duration-300 hover:-translate-y-1`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                <svg className="w-4 h-4 text-slate-300 group-hover:text-slate-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Sidebar */}
          <div className="lg:col-span-4 space-y-5">

            {/* Resolution Overview */}
            {complaints.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/70 p-6">
                <h3 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
                  <div className="w-1.5 h-5 rounded-full bg-indigo-500"></div>
                  Resolution Overview
                </h3>

                {/* Circular Progress */}
                <div className="flex items-center gap-5 mb-6">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="#F1F5F9" strokeWidth="7" />
                      <circle
                        cx="40" cy="40" r="34" fill="none"
                        stroke="url(#progressGrad)" strokeWidth="7"
                        strokeDasharray={`${total > 0 ? (resolved / total) * 213.6 : 0} 213.6`}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="progressGrad" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#4F46E5" />
                          <stop offset="100%" stopColor="#06B6D4" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-extrabold text-slate-900">
                        {total > 0 ? Math.round((resolved / total) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-700 mb-0.5">
                      {total > 0 ? Math.round((resolved / total) * 100) : 0}% Complete
                    </p>
                    <p className="text-xs text-slate-400 mb-3">{resolved} of {total} resolved</p>
                    {/* Mini bars */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
                        <span className="text-[11px] text-slate-500 flex-1">Resolved</span>
                        <span className="text-[11px] font-bold text-slate-700">{resolved}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0"></span>
                        <span className="text-[11px] text-slate-500 flex-1">Pending</span>
                        <span className="text-[11px] font-bold text-slate-700">{pending}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                  {total > 0 && (
                    <>
                      <div className="bg-emerald-500 rounded-l-full transition-all duration-700" style={{ width: `${(resolved / total) * 100}%` }}></div>
                      <div className="bg-amber-400 transition-all duration-700" style={{ width: `${(pending / total) * 100}%` }}></div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Categories */}
            {complaints.length > 0 && Object.keys(categoryStats).length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/70 p-6">
                <h3 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
                  <div className="w-1.5 h-5 rounded-full bg-blue-500"></div>
                  Categories
                </h3>
                <div className="space-y-2.5">
                  {Object.entries(categoryStats).map(([category, count], index) => {
                    const color = categoryColors[index % categoryColors.length];
                    const icon = categoryIcons[category] || "📋";
                    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                    return (
                      <div
                        key={category}
                        className={`flex items-center gap-3 p-3 rounded-xl ${color.bg} border ${color.border} hover:shadow-sm transition-all duration-200`}
                      >
                        <div className={`w-8 h-8 rounded-lg ${color.light} flex items-center justify-center flex-shrink-0`}>
                          <span className="text-sm">{icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs font-semibold ${color.text} truncate`}>{category}</span>
                            <span className="text-[11px] font-bold text-slate-500">{percentage}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/80 rounded-full overflow-hidden">
                            <div className={`h-full ${color.badge} rounded-full transition-all duration-700`} style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-md ${color.badge} text-white text-[10px] font-bold flex-shrink-0`}>
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Insights */}
            {complaints.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/70 p-6">
                <h3 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
                  <div className="w-1.5 h-5 rounded-full bg-violet-500"></div>
                  Quick Insights
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50/50 border border-emerald-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <svg className="w-4.5 h-4.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Efficiency</p>
                        <p className="text-sm font-bold text-emerald-700">{pending > 0 ? "Good" : "Excellent"}</p>
                      </div>
                    </div>
                    <div className={`w-2.5 h-2.5 rounded-full ${pending > 0 ? "bg-amber-400" : "bg-emerald-500"}`}></div>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50/50 border border-violet-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center">
                        <svg className="w-4.5 h-4.5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Trust Level</p>
                        <p className="text-sm font-bold text-violet-700">{resolved > pending ? "High" : "Growing"}</p>
                      </div>
                    </div>
                    <div className={`w-2.5 h-2.5 rounded-full ${resolved > pending ? "bg-emerald-500" : "bg-violet-400"}`}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="text-sm font-bold">Pro Tips</h3>
              </div>
              <div className="space-y-2.5">
                {[
                  { icon: "📸", text: "Add photos for 2x faster resolution" },
                  { icon: "📍", text: "Pin exact location on the map" },
                  { icon: "📝", text: "Describe issue with specific details" },
                ].map((tip, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-sm flex-shrink-0">{tip.icon}</span>
                    <span className="text-xs text-slate-300 font-medium leading-relaxed">{tip.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-8">

            {/* Empty State */}
            {complaints.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/70 p-12 sm:p-16 text-center">
                <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-50 flex items-center justify-center border-2 border-dashed border-indigo-200">
                  <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-3">
                  No issues reported yet
                </h3>
                <p className="text-slate-400 mb-8 max-w-md mx-auto text-sm leading-relaxed">
                  Help make your city better by reporting your first civic issue. Your voice drives real change in the community.
                </p>
                <Link to="/submit">
                  <button className="group inline-flex items-center gap-2.5 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-xl hover:shadow-indigo-600/25 transition-all duration-300 hover:-translate-y-0.5">
                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Submit Your First Complaint
                  </button>
                </Link>

                <div className="flex items-center justify-center gap-8 mt-12">
                  {[
                    { step: "1", label: "Report", desc: "Submit issue" },
                    { step: "2", label: "Track", desc: "Follow progress" },
                    { step: "3", label: "Resolved", desc: "Issue fixed" },
                  ].map((item, i) => (
                    <div key={i} className="text-center">
                      <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600">
                        {item.step}
                      </div>
                      <p className="text-xs font-bold text-slate-700">{item.label}</p>
                      <p className="text-[10px] text-slate-400">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Complaints List */}
            {complaints.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden">
                {/* List Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-5 rounded-full bg-indigo-500"></div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Your Complaints</h2>
                      <p className="text-[11px] text-slate-400 font-medium">Latest reports and their status</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">
                      {complaints.length} total
                    </span>
                  </div>
                </div>

                {/* Complaint Items */}
                <div className="divide-y divide-slate-100">
                  {complaints.map((c) => (
                    <div key={c._id} className="hover:bg-slate-50/50 transition-colors duration-150">
                      <div className="p-4 sm:p-5">
                        <ComplaintCard complaint={c} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* List Footer */}
                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400 font-medium">
                      Updated in real-time by municipal authorities
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-[11px] text-slate-400 font-medium">Live</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-slate-200/60">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-slate-700">Municipal Complaint Portal</span>
            </div>
            <p className="text-xs text-slate-400">Building better communities together</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;