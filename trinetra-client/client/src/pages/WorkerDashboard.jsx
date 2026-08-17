import React, { useEffect, useState } from "react";
import API from "../services/apiService";
import { categoryIconMap, IconOther, IconWrench, IconCamera, IconCheck, IconClock, IconPin } from "../components/icons/Icons";

const STATUS_COLUMNS = [
  { key: "Assigned", label: "Assigned", accent: "saffron" },
  { key: "In Progress", label: "In Progress", accent: "indigo" },
  { key: "Completed", label: "Completed", accent: "emerald" },
];

function WorkerDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Assigned");
  const [busyId, setBusyId] = useState(null);

  async function fetchComplaints() {
    try {
      const res = await API.get("/worker/tasks", { withCredentials: true });
      setComplaints(res.data);
    } catch (error) {
      console.error("Error fetching worker tasks", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleFileChange = (id, e) => {
    const file = e.target.files?.[0] || null;
    setSelectedFiles((prev) => ({ ...prev, [id]: file }));
  };

  const handleStartWork = async (id) => {
    setBusyId(id);
    try {
      const res = await API.post("/worker/start", { complaintId: id }, { withCredentials: true });
      setStatusMessage(res.data?.message || "Status updated to In Progress. Work started successfully.");
      await fetchComplaints();
      setActiveTab("In Progress");
    } catch (error) {
      console.error(error);
      setStatusMessage("Failed to start work. Please try again.");
    } finally {
      setBusyId(null);
    }
  };

  const markCompleted = async (id) => {
    const selectedFile = selectedFiles[id];
    if (!selectedFile) {
      setStatusMessage("Please upload a completion photo before completing.");
      return;
    }
    setBusyId(id);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const uploadRes = await API.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const imageUrl = uploadRes.data.url;

      await API.post(
        `/worker/complete`,
        { complaintId: id, proofImageUrl: imageUrl },
        { withCredentials: true }
      );

      setSelectedFiles((prev) => ({ ...prev, [id]: null }));
      await fetchComplaints();
      setActiveTab("Completed");
    } catch (error) {
      console.error(error);
      setStatusMessage("Upload failed. Please try again.");
    } finally {
      setBusyId(null);
    }
  };

  const counts = STATUS_COLUMNS.reduce((acc, col) => {
    acc[col.key] = complaints.filter((c) => c.status === col.key).length;
    return acc;
  }, {});

  const visibleComplaints = complaints.filter((c) => c.status === activeTab);

  return (
    <div className="min-h-screen bg-ivory">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center gap-3 mb-6 animate-fade-up">
          <div className="w-11 h-11 rounded-xl bg-indigo-900 flex items-center justify-center flex-shrink-0">
            <IconWrench className="w-5 h-5 text-saffron" />
          </div>
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-indigo-900">Field Task Queue</h1>
            <p className="text-slate-400 text-sm">Your assigned civic repair tasks</p>
          </div>
        </div>

        {statusMessage && (
          <div className="mb-5 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800 animate-scale-in flex items-center justify-between">
            {statusMessage}
            <button onClick={() => setStatusMessage("")} className="text-indigo-400 hover:text-indigo-700 ml-3">✕</button>
          </div>
        )}

        {/* Status Tabs */}
        <div className="flex items-center bg-white rounded-xl p-1 border border-slate-200/60 shadow-sm mb-6 animate-fade-up">
          {STATUS_COLUMNS.map((col) => {
            const active = activeTab === col.key;
            return (
              <button
                key={col.key}
                onClick={() => setActiveTab(col.key)}
                className={`flex-1 relative px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  active ? "bg-indigo-brand text-white shadow-sm" : "text-slate-500 hover:text-indigo-900"
                }`}
              >
                {col.label}
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {counts[col.key] || 0}
                </span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="skeleton h-40 rounded-2xl" />
            ))}
          </div>
        ) : visibleComplaints.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm py-16 px-8 text-center animate-fade-up">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-50 flex items-center justify-center animate-float">
              <IconCheck className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="font-display font-bold text-indigo-900 mb-1">Nothing here</h3>
            <p className="text-sm text-slate-400">No tasks in "{activeTab}" right now.</p>
          </div>
        ) : (
          <div className="space-y-4 stagger-children">
            {visibleComplaints.map((c) => {
              const CategoryIcon = categoryIconMap[c.category] || IconOther;
              const isBusy = busyId === c._id;
              return (
                <div
                  key={c._id}
                  className="bg-white rounded-2xl border border-slate-200/70 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                          <CategoryIcon className="w-5 h-5 text-indigo-brand" />
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-indigo-900">{c.category}</h3>
                          <span className="inline-flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                            <IconPin className="w-3 h-3" />
                            {c.location?.address || c.location || "Location unavailable"}
                          </span>
                        </div>
                      </div>
                      <StatusPill status={c.status} />
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed">{c.description}</p>
                  </div>

                  {c.status === "Assigned" && (
                    <div className="px-5 pb-5">
                      <button
                        onClick={() => handleStartWork(c._id)}
                        disabled={isBusy}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-brand hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl shadow-sm transition-all duration-200 active:scale-[0.98]"
                      >
                        <IconWrench className="w-4 h-4" />
                        {isBusy ? "Starting…" : "Start Work"}
                      </button>
                    </div>
                  )}

                  {c.status === "In Progress" && (
                    <div className="px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/50">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2.5 mt-3">
                        Completion Proof
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2.5">
                        <label className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-white border border-dashed border-slate-300 rounded-xl text-sm text-slate-500 cursor-pointer hover:border-indigo-brand hover:text-indigo-brand transition-colors duration-200">
                          <IconCamera className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">
                            {selectedFiles[c._id]?.name || "Upload photo of completed work"}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(c._id, e)}
                            className="hidden"
                          />
                        </label>
                        <button
                          onClick={() => markCompleted(c._id)}
                          disabled={isBusy}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl shadow-sm transition-all duration-200 active:scale-[0.98]"
                        >
                          <IconCheck className="w-4 h-4" />
                          {isBusy ? "Uploading…" : "Complete"}
                        </button>
                      </div>
                    </div>
                  )}

                  {(c.proofImageUrl || c.completionImage) && (
                    <div className="px-5 pb-5">
                      <img
                        src={c.proofImageUrl || c.completionImage}
                        alt="Completed work proof"
                        className="w-full max-w-xs rounded-xl border border-slate-200 animate-scale-in"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const config = {
    Assigned: { bg: "bg-saffron-50", text: "text-saffron-700", border: "border-saffron-200", dot: "bg-saffron" },
    "In Progress": { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", dot: "bg-indigo-brand" },
    Completed: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  }[status] || { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200", dot: "bg-slate-400" };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border flex-shrink-0 ${config.bg} ${config.text} ${config.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${status === "In Progress" ? "animate-pulse" : ""}`} />
      {status}
    </span>
  );
}

export default WorkerDashboard;
