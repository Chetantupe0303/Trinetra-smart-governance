import React, { useEffect, useMemo, useState } from "react";
import API from "../services/apiService";
import MapView from "../components/MapView";
import { IconSupervisor, IconClock, IconWrench, IconCheck, IconNote } from "../components/icons/Icons";

const STATUS_OPTIONS = ["Submitted", "Assigned", "In Progress", "Completed"];

function SupervisorDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [selectedWorkerByComplaint, setSelectedWorkerByComplaint] = useState({});
  const [sendingEmailByComplaint, setSendingEmailByComplaint] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [complaintsRes, workersRes] = await Promise.all([
        API.get("/complaints"),
        API.get("/complaints/workers"),
      ]);
      setComplaints(complaintsRes.data);
      setWorkers(workersRes.data);
    } catch (error) {
      console.error("Supervisor dashboard fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const categoryLabel = useMemo(() => complaints[0]?.category || "Assigned Category", [complaints]);

  const stats = useMemo(() => {
    const submitted = complaints.filter((c) => c.status === "Submitted").length;
    const assigned = complaints.filter((c) => c.status === "Assigned").length;
    const inProgress = complaints.filter((c) => c.status === "In Progress").length;
    const completed = complaints.filter((c) => ["Completed", "Approved"].includes(c.status)).length;
    return { submitted, assigned, inProgress, completed };
  }, [complaints]);

  const updateStatus = async (complaintId, status) => {
    try {
      const body = { status };
      if (status === "Assigned") {
        const workerId = selectedWorkerByComplaint[complaintId];
        if (workerId) body.workerId = workerId;
      }
      await API.patch(`/complaints/${complaintId}/status`, body);
      fetchData();
    } catch (error) {
      console.error("Status update failed", error);
    }
  };

  const handleWorkerSelect = (complaintId, workerId) => {
    setSelectedWorkerByComplaint((prev) => ({ ...prev, [complaintId]: workerId }));
  };

  const sendCompletionEmail = async (complaintId) => {
    try {
      setSendingEmailByComplaint((prev) => ({ ...prev, [complaintId]: true }));
      const response = await API.post(`/complaints/${complaintId}/send-completion-email`);
      window.alert(response.data?.message || "Email sent to citizen successfully.");
    } catch (error) {
      window.alert(error.response?.data?.message || "Failed to send email to citizen.");
    } finally {
      setSendingEmailByComplaint((prev) => ({ ...prev, [complaintId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-ivory">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 animate-fade-up">
          <div className="w-11 h-11 rounded-xl bg-indigo-900 flex items-center justify-center flex-shrink-0">
            <IconSupervisor className="w-5 h-5 text-saffron" />
          </div>
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-indigo-900">Department Ops Hub</h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Category scope: <span className="font-semibold text-indigo-brand">{categoryLabel}</span>
              <span className="mx-2 text-slate-300">·</span>
              Completed items remain visible for 8 hours
            </p>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
          <MiniStat label="Submitted" value={stats.submitted} icon={<IconNote className="w-4 h-4 text-indigo-500" />} iconBg="bg-indigo-50" />
          <MiniStat label="Assigned" value={stats.assigned} icon={<IconClock className="w-4 h-4 text-saffron-600" />} iconBg="bg-saffron-50" />
          <MiniStat label="In Progress" value={stats.inProgress} icon={<IconWrench className="w-4 h-4 text-blue-500" />} iconBg="bg-blue-50" />
          <MiniStat label="Completed" value={stats.completed} icon={<IconCheck className="w-4 h-4 text-emerald-500" />} iconBg="bg-emerald-50" />
        </div>

        {/* Map */}
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden animate-fade-up">
          <div className="px-5 py-3.5 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-indigo-900">Live Department Map</h2>
          </div>
          <MapView complaints={complaints} />
        </div>

        {/* Queue table */}
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden animate-fade-up">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-indigo-900">Complaint Queue</h2>
            <span className="text-xs text-slate-400">{complaints.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Title</th>
                  <th className="p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Description</th>
                  <th className="p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Status</th>
                  <th className="p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Worker</th>
                  <th className="p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint._id} className="border-t border-slate-100 hover:bg-indigo-50/30 transition-colors duration-200">
                    <td className="p-3.5 font-medium text-indigo-900">{complaint.title || "Untitled"}</td>
                    <td className="p-3.5 text-slate-600 max-w-xs truncate">{complaint.description}</td>
                    <td className="p-3.5">
                      <QueueStatusPill status={complaint.status} />
                    </td>
                    <td className="p-3.5">
                      <select
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-saffron/50 focus:border-saffron transition-all"
                        value={selectedWorkerByComplaint[complaint._id] || complaint.assignedWorker?._id || ""}
                        onChange={(e) => handleWorkerSelect(complaint._id, e.target.value)}
                      >
                        <option value="">Select worker</option>
                        {workers.map((worker) => (
                          <option key={worker._id} value={worker._id}>
                            {worker.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3.5">
                      <div className="flex flex-col gap-2 min-w-[160px]">
                        <select
                          className="rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-saffron/50 focus:border-saffron transition-all"
                          value={complaint.status}
                          onChange={(e) => updateStatus(complaint._id, e.target.value)}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => sendCompletionEmail(complaint._id)}
                          disabled={
                            !["Completed", "Approved"].includes(complaint.status) ||
                            Boolean(sendingEmailByComplaint[complaint._id])
                          }
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-brand hover:border-indigo-200 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
                        >
                          {sendingEmailByComplaint[complaint._id] ? "Sending…" : "Notify Citizen"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {complaints.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-10 text-center text-slate-400">
                      {loading ? "Loading complaints…" : "No complaints in your category right now."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, icon, iconBg }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <div className={`w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center`}>{icon}</div>
      </div>
      <p className="font-display text-2xl font-bold text-indigo-900">{value}</p>
    </div>
  );
}

function QueueStatusPill({ status }) {
  const config = {
    Submitted: { bg: "bg-slate-100", text: "text-slate-600" },
    Assigned: { bg: "bg-saffron-50", text: "text-saffron-700" },
    "In Progress": { bg: "bg-blue-50", text: "text-blue-700" },
    Completed: { bg: "bg-emerald-50", text: "text-emerald-700" },
    Approved: { bg: "bg-emerald-50", text: "text-emerald-700" },
  }[status] || { bg: "bg-slate-100", text: "text-slate-600" };

  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>
      {status}
    </span>
  );
}

export default SupervisorDashboard;
