import { useEffect, useState } from "react";
import API from "../services/apiService";

// 👇 Styles outside component
const cardStyle = {
  padding: "15px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  minWidth: "120px",
  textAlign: "center",
  fontWeight: "bold",
  backgroundColor: "#f5f5f5"
};

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints");
      setComplaints(res.data);
    } catch (error) {
      console.error("Error fetching complaints", error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await API.patch(`/complaints/${id}/status`, {
        status: newStatus,
      });

      fetchComplaints(); // refresh list
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  // 👇 Analytics calculations
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === "Pending").length;
  const inProgress = complaints.filter(c => c.status === "In Progress").length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;
  const highPriority = complaints.filter(c => c.priority === "High").length;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>

      {/* 👇 Analytics Cards */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px", flexWrap: "wrap" }}>
        <div style={cardStyle}>Total: {total}</div>
        <div style={cardStyle}>Pending: {pending}</div>
        <div style={cardStyle}>In Progress: {inProgress}</div>
        <div style={cardStyle}>Resolved: {resolved}</div>
        <div style={cardStyle}>High Priority: {highPriority}</div>
      </div>

      {/* 👇 Complaint List */}
      {complaints.map((c) => (
        <div
          key={c._id}
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "8px"
          }}
        >
          <p><strong>User:</strong> {c.user?.name}</p>
          <p><strong>Description:</strong> {c.description}</p>
          <p><strong>Category:</strong> {c.category}</p>

          <p>
            <strong>Priority:</strong>{" "}
            <span style={{
              color:
                c.priority === "High"
                  ? "red"
                  : c.priority === "Medium"
                  ? "orange"
                  : "green"
            }}>
              {c.priority}
            </span>
          </p>

          <p><strong>Status:</strong> {c.status}</p>

          <select
            value={c.status}
            onChange={(e) => updateStatus(c._id, e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;
