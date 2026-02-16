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

  // Calculate category distribution for municipal services
  const categoryStats = complaints.reduce((acc, complaint) => {
    const category = complaint.category || "Other";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  // Calculate average resolution time (mock data for now)
  const avgResolutionTime = resolved > 0 ? "3.5 days" : "N/A";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h1 className="text-5xl font-bold text-slate-900">
                Citizen Dashboard
              </h1>
            </div>
            <p className="text-slate-600 text-lg">
              Track and manage your municipal service complaints
            </p>
          </div>

          <Link to="/submit" className="mt-6 lg:mt-0">
            <button className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden">
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Report New Issue
              </span>
            </button>
          </Link>
        </div>

        {/* Main Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          {/* Total Complaints Card */}
          <div className="group relative bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-indigo-100 text-xs font-semibold uppercase tracking-wider">
                  Total Issues
                </p>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <p className="text-4xl font-bold text-white mb-1">{total}</p>
              <p className="text-indigo-100 text-xs">All reported issues</p>
            </div>
          </div>

          {/* Pending Card */}
          <div className="group relative bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-amber-100 text-xs font-semibold uppercase tracking-wider">
                  In Progress
                </p>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-4xl font-bold text-white mb-1">{pending}</p>
              <p className="text-amber-100 text-xs">Under review</p>
            </div>
          </div>

          {/* Resolved Card */}
          <div className="group relative bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-emerald-100 text-xs font-semibold uppercase tracking-wider">
                  Resolved
                </p>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-4xl font-bold text-white mb-1">{resolved}</p>
              <p className="text-emerald-100 text-xs">Successfully closed</p>
            </div>
          </div>

          {/* Resolution Time Card */}
          <div className="group relative bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-purple-100 text-xs font-semibold uppercase tracking-wider">
                  Avg. Resolution
                </p>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <p className="text-4xl font-bold text-white mb-1">{avgResolutionTime}</p>
              <p className="text-purple-100 text-xs">Response time</p>
            </div>
          </div>

        </div>

        {/* Municipal Services Category Breakdown */}
        {complaints.length > 0 && Object.keys(categoryStats).length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8 border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">
                Municipal Service Categories
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(categoryStats).map(([category, count]) => {
                const icons = {
                  "Waste Management": "🗑️",
                  "Water Supply": "💧",
                  "Road Damage": "🛣️",
                  "Street Lights": "💡",
                  "Sanitation": "🧹",
                  "Other": "📋"
                };
                
                const colors = {
                  "Waste Management": "from-green-500 to-emerald-600",
                  "Water Supply": "from-blue-500 to-cyan-600",
                  "Road Damage": "from-orange-500 to-red-600",
                  "Street Lights": "from-yellow-500 to-amber-600",
                  "Sanitation": "from-purple-500 to-pink-600",
                  "Other": "from-slate-500 to-gray-600"
                };

                return (
                  <div key={category} className={`bg-gradient-to-br ${colors[category] || colors["Other"]} rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl">{icons[category] || icons["Other"]}</span>
                      <span className="text-3xl font-bold">{count}</span>
                    </div>
                    <p className="text-sm font-semibold opacity-90">{category}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Service Efficiency Insights */}
        {complaints.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800">Resolution Rate</h3>
              </div>
              <p className="text-3xl font-bold text-indigo-600 mb-1">
                {total > 0 ? Math.round((resolved / total) * 100) : 0}%
              </p>
              <p className="text-sm text-slate-500">Issues successfully resolved</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800">Service Efficiency</h3>
              </div>
              <p className="text-3xl font-bold text-emerald-600 mb-1">
                {pending > 0 ? "Good" : "Excellent"}
              </p>
              <p className="text-sm text-slate-500">Department performance</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800">Citizen Trust</h3>
              </div>
              <p className="text-3xl font-bold text-purple-600 mb-1">
                {resolved > pending ? "High" : "Growing"}
              </p>
              <p className="text-sm text-slate-500">Transparency & accountability</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {complaints.length === 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-16 text-center border border-slate-200">
            <div className="inline-block p-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-6">
              <svg className="w-16 h-16 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              No issues reported yet
            </h3>
            <p className="text-slate-500 mb-6">
              Help improve your city by reporting municipal service issues
            </p>
            <Link to="/submit">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Report Your First Issue
              </button>
            </Link>
          </div>
        )}

        {/* Complaint List */}
        {complaints.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Your Reported Issues
                </h2>
              </div>
              <span className="text-sm text-slate-500 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
                {complaints.length} {complaints.length === 1 ? 'issue' : 'issues'}
              </span>
            </div>
            <div className="space-y-5">
              {complaints.map((c) => (
                <ComplaintCard key={c._id} complaint={c} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;