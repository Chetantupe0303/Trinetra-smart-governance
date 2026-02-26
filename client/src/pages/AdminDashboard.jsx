import React, { useEffect, useMemo, useState } from "react";
import API from "../services/apiService";
import MapView from "../components/MapView";

const TABS = ["Supervisors", "Workers", "Citizens", "Complaints"];

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Complaints");
  const [supervisors, setSupervisors] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [citizens, setCitizens] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [mapPins, setMapPins] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [supervisorsRes, workersRes, citizensRes, complaintsRes, mapPinsRes] =
        await Promise.all([
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
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-slate-100 text-slate-600">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Role</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row._id} className="border-t">
              <td className="p-3">{row.name}</td>
              <td className="p-3">{row.email}</td>
              <td className="p-3">{row.role}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={3} className="p-6 text-center text-slate-500">
                {loading ? "Loading..." : "No records found"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderComplaintsTable = () => (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-slate-100 text-slate-600">
          <tr>
            <th className="p-3 text-left">Title</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Citizen</th>
            <th className="p-3 text-left">Worker</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint) => (
            <tr key={complaint._id} className="border-t">
              <td className="p-3">{complaint.title || "Untitled"}</td>
              <td className="p-3">{complaint.category}</td>
              <td className="p-3">{complaint.status}</td>
              <td className="p-3">{complaint.createdBy?.name || complaint.user?.name || "-"}</td>
              <td className="p-3">{complaint.assignedWorker?.name || "-"}</td>
            </tr>
          ))}
          {complaints.length === 0 && (
            <tr>
              <td colSpan="5" className="p-6 text-center text-slate-500">
                {loading ? "Loading..." : "No complaints found"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const listTitleByTab = {
    Supervisors: "Supervisors List",
    Workers: "Workers List",
    Citizens: "Citizens List",
    Complaints: "Complaints List",
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-6">
        <aside className="col-span-12 rounded-lg border bg-white p-4 shadow-sm md:col-span-3 lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Admin Dashboard
          </h2>
          <div className="space-y-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                  activeTab === tab
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </aside>

        <main className="col-span-12 space-y-6 md:col-span-9 lg:col-span-10">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <p className="text-xs text-slate-500">Supervisors</p>
              <p className="text-xl font-bold">{summary.supervisors}</p>
            </div>
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <p className="text-xs text-slate-500">Workers</p>
              <p className="text-xl font-bold">{summary.workers}</p>
            </div>
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <p className="text-xs text-slate-500">Citizens</p>
              <p className="text-xl font-bold">{summary.citizens}</p>
            </div>
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <p className="text-xs text-slate-500">Complaints</p>
              <p className="text-xl font-bold">{summary.complaints}</p>
            </div>
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <p className="text-xs text-slate-500">Active Pins</p>
              <p className="text-xl font-bold">{summary.activePins}</p>
            </div>
          </div>

          <MapView complaints={mapPins} />

          <div>
            <h3 className="text-lg font-semibold text-slate-800">{listTitleByTab[activeTab]}</h3>
          </div>

          {activeTab === "Supervisors" && renderUsersTable(supervisors)}
          {activeTab === "Workers" && renderUsersTable(workers)}
          {activeTab === "Citizens" && renderUsersTable(citizens)}
          {activeTab === "Complaints" && renderComplaintsTable()}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
