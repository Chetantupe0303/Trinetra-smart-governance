import React, { useState, useRef, useCallback } from "react";
import { IconCamera, IconCheck, IconClock } from "./icons/Icons";

const priorities = [
  { key: "Low", color: "emerald" },
  { key: "Medium", color: "saffron" },
  { key: "High", color: "red" },
];

const priorityClasses = {
  Low: {
    active: "border-emerald-400 bg-emerald-50 text-emerald-700 ring-4 ring-emerald-100/60 shadow-md shadow-emerald-200/30",
    dot: "bg-emerald-500",
  },
  Medium: {
    active: "border-saffron-400 bg-saffron-50 text-saffron-700 ring-4 ring-saffron-100/60 shadow-md shadow-saffron-200/30",
    dot: "bg-saffron-500",
  },
  High: {
    active: "border-red-400 bg-red-50 text-red-700 ring-4 ring-red-100/60 shadow-md shadow-red-200/30",
    dot: "bg-red-500",
  },
};

function DetailsStep({
  description,
  setDescription,
  priority,
  setPriority,
  image,
  setImage,
  nextStep,
  prevStep,
}) {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setStream(mediaStream);
      setIsCameraOpen(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch (err) {
      alert("Camera access denied or not available.");
      console.error(err);
    }
  };

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        const file = new File([blob], `photo-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        setImage(file);
        setPreview(URL.createObjectURL(file));
        closeCamera();
      },
      "image/jpeg",
      0.8
    );
  }, [setImage]);

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStream(null);
    setIsCameraOpen(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Step Counter Badge */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200/60 shadow-sm">
          <div className="w-5 h-5 rounded-full bg-indigo-brand flex items-center justify-center shadow-sm">
            <span className="text-[10px] font-bold text-white">1</span>
          </div>
          <p className="text-xs font-bold text-indigo-700 tracking-wide">
            Step 1 of 3
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="mb-10">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-indigo-900 mb-3 tracking-tight">
          Provide Details
        </h2>
        <p className="text-slate-500 text-sm sm:text-base font-medium leading-relaxed max-w-lg">
          Help us understand the issue better by describing it, setting a priority, and adding a photo.
        </p>
      </div>

      <div className="space-y-10">
        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-3">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="5"
            placeholder="Describe the issue clearly and in detail..."
            className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl
                       bg-slate-50 focus:bg-white
                       focus:outline-none focus:ring-4 focus:ring-indigo-100
                       focus:border-indigo-400 hover:border-slate-300
                       transition-all duration-300 resize-none text-sm shadow-sm"
          />
        </div>

        {/* Priority Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-3">
            Priority Level
          </label>
          <div className="grid grid-cols-3 gap-3">
            {priorities.map((p) => {
              const isActive = priority === p.key;
              const styles = priorityClasses[p.key];
              return (
                <button
                  type="button"
                  key={p.key}
                  onClick={() => setPriority(p.key)}
                  className={`flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border-2 font-semibold text-sm transition-all duration-300 ${
                    isActive
                      ? styles.active
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isActive ? styles.dot : "bg-slate-300"}`} />
                  {p.key}
                </button>
              );
            })}
          </div>
        </div>

        {/* Camera / Upload Section */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-4">
            Add Photo (Optional)
          </label>

          {isCameraOpen ? (
            <div className="rounded-2xl overflow-hidden border-2 border-indigo-brand bg-slate-900 relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full max-h-[400px] object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />

              <div className="flex justify-center gap-4 p-4 bg-slate-900/70">
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-800 font-semibold text-sm rounded-xl hover:bg-slate-100 transition"
                >
                  <IconCamera className="w-4 h-4" />
                  Capture
                </button>
                <button
                  type="button"
                  onClick={closeCamera}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 text-white font-semibold text-sm rounded-xl hover:bg-red-600 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <button
                type="button"
                onClick={openCamera}
                className="group flex flex-col items-center justify-center
                           border-2 border-dashed border-slate-300
                           rounded-2xl p-8 cursor-pointer
                           hover:border-indigo-brand hover:bg-indigo-50/60
                           transition-all duration-300 text-center bg-white"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center transition-colors duration-300">
                  <IconCamera className="w-6 h-6 text-indigo-brand" />
                </div>
                <p className="mt-3 font-semibold text-slate-700 text-sm">
                  Take Picture
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Open camera
                </p>
              </button>

              <label
                htmlFor="fileUpload"
                className="group flex flex-col items-center justify-center
                           border-2 border-dashed border-slate-300
                           rounded-2xl p-8 cursor-pointer
                           hover:border-indigo-brand hover:bg-indigo-50/60
                           transition-all duration-300 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center transition-colors duration-300">
                  <svg className="w-6 h-6 text-indigo-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.5-4.5a2 2 0 012.8 0L16 16m-2-2l1.5-1.5a2 2 0 012.8 0L20 14M4 8h16M4 4h16v16H4V4z" />
                  </svg>
                </div>
                <p className="mt-3 font-semibold text-slate-700 text-sm">
                  Upload Image
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  From gallery
                </p>
              </label>

              <input
                type="file"
                accept="image/*"
                id="fileUpload"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          )}

          {preview && !isCameraOpen && (
            <div className="mt-5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-4 animate-fade-up">
              <img
                src={preview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border border-emerald-200"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-emerald-700 font-semibold truncate">
                  {image?.name}
                </p>
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                  <IconCheck className="w-3.5 h-3.5" />
                  Photo ready to upload
                </p>
              </div>
              <button
                type="button"
                onClick={removeImage}
                className="text-red-500 hover:text-red-700 text-xs font-bold transition uppercase tracking-wide"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-6 mt-10 border-t border-slate-100">
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
          disabled={!description.trim()}
          className={`group flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
            description.trim()
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

export default DetailsStep;
