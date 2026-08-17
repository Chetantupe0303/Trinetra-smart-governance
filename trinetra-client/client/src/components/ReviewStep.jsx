import React from "react";
import { useNavigate } from "react-router-dom";
import { IconCheck, IconClock, IconMessage, IconPin, IconInfo, IconRocket } from "./icons/Icons";

function ReviewStep({
  description,
  priority,
  location,
  prevStep,
  handleSubmit,
  loading,
}) {
  const getPriorityStyle = (p) => {
    switch (p?.toLowerCase()) {
      case "high":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200/60",
          ring: "ring-red-100",
          dot: "bg-red-500",
        };
      case "medium":
        return {
          bg: "bg-saffron-50",
          text: "text-saffron-700",
          border: "border-saffron-200/60",
          ring: "ring-saffron-100",
          dot: "bg-saffron-500",
        };
      case "low":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200/60",
          ring: "ring-emerald-100",
          dot: "bg-emerald-500",
        };
      default:
        return {
          bg: "bg-slate-50",
          text: "text-slate-700",
          border: "border-slate-200/60",
          ring: "ring-slate-100",
          dot: "bg-slate-400",
        };
    }
  };

  const priorityStyle = getPriorityStyle(priority);
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Step Counter Badge */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200/60 shadow-sm">
          <div className="w-5 h-5 rounded-full bg-indigo-brand flex items-center justify-center shadow-sm">
            <span className="text-[10px] font-bold text-white">3</span>
          </div>
          <p className="text-xs font-bold text-indigo-700 tracking-wide">
            Step 3 of 3 — Final Review
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <IconCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-indigo-900 tracking-tight">
            Review & Submit
          </h2>
        </div>
        <p className="text-slate-500 text-sm sm:text-base font-medium leading-relaxed max-w-lg">
          Almost done! Please review all the information below before submitting
          your complaint.
        </p>
      </div>

      {/* Review Card */}
      <div className="relative bg-white/80 backdrop-blur-xl border border-indigo-100/70 rounded-[1.5rem] p-6 sm:p-8 shadow-lg shadow-indigo-100/40 overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-saffron-100/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative space-y-5">
          {/* Section Title */}
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-brand flex items-center justify-center shadow-lg shadow-indigo-brand/20">
              <IconMessage className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              Complaint Summary
            </h3>
          </div>

          {/* Priority */}
          <div className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-100/80 hover:border-indigo-200/60 hover:shadow-md transition-all duration-300 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-saffron-50 border border-saffron-200/60 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <IconClock className="w-4 h-4 text-saffron-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  Priority
                </p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">
                  Urgency Level
                </p>
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${priorityStyle.bg} ${priorityStyle.border} border shadow-sm ring-2 ${priorityStyle.ring}`}
            >
              <span className={`w-2 h-2 rounded-full ${priorityStyle.dot}`} />
              <span className={`text-sm font-bold ${priorityStyle.text}`}>
                {priority || "Not set"}
              </span>
            </span>
          </div>

          {/* Description */}
          <div className="group p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-100/80 hover:border-indigo-200/60 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200/60 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <IconMessage className="w-4 h-4 text-indigo-brand" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  Description
                </p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">
                  Issue Details
                </p>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-xl p-4 shadow-inner">
              <p className="text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                {description || "No description provided"}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="group p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-100/80 hover:border-indigo-200/60 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <IconPin className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  Location
                </p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">
                  Issue Address
                </p>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-xl p-4 shadow-inner">
              <div className="flex items-start gap-2.5">
                <IconPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-700 font-medium leading-relaxed">
                  {location || "No location selected"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Notice */}
      <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-indigo-50 border border-indigo-200/50 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 border border-indigo-200/60 flex items-center justify-center flex-shrink-0 shadow-sm">
            <IconInfo className="w-4 h-4 text-indigo-brand" />
          </div>
          <div>
            <p className="text-xs font-bold text-indigo-800 mb-1">
              Before You Submit
            </p>
            <p className="text-xs text-indigo-700/80 font-medium leading-relaxed">
              Once submitted, your complaint will be reviewed by the municipal
              authorities. You'll receive updates on the progress through your
              dashboard. Make sure all details are accurate.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4 mt-10 pt-6 border-t border-slate-100">
        <button
          onClick={prevStep}
          className="group flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-xl font-semibold text-slate-500 bg-slate-50 hover:bg-slate-100 hover:text-slate-700 border border-slate-200/60 transition-all duration-300 hover:shadow-md text-sm"
        >
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Edit
        </button>

        <button
          disabled={loading}
          onClick={async () => {
            const ok = await handleSubmit();
            if (ok) navigate("/dashboard");
          }}
          className="group relative flex items-center justify-center gap-2.5 px-8 sm:px-10 py-3.5 rounded-xl font-bold text-sm
                     bg-indigo-brand hover:bg-indigo-700
                     disabled:opacity-60 disabled:cursor-not-allowed
                     text-white shadow-xl shadow-indigo-brand/25
                     hover:shadow-2xl hover:shadow-indigo-brand/30
                     hover:-translate-y-0.5 active:translate-y-0
                     transition-all duration-300 ring-1 ring-white/20 overflow-hidden"
        >
          {/* Button Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>

          <div className="relative flex items-center gap-2.5">
            {loading ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            ) : (
              <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                <IconRocket className="w-4 h-4 text-white" />
              </div>
            )}
            {loading ? "Submitting..." : "Submit Complaint"}
            {!loading && (
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            )}
          </div>
        </button>
      </div>
    </div>
  );
}

export default ReviewStep;
