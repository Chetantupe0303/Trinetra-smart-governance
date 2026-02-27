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
  const [detailsPopup, setDetailsPopup] = useState({
    open: false,
    x: 16,
    y: 16,
    width: 420,
    height: 520,
    complaint: null,
  });
  const [photoModal, setPhotoModal] = useState({ open: false, title: "", url: "" });

  const resolveImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (typeof imagePath !== "string") return null;
    if (imagePath.startsWith("http") || imagePath.startsWith("data:")) return imagePath;
    return `http://127.0.0.1:5001${imagePath}`;
  };

  const closeDetailsPopup = () => {
    setDetailsPopup({
      open: false,
      x: 16,
      y: 16,
      width: 420,
      height: 520,
      complaint: null,
    });
    setPhotoModal({ open: false, title: "", url: "" });
  };

  const openDetailsPopup = (complaint, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const gap = 10;
    const margin = 16;
    const cardWidth = Math.min(460, Math.max(300, window.innerWidth * 0.42));
    const cardHeight = Math.min(560, Math.max(380, window.innerHeight * 0.7));
    let x = rect.right + gap;
    let y = rect.top;

    const maxX = window.innerWidth - cardWidth - margin;
    const maxY = window.innerHeight - cardHeight - margin;

    if (x > maxX) {
      x = Math.max(margin, rect.left - cardWidth - gap);
    }
    y = Math.min(Math.max(margin, y), Math.max(margin, maxY));

    setDetailsPopup({ open: true, x, y, width: cardWidth, height: cardHeight, complaint });
  };

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
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <table className="w-full text-sm">
        <thead className="bg-slate-100 text-slate-600">
          <tr>
            <th className="p-3 text-left">Title</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Citizen</th>
            <th className="p-3 text-left">Worker</th>
            <th className="p-3 text-left">Action</th>
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
              <td className="p-3">
                <button
                  type="button"
                  onClick={(event) => openDetailsPopup(complaint, event)}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
          {complaints.length === 0 && (
            <tr>
              <td colSpan="6" className="p-6 text-center text-slate-500">
                {loading ? "Loading..." : "No complaints found"}
              </td>
            </tr>
          )}
        </tbody>
        </table>
      </div>

      {detailsPopup.open && detailsPopup.complaint && (
        <>
          <div
            className="fixed inset-0 z-[1000] bg-black/10"
            onClick={closeDetailsPopup}
          />
          <div
            className="fixed z-[1010] overflow-y-auto rounded-lg border bg-white p-4 shadow-xl"
            style={{
              width: detailsPopup.width,
              height: detailsPopup.height,
              left: detailsPopup.x,
              top: detailsPopup.y,
            }}
          >
            <div className="mb-3 flex items-start justify-between">
              <h4 className="text-sm font-semibold text-slate-800">
              Complaint Details
              </h4>
              <button
                type="button"
                onClick={closeDetailsPopup}
                className="rounded-md border border-slate-300 px-2 py-1 text-sm font-semibold leading-none text-slate-700 hover:bg-slate-50"
                aria-label="Close complaint details"
              >
                X
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="rounded-md bg-slate-50 p-2.5">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Title</p>
                <p className="mt-1 text-slate-800">{detailsPopup.complaint.title || "Untitled"}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-md bg-slate-50 p-2.5">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Category</p>
                  <p className="mt-1 text-slate-800">{detailsPopup.complaint.category || "-"}</p>
                </div>
                <div className="rounded-md bg-slate-50 p-2.5">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Status</p>
                  <p className="mt-1 text-slate-800">{detailsPopup.complaint.status || "-"}</p>
                </div>
              </div>
              <div className="rounded-md bg-slate-50 p-2.5">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Description</p>
                <p className="mt-1 line-clamp-4 text-slate-800">
                  {detailsPopup.complaint.description || "-"}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const problemUrl = resolveImageUrl(detailsPopup.complaint.imageUrl);
                    if (!problemUrl) return;
                    setPhotoModal({ open: true, title: "Problem Photo", url: problemUrl });
                  }}
                  disabled={!resolveImageUrl(detailsPopup.complaint.imageUrl)}
                  className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  View Problem Photo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const resolvedUrl = resolveImageUrl(
                      detailsPopup.complaint.completionImage ||
                        detailsPopup.complaint.proofImageUrl
                    );
                    if (!resolvedUrl) return;
                    setPhotoModal({ open: true, title: "Resolved Photo", url: resolvedUrl });
                  }}
                  disabled={
                    !resolveImageUrl(
                      detailsPopup.complaint.completionImage ||
                        detailsPopup.complaint.proofImageUrl
                    )
                  }
                  className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  View Resolved Photo
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {photoModal.open && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-4xl rounded-lg bg-white p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h5 className="text-sm font-semibold text-slate-800">{photoModal.title}</h5>
              <button
                type="button"
                onClick={() => setPhotoModal({ open: false, title: "", url: "" })}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
            <img
              src={photoModal.url}
              alt={photoModal.title}
              className="max-h-[75vh] w-full rounded-md object-contain"
            />
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
