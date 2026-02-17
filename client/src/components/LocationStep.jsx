import React from "react";


function LocationStep({ location, setLocation, nextStep, prevStep }) {
  return (
    <div className="w-full">
        
      {/* Header */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800">
          Location Details
        </h2>
        <p className="text-gray-500 mt-2 text-sm">
          Provide the exact location where the issue occurred.
        </p>
      </div>

      {/* Location Card */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 shadow-sm">

        {/* Input */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            📍
          </span>

          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter full address or landmark..."
            className="w-full pl-12 pr-4 py-4 rounded-xl
                       border border-gray-300
                       bg-white text-sm
                       focus:outline-none
                       focus:ring-2 focus:ring-blue-500
                       focus:border-blue-500
                       transition"
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

  {/* Address Input */}
  <input
    type="text"
    value={location}
    onChange={(e) => setLocation(e.target.value)}
    placeholder="Enter address or landmark..."
    className="w-full mb-6 px-4 py-3 rounded-xl border border-gray-300
               focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

    {/* Map Preview */}
    <div className="rounded-xl overflow-hidden border border-gray-200">
        <iframe
        title="map"
        width="100%"
        height="300"
        loading="lazy"
        className="rounded-xl"
        src={`https://www.google.com/maps?q=${location}&output=embed`}
        ></iframe>
    </div>

    </div>


        {/* Optional Hint */}
        <p className="text-xs text-gray-500 mt-3">
          Example: MG Road near Metro Station, Bangalore
        </p>

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

export default LocationStep;
