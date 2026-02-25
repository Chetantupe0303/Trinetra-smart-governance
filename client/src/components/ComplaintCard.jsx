import React from "react";

const SERVER_BASE = "http://127.0.0.1:4000";

function ComplaintCard({ complaint }) {
  const statusConfig = {
    Pending: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      dot: "bg-amber-400",
    },
    Resolved: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
    },
    "In Progress": {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      dot: "bg-blue-400",
    },
  };

  const priorityConfig = {
    High: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
    Medium: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
    },
    Low: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
    },
  };

  const status = statusConfig[complaint.status] || statusConfig["Pending"];
  const priority = priorityConfig[complaint.priority] || null;

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

  const icon = categoryIcons[complaint.category] || "📋";

  const userName =
    complaint.name ||
    complaint.userName ||
    complaint.user?.name ||
    "Anonymous User";

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-lg hover:shadow-indigo-100/40 transition-all duration-300">
      {/* Top Section — User Info + Status */}
      <div className="px-6 pt-5 pb-4">
        <div className="flex items-center justify-between mb-4">
          {/* User */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-indigo-200/50">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">{userName}</p>
              <p className="text-xs text-slate-400">
                {new Date(complaint.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${status.bg} ${status.text} ${status.border}`}
          >
            <span
              className={`w-2 h-2 rounded-full ${status.dot} ${
                complaint.status === "Pending" ? "animate-pulse" : ""
              }`}
            ></span>
            {complaint.status}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          {complaint.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed">
          {complaint.description}
        </p>
      </div>

      {/* Image */}
      {(complaint.image?.data || complaint.imageUrl) && (
        <div className="px-6 pb-4">
          <img
            src={
              complaint.image?.data
                ? complaint.image.data
                : complaint.imageUrl.startsWith("http")
                ? complaint.imageUrl
                : `${SERVER_BASE}${complaint.imageUrl}`
            }
            alt="Complaint"
            className="w-full h-52 object-cover rounded-xl border border-slate-100"
          />
        </div>
      )}

      {/* Bottom Section — Category + Priority + Date */}
      <div className="px-6 py-4 bg-slate-50/60 border-t border-slate-100">
        <div className="flex items-center flex-wrap gap-2">
          {/* Category */}
          {complaint.category && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700">
              <span className="text-sm">{icon}</span>
              {complaint.category}
            </span>
          )}

          {/* Priority */}
          {priority && complaint.priority && (
            <span
              className={`inline-flex items-center px-3 py-1.5 rounded-xl border text-xs font-bold ${priority.bg} ${priority.text} ${priority.border}`}
            >
              {complaint.priority} Priority
            </span>
          )}

          {/* Time */}
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-medium ml-auto">
            <svg
              className="w-4 h-4 text-slate-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {new Date(complaint.createdAt).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ComplaintCard;