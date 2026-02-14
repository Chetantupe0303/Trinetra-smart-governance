import { useEffect, useState } from "react";
import API from "../services/apiService";
import ComplaintCard from "../components/ComplaintCard";
import { Link } from "react-router-dom";

function Dashboard() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints");
      setComplaints(res.data);
    } catch (error) {
      console.error("Error fetching complaints");
    }
  };

  const total = complaints.length;
  const pending = complaints.filter(c => c.status === "Pending").length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Complaints</h2>

      {/* Analytics */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div style={cardStyle}>Total: {total}</div>
        <div style={cardStyle}>Pending: {pending}</div>
        <div style={cardStyle}>Resolved: {resolved}</div>
      </div>

      <Link to="/submit">
        <button style={{ marginBottom: "20px" }}>
          + Submit New Complaint
        </button>
      </Link>

      {complaints.length === 0 && <p>No complaints yet.</p>}

      {complaints.map((c) => (
        <ComplaintCard key={c._id} complaint={c} />
      ))}
    </div>
  );
}

const cardStyle = {
  padding: "15px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  minWidth: "120px",
  textAlign: "center",
  fontWeight: "bold",
  backgroundColor: "#f9f9f9"
};

export default Dashboard;
