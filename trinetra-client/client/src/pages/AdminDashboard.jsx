import React, { useEffect, useMemo, useState } from "react";
import API from "../services/apiService";
import MapView from "../components/MapView";
import {
  IconGear,
  IconSupervisor,
  IconWrench,
  IconChart,
  IconNote,
  IconPin,
  IconEye,
} from "../components/icons/Icons";

const TABS = [
  { key: "Complaints", icon: IconNote },
  { key: "Supervisors", icon: IconSupervisor },
  { key: "Workers", icon: IconWrench },
  { key: "Citizens", icon: IconChart },
];

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Complaints");
  const [supervisors, setSupervisors] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [citizens, setCitizens] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [mapPins, setMapPins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inspector, setInspector] = useState({ open: false, complaint: null });
  const [photoModal, setPhotoModal] = useState({ open: false, title: "", url: "" });

  const resolveImageUrl = (imagePath) => {
    if (!imagePath || typeof imagePath !== "string") return null;
    if (imagePath.startsWith("http") || imagePath.startsWith("data:")) return imagePath;
    return `http://127.0.0.1:5001${imagePath}`;
  };

  const closeInspector = () => {
    setInspector({ open: false, complaint: null });
    setPhotoModal({ open: false, title: "", url: "" });
  };

  const openInspector = (complaint) => setInspector({ open: true, complaint });

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [supervisorsRes, workersRes, citizensRes, complaintsRes, mapPinsRes] = await Promise.all([
        API.get("/admin/users/supervisor"),
        API.get("/admin/users/worker"),
        API.get("/admin/users/citizen"),
        API.get("/admin/complaints"),
        API.get("/admin/map-pins"),
      ]);

      setSupervisors(supervisorsRes.data);
      setWorkers(workersRes.data);
      setCitizens(citizensRes.data);
      setComplaints(complaintsRes.data);
      setMapPins(mapPinsRes.data);
    } catch (error) {
      console.error("Error loading admin dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const summary = useMemo(
    () => ({
      supervisors: supervisors.length,
      workers: workers.length,
      citizens: citizens.length,
      complaints: complaints.length,
      activePins: mapPins.length,
    }),
    [supervisors, workers, citizens, complaints, mapPins]
  );

  const renderUsersTable = (rows) => (
    <div className="overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Name</th>
            <th className="p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Email</th>
            <th className="p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Role</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row._id} className="border-t border-slate-100 hover:bg-indigo-50/30 transition-colors duration-200">
              <td className="p-3.5 font-medium text-indigo-900">{row.name}</td>
              <td className="p-3.5 text-slate-600">{row.email}</td>
              <td className="p-3.5">
                <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 capitalize">
                  {row.role}
                </span>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={3} className="p-10 text-center text-slate-400">
                {loading ? "Loading…" : "No records found"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderComplaintsTable = () => (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Title</th>
              <th className="p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Category</th>
              <th className="p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Status</th>
              <th className="p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Citizen</th>
              <th className="p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Worker</th>
              <th className="p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => (
              <tr key={complaint._id} className="border-t border-slate-100 hover:bg-indigo-50/30 transition-colors duration-200">
                <td className="p-3.5 font-medium text-indigo-900">{complaint.title || "Untitled"}</td>
                <td className="p-3.5 text-slate-600">{complaint.category}</td>
                <td className="p-3.5">
                  <AdminStatusPill status={complaint.status} />
                </td>
                <td className="p-3.5 text-slate-600">{complaint.createdBy?.name || complaint.user?.name || "—"}</td>
                <td className="p-3.5 text-slate-600">{complaint.assignedWorker?.name || "—"}</td>
                <td className="p-3.5">
                  <button
                    type="button"
                    onClick={() => openInspector(complaint)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-brand hover:border-indigo-200 transition-all duration-200"
                  >
                    <IconEye className="w-3.5 h-3.5" />
                    Inspect
                  </button>
                </td>
              </tr>
            ))}
            {complaints.length === 0 && (
              <tr>
                <td colSpan="6" className="p-10 text-center text-slate-400">
                  {loading ? "Loading…" : "No complaints found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Complaint Inspector Modal */}
      {inspector.open && inspector.complaint && (
        <div
          className="fixed inset-0 z-[1000] bg-indigo-950/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={closeInspector}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 animate-scale-in max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Complaint Inspector</p>
                <h4 className="font-display text-lg font-bold text-indigo-900 mt-0.5">
                  {inspector.complaint.title || "Untitled"}
                </h4>
              </div>
              <button
                type="button"
                onClick={closeInspector}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-indigo-900 transition-colors duration-200"
                aria-label="Close inspector"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <InfoTile label="Category" value={inspector.complaint.category || "—"} />
                <InfoTile label="Status" value={<AdminStatusPill status={inspector.complaint.status} />} />
              </div>
              <div className="rounded-xl bg-slate-50 p-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Description</p>
                <p className="mt-1.5 text-slate-700 leading-relaxed">{inspector.complaint.description || "—"}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const problemUrl = resolveImageUrl(inspector.complaint.imageUrl);
                    if (!problemUrl) return;
                    setPhotoModal({ open: true, title: "Problem Photo", url: problemUrl });
                  }}
                  disabled={!resolveImageUrl(inspector.complaint.imageUrl)}
                  className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-brand transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  View Problem Photo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const resolvedUrl = resolveImageUrl(
                      inspector.complaint.completionImage || inspector.complaint.proofImageUrl
                    );
                    if (!resolvedUrl) return;
                    setPhotoModal({ open: true, title: "Resolved Photo", url: resolvedUrl });
                  }}
                  disabled={
                    !resolveImageUrl(inspector.complaint.completionImage || inspector.complaint.proofImageUrl)
                  }
                  className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  View Resolved Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {photoModal.open && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-indigo-950/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-4xl rounded-2xl bg-white p-4 shadow-2xl animate-scale-in">
            <div className="mb-3 flex items-center justify-between">
              <h5 className="text-sm font-semibold text-indigo-900">{photoModal.title}</h5>
              <button
                type="button"
                onClick={() => setPhotoModal({ open: false, title: "", url: "" })}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors duration-200"
              >
                Close
              </button>
            </div>
            <img src={photoModal.url} alt={photoModal.title} className="max-h-[75vh] w-full rounded-xl object-contain" />
          </div>
        </div>
      )}
    </div>
  );

  const listTitleByTab = {
    Supervisors: "Supervisors List",
    Workers: "Workers List",
    Citizens: "Citizens List",
    Complaints: "Complaints List",
  };

  return (
    <div className="min-h-screen bg-ivory">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-2 animate-fade-up">
          <div className="rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm md:sticky md:top-24">
            <div className="flex items-center gap-2.5 mb-5 px-1">
              <div className="w-9 h-9 rounded-lg bg-indigo-900 flex items-center justify-center flex-shrink-0">
                <IconGear className="w-4.5 h-4.5 text-saffron" />
              </div>
              <div>
                <p className="font-display font-bold text-sm text-indigo-900">Command Center</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide">City Admin</p>
              </div>
            </div>
            <div className="space-y-1.5">
              {TABS.map(({ key, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-all duration-200 ${
                    activeTab === key
                      ? "bg-indigo-brand text-white shadow-sm"
                      : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-brand"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {key}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="col-span-12 md:col-span-9 lg:col-span-10 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 stagger-children">
            <CommandStat label="Supervisors" value={summary.supervisors} icon={<IconSupervisor className="w-4 h-4 text-indigo-500" />} />
            <CommandStat label="Workers" value={summary.workers} icon={<IconWrench className="w-4 h-4 text-blue-500" />} />
            <CommandStat label="Citizens" value={summary.citizens} icon={<IconChart className="w-4 h-4 text-violet-500" />} />
            <CommandStat label="Complaints" value={summary.complaints} icon={<IconNote className="w-4 h-4 text-saffron-600" />} />
            <CommandStat label="Active Pins" value={summary.activePins} icon={<IconPin className="w-4 h-4 text-emerald-500" />} />
          </div>

          <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden animate-fade-up">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-indigo-900">City-Wide Map View</h2>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-xs text-emerald-600 font-medium">Live</span>
              </div>
            </div>
            <MapView complaints={mapPins} />
          </div>

          <div className="animate-fade-up">
            <h3 className="font-display text-lg font-bold text-indigo-900 mb-4">{listTitleByTab[activeTab]}</h3>
            {activeTab === "Supervisors" && renderUsersTable(supervisors)}
            {activeTab === "Workers" && renderUsersTable(workers)}
            {activeTab === "Citizens" && renderUsersTable(citizens)}
            {activeTab === "Complaints" && renderComplaintsTable()}
          </div>
        </main>
      </div>
    </div>
  );
}

function CommandStat({ label, value, icon }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        {icon}
      </div>
      <p className="font-display text-2xl font-bold text-indigo-900">{value}</p>
    </div>
  );
}

function InfoTile({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3.5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <div className="mt-1.5 text-slate-800">{value}</div>
    </div>
  );
}

function AdminStatusPill({ status }) {
  const config = {
    Submitted: { bg: "bg-slate-100", text: "text-slate-600" },
    Assigned: { bg: "bg-saffron-50", text: "text-saffron-700" },
    "In Progress": { bg: "bg-blue-50", text: "text-blue-700" },
    Completed: { bg: "bg-emerald-50", text: "text-emerald-700" },
    Approved: { bg: "bg-emerald-50", text: "text-emerald-700" },
    Pending: { bg: "bg-saffron-50", text: "text-saffron-700" },
  }[status] || { bg: "bg-slate-100", text: "text-slate-600" };

  return <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>{status || "—"}</span>;
}

export default AdminDashboard;
