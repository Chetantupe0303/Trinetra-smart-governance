import React from "react";

function DetailsStep({
  description,
  setDescription,
  priority,        // still here (not removed from logic)
  setPriority,     // not used visually
  image,
  setImage,
  nextStep,
  prevStep
}) {
  return (
    <div className="w-full">

      {/* Header */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800">
          Provide Details
        </h2>
        <p className="text-gray-500 mt-2 text-sm">
          Help us understand the issue better by adding details and a photo.
        </p>
      </div>

      <div className="space-y-10">

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="5"
            placeholder="Describe the issue clearly and in detail..."
            className="w-full px-5 py-4 border border-gray-200 rounded-2xl
                       bg-gray-50 focus:bg-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       transition resize-none text-sm shadow-sm"
          />
        </div>

        {/* Camera / Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Add Photo (Optional)
          </label>

          <div className="grid md:grid-cols-2 gap-6">

            {/* Take Picture */}
            <label
              htmlFor="cameraUpload"
              className="flex flex-col items-center justify-center
                         border-2 border-dashed border-gray-300
                         rounded-2xl p-8 cursor-pointer
                         hover:border-blue-500 hover:bg-blue-50
                         transition-all duration-300 text-center"
            >
              📷
              <p className="mt-3 font-medium text-gray-700">
                Take Picture
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Open camera
              </p>
            </label>

            {/* Upload From Device */}
            <label
              htmlFor="fileUpload"
              className="flex flex-col items-center justify-center
                         border-2 border-dashed border-gray-300
                         rounded-2xl p-8 cursor-pointer
                         hover:border-blue-500 hover:bg-blue-50
                         transition-all duration-300 text-center"
            >
              🖼️
              <p className="mt-3 font-medium text-gray-700">
                Upload Image
              </p>
              <p className="text-xs text-gray-500 mt-1">
                From gallery
              </p>
            </label>

            {/* Hidden Inputs */}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              id="cameraUpload"
              className="hidden"
              onChange={(e) => setImage(e.target.files[0])}
            />

            <input
              type="file"
              accept="image/*"
              id="fileUpload"
              className="hidden"
              onChange={(e) => setImage(e.target.files[0])}
            />

          </div>

          {/* File Preview Name */}
          {image && (
            <div className="mt-5 p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
              Selected: {image.name}
            </div>
          )}
        </div>

      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-14">
        <button
          onClick={prevStep}
          className="px-8 py-3 rounded-xl border border-gray-300 
                     text-gray-700 hover:bg-gray-100 transition"
        >
          Back
        </button>

        <button
          onClick={nextStep}
          className="px-10 py-3 rounded-xl bg-blue-600
                     text-white font-medium
                     hover:bg-blue-700 transition shadow-md"
        >
          Next →
        </button>
      </div>

    </div>
  );
}

export default DetailsStep;
