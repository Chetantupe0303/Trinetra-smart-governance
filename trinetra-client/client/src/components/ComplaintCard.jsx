import React, { useEffect, useState } from "react";
import API from "../services/apiService";
import { categoryIconMap, IconOther, IconClock } from "./icons/Icons";

const SERVER_BASE = "http://127.0.0.1:4000";
const FEEDBACK_OPTIONS = ["Good", "Average", "Poor", "Worst"];

function ComplaintCard({ complaint }) {
  const [feedbackRating, setFeedbackRating] = useState(
    complaint.feedback?.rating || ""
  );
  const [feedbackError, setFeedbackError] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    setFeedbackRating(complaint.feedback?.rating || "");
  }, [complaint.feedback?.rating, complaint._id]);

  const canSubmitFeedback = ["Completed", "Approved"].includes(
    complaint.status
  );

  const handleFeedback = async (rating) => {
    if (!canSubmitFeedback || submittingFeedback || rating === feedbackRating) {
      return;
    }

    try {
      setSubmittingFeedback(true);
      setFeedbackError("");
      await API.post(`/complaints/${complaint._id}/feedback`, { rating });
      setFeedbackRating(rating);
    } catch (error) {
      const message =
        error.response?.data?.message || "Unable to submit feedback.";
      setFeedbackError(message);
    } finally {
      setSubmittingFeedback(false);
    }
  };
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
    "High Priority": { 
      bg: "bg-red-50", 
      text: "text-red-700", 
      border: "border-red-200" 
    },
    "Medium Priority": {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
    },
    "Low Priority": {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
    },
  };

  const status = statusConfig[complaint.status] || statusConfig["Pending"];
  const priority = priorityConfig[complaint.priority] || null;

  const CategoryIcon = categoryIconMap[complaint.category] || IconOther;

  const userName =
    complaint.name ||
    complaint.userName ||
    complaint.user?.name ||
    "Anonymous User";

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-lg hover:shadow-indigo-100/40 hover:-translate-y-0.5 transition-all duration-300">
      {/* Top Section — User Info + Status */}
      <div className="px-6 pt-5 pb-4">
        <div className="flex items-center justify-between mb-4">
          {/* User */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-brand flex items-center justify-center text-white text-sm font-bold font-display shadow-md shadow-indigo-200/50">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-indigo-900">{userName}</p>
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
        <h3 className="font-display text-lg font-bold text-indigo-900 mb-2">
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
              <CategoryIcon className="w-3.5 h-3.5 text-indigo-brand" />
              {complaint.category}
            </span>
          )}

          {/* Priority */}
          {priority && complaint.priority && (
            <span
              className={`inline-flex items-center px-3 py-1.5 rounded-xl border text-xs font-bold ${priority.bg} ${priority.text} ${priority.border}`}
            >
              {complaint.priority}
            </span>
          )}

          {/* Time */}
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-medium ml-auto">
            <IconClock className="w-4 h-4 text-slate-300" />
            {new Date(complaint.createdAt).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
        </div>
      </div>

      {(canSubmitFeedback || feedbackRating) && (
        <div className="px-6 py-4 border-t border-slate-100 bg-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
              Resolution Feedback
            </p>
            {feedbackRating && !canSubmitFeedback && (
              <span className="text-xs font-semibold text-slate-600">
                {feedbackRating}
              </span>
            )}
          </div>

          {canSubmitFeedback ? (
            <div className="flex flex-wrap gap-2">
              {FEEDBACK_OPTIONS.map((option) => {
                const isActive = feedbackRating === option;
                return (
                  <button
                    key={option}
                    type="button"
                    disabled={submittingFeedback}
                    onClick={() => handleFeedback(option)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-saffron/50 ${
                      isActive
                        ? "bg-indigo-brand text-white border-indigo-brand scale-105"
                        : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
                    } ${submittingFeedback ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          ) : feedbackRating ? (
            <span className="inline-flex px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
              {feedbackRating}
            </span>
          ) : (
            <p className="text-xs text-slate-400">
              Feedback can be shared once the task is completed.
            </p>
          )}

          {feedbackError && (
            <p className="text-xs text-red-500 mt-2">{feedbackError}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ComplaintCard;