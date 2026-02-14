import React, { useContext } from "react";
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
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-6 py-16">
    
    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100 p-10">

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">
          Submit Complaint
        </h2>
        <p className="text-slate-500 mt-2">
          Describe your issue clearly so we can help you faster.
        </p>
      </div>

      <div className="space-y-6">
        <textarea
          placeholder="Describe the issue..."
          onChange={(e) => setDescription(e.target.value)}
          rows="6"
          className="w-full resize-none px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 text-slate-700"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 active:scale-95 text-white py-3 rounded-2xl font-semibold shadow-lg transition-all duration-300"
        >
          Submit Complaint
        </button>
      </div>

    </div>

  </div>
);

}

export default SubmitComplaint;
