import React from "react";
function ComplaintCard({ complaint }) {
  return (
    <div style={{
      border: "1px solid #ddd",
      padding: "15px",
      marginBottom: "10px",
      borderRadius: "8px",
      backgroundColor: "#fff"
    }}>
      
      <div className="border rounded-xl p-4">
      <h3>{complaint.title}</h3>
      <p>{complaint.description}</p>

      {/* Display Base64 Image */}
      {complaint.image?.data && (
        <img
          src={complaint.image.data}
          alt="Complaint"
          className="w-full max-w-md rounded-lg mt-4"
        />
      )}
    </div>
      <h4>{complaint.description}</h4>

      <p>
        <strong>Status:</strong>{" "}
        <span style={{
          color:
            complaint.status === "Pending"
              ? "orange"
              : complaint.status === "Resolved"
              ? "green"
              : "blue"
        }}>
          {complaint.status}
        </span>
      </p>

      <p><strong>Category:</strong> {complaint.category || "N/A"}</p>

      <p>
        <strong>Priority:</strong>{" "}
        <span style={{
          color:
            complaint.priority === "High"
              ? "red"
              : complaint.priority === "Medium"
              ? "orange"
              : "green"
        }}>
          {complaint.priority || "N/A"}
        </span>
      </p>

      <p style={{ fontSize: "12px", color: "#666" }}>
        Created: {new Date(complaint.createdAt).toLocaleString()}
      </p>
    </div>

        

  );
}

export default ComplaintCard;
