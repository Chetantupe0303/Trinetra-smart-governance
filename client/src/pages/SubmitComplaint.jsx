import React, { useState } from "react";
import API from "../services/apiService";

import StepIndicator from "../components/StepIndicator";
import CategoryStep from "../components/CategoryStep";
import DetailsStep from "../components/DetailsStep";
import LocationStep from "../components/LocationStep";
import ReviewStep from "../components/ReviewStep";

function SubmitComplaint() {

  const [step, setStep] = useState(1);

  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState("");

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    try {
      await API.post("/complaints", {
        category,
        description,
        priority,
        location
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
          <CategoryStep
            category={category}
            setCategory={setCategory}
            nextStep={nextStep}
          />
        )}

        {step === 2 && (
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

        {step === 3 && (
          <LocationStep
            location={location}
            setLocation={setLocation}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}

        {step === 4 && (
          <ReviewStep
            category={category}
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
