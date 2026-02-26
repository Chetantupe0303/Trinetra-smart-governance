import React, { useEffect, useMemo, useState } from "react";
import API from "../services/apiService";
import MapView from "../components/MapView";

const STATUS_OPTIONS = ["Submitted", "Assigned", "In Progress", "Completed"];

function SupervisorDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [selectedWorkerByComplaint, setSelectedWorkerByComplaint] = useState({});
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

  const categoryLabel = useMemo(
    () => complaints[0]?.category || "Assigned Category",
    [complaints]
  );

  const updateStatus = async (complaintId, status) => {
    try {
      const body = { status };
      if (status === "Assigned") {
        const workerId = selectedWorkerByComplaint[complaintId];
        if (workerId) {
          body.workerId = workerId;
        }
      }

      await API.patch(`/complaints/${complaintId}/status`, body);
      fetchData();
    } catch (error) {
      console.error("Status update failed", error);
    }
  };

  const handleWorkerSelect = (complaintId, workerId) => {
    setSelectedWorkerByComplaint((prev) => ({
      ...prev,
      [complaintId]: workerId,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Supervisor Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">
            Category scope: <span className="font-semibold">{categoryLabel}</span>
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Showing active complaints only (excluding Completed).
          </p>
        </div>

        <MapView complaints={complaints} />

        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Worker</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint._id} className="border-t">
                  <td className="p-3">{complaint.title || "Untitled"}</td>
                  <td className="p-3">{complaint.description}</td>
                  <td className="p-3">{complaint.status}</td>
                  <td className="p-3">
                    <select
                      className="rounded-lg border px-3 py-2"
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
                  <td className="p-3">
                    <select
                      className="rounded-lg border px-3 py-2"
                      value={complaint.status}
                      onChange={(e) => updateStatus(complaint._id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {complaints.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-slate-500">
                    {loading ? "Loading complaints..." : "No active complaints in your category."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SupervisorDashboard;
