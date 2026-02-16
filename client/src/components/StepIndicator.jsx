import React from "react";

function StepIndicator({ step }) {
  const steps = ["Category", "Details", "Location", "Review"];
  const progressWidth = ((step - 1) / (steps.length - 1)) * 100;

  return (
    <div className="relative mb-20">

      {/* Background Line */}
      <div className="absolute top-4 left-0 w-full h-[2px] bg-gray-200"></div>

      {/* Active Progress Line */}
      <div
        className="absolute top-4 left-0 h-[2px] bg-blue-600 transition-all duration-500"
        style={{ width: `${progressWidth}%` }}
      ></div>

      <div className="relative flex justify-between">

        {steps.map((label, index) => {
          const isActive = step === index + 1;
          const isCompleted = step > index + 1;

          return (
            <div key={index} className="flex flex-col items-center">

              {/* Circle */}
              <div
                className={`
                  w-8 h-8 flex items-center justify-center rounded-full
                  text-xs font-medium transition-all duration-300
                  border-2
                  ${
                    isCompleted
                      ? "bg-blue-600 border-blue-600 text-white"
                      : isActive
                      ? "border-blue-600 text-blue-600 bg-white"
                      : "border-gray-300 text-gray-400 bg-white"
                  }
                `}
              >
                {index + 1}
              </div>

              {/* Label */}
              <p
                className={`mt-3 text-xs tracking-wide ${
                  isActive || isCompleted
                    ? "text-blue-600"
                    : "text-gray-400"
                }`}
              >
                {label}
              </p>

            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StepIndicator;
