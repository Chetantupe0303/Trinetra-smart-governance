import React, { useCallback, useEffect, useMemo, useState } from "react";
import { IconPin, IconCheck } from "./icons/Icons";

function LocationStep({
  location,
  setLocation,
  coordinates,
  setCoordinates,
  nextStep,
  prevStep,
}) {
  const [geoStatus, setGeoStatus] = useState("idle");
  const [geoError, setGeoError] = useState("");

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoStatus("error");
      setGeoError("Geolocation is not supported in this browser.");
      return;
    }

    setGeoStatus("loading");
    setGeoError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setGeoStatus("success");
      },
      (error) => {
        setCoordinates(null);
        setGeoStatus("error");
        setGeoError(
          error?.message || "Location permission denied or unavailable."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 7000,
        maximumAge: 60000,
      }
    );
  }, [setCoordinates]);

  const reverseGeocode = useCallback(
    async (lat, lng) => {
      if (typeof lat !== "number" || typeof lng !== "number") {
        return;
      }
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
          {
            headers: {
              "Accept-Language": "en",
            },
          }
        );
        const data = await response.json();
        if (data?.display_name) {
          setLocation(data.display_name);
        }
      } catch (error) {
        console.error("Reverse geocoding failed", error);
      }
    },
    [setLocation]
  );

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  useEffect(() => {
    if (
      coordinates &&
      typeof coordinates.lat === "number" &&
      typeof coordinates.lng === "number"
    ) {
      reverseGeocode(coordinates.lat, coordinates.lng);
    }
  }, [coordinates, reverseGeocode]);

  const mapSrc = useMemo(() => {
    if (
      coordinates &&
      typeof coordinates.lat === "number" &&
      typeof coordinates.lng === "number"
    ) {
      return `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}&z=17&output=embed`;
    }
    const encodedAddress = encodeURIComponent(location || "");
    return `https://www.google.com/maps?q=${encodedAddress}&output=embed`;
  }, [coordinates, location]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Step Counter Badge */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200/60 shadow-sm">
          <div className="w-5 h-5 rounded-full bg-indigo-brand flex items-center justify-center shadow-sm">
            <span className="text-[10px] font-bold text-white">2</span>
          </div>
          <p className="text-xs font-bold text-indigo-700 tracking-wide">
            Step 2 of 3
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <IconPin className="w-5 h-5 text-indigo-brand" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-indigo-900 tracking-tight">
            Location Details
          </h2>
        </div>
        <p className="text-slate-500 text-sm sm:text-base font-medium leading-relaxed max-w-lg">
          Provide the exact location where the issue occurred. This helps our team reach the spot quickly.
        </p>
      </div>

      {/* Location Card */}
      <div className="relative bg-white/80 backdrop-blur-xl border border-indigo-100/70 rounded-[1.5rem] p-6 sm:p-8 shadow-lg shadow-indigo-100/40 overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-100/30 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-saffron-100/30 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative space-y-6">
          {/* Primary Address Input */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-3">
              Street Address or Landmark
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200/60 flex items-center justify-center group-focus-within:bg-indigo-100 group-focus-within:border-indigo-300/60 transition-all duration-300 shadow-sm">
                <IconPin className="w-4 h-4 text-indigo-brand" />
              </div>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter full address or landmark..."
                className="w-full pl-[4.25rem] pr-5 py-4 rounded-2xl
                           border-2 border-slate-200/80
                           bg-white/90 backdrop-blur-sm text-sm font-medium text-slate-800
                           placeholder:text-slate-400 placeholder:font-normal
                           focus:outline-none
                           focus:ring-4 focus:ring-indigo-100
                           focus:border-indigo-400
                           hover:border-slate-300
                           transition-all duration-300
                           shadow-sm hover:shadow-md focus:shadow-lg focus:shadow-indigo-100/40"
              />
              {location && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
                    <IconCheck className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Map Section */}
          <div className="bg-indigo-50/40 border border-indigo-100/70 rounded-2xl p-4 sm:p-5 shadow-sm">
            {/* Map Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-brand flex items-center justify-center shadow-md shadow-indigo-brand/20">
                  <IconPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Map Preview</h3>
                  <p className="text-[10px] text-slate-400 font-medium">Visual location reference</p>
                </div>
              </div>
              {location && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-[10px] font-bold text-emerald-700 uppercase tracking-wider shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Located
                </span>
              )}
            </div>

            {/* Secondary Address Input */}
            <div className="relative mb-4">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Refine address or add details..."
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200/80
                           bg-white/90 text-sm font-medium text-slate-800
                           placeholder:text-slate-400 placeholder:font-normal
                           focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400
                           hover:border-slate-300
                           transition-all duration-300 shadow-sm"
              />
            </div>

            <div className="mb-4 px-1 text-[11px] font-medium text-slate-600 space-y-1">
              <p>
                Latitude:{" "}
                {coordinates?.lat !== undefined ? coordinates.lat : "Not available"}
              </p>
              <p>
                Longitude:{" "}
                {coordinates?.lng !== undefined ? coordinates.lng : "Not available"}
              </p>
              {geoStatus === "loading" && (
                <p className="text-indigo-600">Fetching current coordinates...</p>
              )}
              {geoStatus === "error" && geoError && (
                <p className="text-red-600">{geoError}</p>
              )}
              <button
                type="button"
                onClick={requestLocation}
                className="mt-1 inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
                disabled={geoStatus === "loading"}
              >
                {geoStatus === "loading" ? "Locating..." : "Refresh location"}
              </button>
            </div>

            {/* Map Preview */}
            <div className="rounded-2xl overflow-hidden border-2 border-slate-200/60 shadow-lg shadow-slate-200/30 ring-1 ring-slate-100">
              <iframe
                title="map"
                width="100%"
                height="300"
                loading="lazy"
                className="rounded-2xl"
                src={mapSrc}
              ></iframe>
            </div>

            {/* Map Footer Info */}
            <div className="flex items-center gap-2 mt-3 px-1">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" strokeWidth={1.8} />
                <path strokeLinecap="round" strokeWidth={1.8} d="M21 21l-4.35-4.35" />
              </svg>
              <p className="text-[11px] text-slate-400 font-medium">
                Map updates as you type your location above
              </p>
            </div>
          </div>

          {/* Hint Section */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-saffron-50 border border-saffron-200/50 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-saffron-100 flex items-center justify-center flex-shrink-0 border border-saffron-200/60">
              <svg className="w-4 h-4 text-saffron-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 18h6M10 21h4M12 3a6 6 0 00-3.6 10.8c.6.5.9 1 .9 1.7V16h5.4v-.5c0-.7.3-1.2.9-1.7A6 6 0 0012 3z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-saffron-800 mb-0.5">Tip</p>
              <p className="text-xs text-saffron-700/80 font-medium leading-relaxed">
                Example: MG Road near Metro Station, Bangalore. Include nearby landmarks for better accuracy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Location Summary */}
      {location && (
        <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200/60 shadow-sm flex items-center gap-3 animate-fade-up">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/20 flex-shrink-0">
            <IconCheck className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Location Set</p>
            <p className="text-sm font-extrabold text-emerald-700 truncate">{location}</p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-10 pt-6 border-t border-slate-100">
        <button
          onClick={prevStep}
          className="group flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-slate-500 bg-slate-50 hover:bg-slate-100 hover:text-slate-700 border border-slate-200/60 transition-all duration-300 hover:shadow-md text-sm"
        >
          <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <button
          onClick={nextStep}
          disabled={!location.trim()}
          className={`group flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
            location.trim()
              ? "bg-indigo-brand hover:bg-indigo-700 text-white shadow-lg shadow-indigo-brand/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 ring-1 ring-white/20"
              : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
          }`}
        >
          Continue
          <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default LocationStep;
