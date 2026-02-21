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

  // Admins cannot submit complaints, only view them
  if (user && user.role === "admin") {
    return <Navigate to="/admin" />;
  }

  const [step, setStep] = useState(1);

  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState("");

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      if (description) formData.append("description", description);
      if (priority) formData.append("priority", priority);
      if (location) formData.append("location", location);
      if (image) formData.append("image", image);

      await API.post("/complaints", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Complaint submitted");
    } catch (error) {
      alert("Error submitting complaint");
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
          />
        )}

      </div>
    </div>
  );
}

export default SubmitComplaint;
