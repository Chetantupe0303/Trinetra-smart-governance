import React from "react";

function ReviewStep({
  category,
  description,
  priority,
  location,
  prevStep,
  handleSubmit
}) {
  return (
    <div className="w-full">

      {/* Header */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800">
          Review & Submit
        </h2>
        <p className="text-gray-500 mt-2 text-sm">
          Please review the information before submitting your complaint.
        </p>
      </div>

      {/* Review Card */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 shadow-sm space-y-6">

        {/* Category */}
        <div className="flex justify-between items-start border-b border-gray-200 pb-4">
          <span className="text-sm font-medium text-gray-500">Category</span>
          <span className="text-sm font-semibold text-gray-800 bg-blue-50 px-3 py-1 rounded-lg">
            {category || "Not selected"}
          </span>
        </div>

        {/* Priority */}
        <div className="flex justify-between items-start border-b border-gray-200 pb-4">
          <span className="text-sm font-medium text-gray-500">Priority</span>
          <span className="text-sm font-semibold text-gray-800">
            {priority}
          </span>
        </div>

        {/* Description */}
        <div className="border-b border-gray-200 pb-4">
          <span className="text-sm font-medium text-gray-500 block mb-2">
            Description
          </span>
          <p className="text-sm text-gray-700 bg-white border border-gray-200 rounded-xl p-4">
            {description || "No description provided"}
          </p>
        </div>

        {/* Location */}
        <div>
          <span className="text-sm font-medium text-gray-500 block mb-2">
            Location
          </span>
          <p className="text-sm text-gray-700 bg-white border border-gray-200 rounded-xl p-4">
            {location || "No location selected"}
          </p>
        </div>

      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-12">
        <button
          onClick={prevStep}
          className="px-8 py-3 rounded-xl border border-gray-300 
                     text-gray-700 hover:bg-gray-100 transition"
        >
          Back
        </button>

        <button
          onClick={handleSubmit}
          className="px-10 py-3 rounded-xl bg-blue-600 
                     text-white font-medium 
                     hover:bg-blue-700 transition shadow-md"
        >
          Submit Complaint →
        </button>
      </div>

    </div>
  );
}

export default ReviewStep;
