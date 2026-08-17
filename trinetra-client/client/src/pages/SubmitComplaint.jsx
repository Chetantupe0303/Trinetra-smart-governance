import React, { useState, useContext } from "react";
import API from "../services/apiService";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import StepIndicator from "../components/StepIndicator";
import DetailsStep from "../components/DetailsStep";
import LocationStep from "../components/LocationStep";
import ReviewStep from "../components/ReviewStep";

function getCurrentCoordinates() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => resolve(null),
      {
        enableHighAccuracy: true,
        timeout: 7000,
        maximumAge: 60000,
      }
    );
  });
}

function SubmitComplaint() {
  const { user } = useContext(AuthContext);
  const isAdmin = user && user.role === "admin";

  const [step, setStep] = useState(1);
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(false);

  if (isAdmin) {
    return <Navigate to="/admin" />;
  }

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    if (loading) return false;
    try {
      setLoading(true);
      // try to reuse the coordinates we obtained earlier or fall back to
      // geolocation; capturedCoordinates is the value we should send.
      const capturedCoordinates =
        coordinates && coordinates.lat && coordinates.lng
          ? coordinates
          : await getCurrentCoordinates();

      const formData = new FormData();
      formData.append("description", description);
      formData.append("priority", priority);

      // include location metadata if we have it
      formData.append(
        "location",
        JSON.stringify({
          address: location,
          lat: capturedCoordinates?.lat,
          lng: capturedCoordinates?.lng,
        })
      );
      formData.append("locationAddress", location || "");
      formData.append(
        "latitude",
        capturedCoordinates?.lat !== undefined ? String(capturedCoordinates.lat) : ""
      );
      formData.append(
        "longitude",
        capturedCoordinates?.lng !== undefined ? String(capturedCoordinates.lng) : ""
      );

      if (image) formData.append("image", image);

      await API.post("/complaints", formData);

      return true;
    } catch (error) {
      // log the entire error object so that we can see what is actually
      // happening; some browser extensions (React DevTools) inject a
      // script called `installHook.js` which may report its own errors in the
      // console, e.g. "Object overrideMethod". those messages are harmless
      // and unrelated to our API call.
      console.error("Failed to submit complaint:", error);
      // optionally expose sensible pieces for debugging if it's an axios
      // error
      if (error?.response) {
        console.error("response data", error.response.data);
        console.error("response status", error.response.status);
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory relative overflow-hidden">
      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-[110px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-saffron-100/30 rounded-full blur-[110px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-white/90 backdrop-blur-xl rounded-[1.75rem] shadow-xl shadow-indigo-100/40 border border-indigo-100/60 animate-fade-up overflow-hidden">
          <div className="pt-8 sm:pt-10 px-2 sm:px-4">
            <StepIndicator step={step} />

            {step === 1 && (
              <DetailsStep
                description={description}
                setDescription={setDescription}
                priority={priority}
                setPriority={setPriority}
                image={image}
                setImage={setImage}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            )}

            {step === 2 && (
              <LocationStep
                location={location}
                setLocation={setLocation}
                coordinates={coordinates}
                setCoordinates={setCoordinates}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            )}

            {step === 3 && (
              <ReviewStep
                description={description}
                priority={priority}
                location={location}
                prevStep={prevStep}
                handleSubmit={handleSubmit}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubmitComplaint;
