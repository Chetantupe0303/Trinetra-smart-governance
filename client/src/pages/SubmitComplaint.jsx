import React, { useState, useContext } from "react";
import API from "../services/apiService";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import StepIndicator from "../components/StepIndicator";
import DetailsStep from "../components/DetailsStep";
import LocationStep from "../components/LocationStep";
import ReviewStep from "../components/ReviewStep";

function SubmitComplaint() {
  const { user } = useContext(AuthContext);

  if (user && user.role === "admin") {
    return <Navigate to="/admin" />;
  }

  const [step, setStep] = useState(1);
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false); // ✅ added

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
  if (loading) return false;
  try {
    setLoading(true);

    const formData = new FormData();
    formData.append("description", description);
    formData.append("priority", priority);
    formData.append("location", location);
    
    if (image) formData.append("image", image);
    await API.post("/complaints", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return true; // ✅ important

  } catch (error) {
    return false;
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">

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
            loading={loading}   // ✅ pass loading
          />
        )}

      </div>
    </div>
  );
}

export default SubmitComplaint;