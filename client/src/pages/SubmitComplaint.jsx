import { useState } from "react";
import API from "../services/apiService";


function SubmitComplaint() {
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    try {
      await API.post("/complaints", {
        description,
      });

      alert("Complaint submitted");
    } catch (error) {
      alert("Error submitting complaint");
    }
  };

  return (
    <div>
      <h2>Submit Complaint</h2>
      <textarea
        placeholder="Describe the issue"
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default SubmitComplaint;
