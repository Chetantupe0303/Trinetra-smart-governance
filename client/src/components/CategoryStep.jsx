import React from "react";

const categories = [
  { name: "Road", icon: "🚗" },
  { name: "Electricity", icon: "💡" },
  { name: "Water", icon: "🗑️" },
  { name: "Sanitation", icon: "🚰" },
  { name: "Other", icon: "🌊" },
];

function CategoryStep({ category, setCategory, nextStep }) {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-8">

      {/* Step Counter */}
      <div className="mb-6">
        <p className="text-sm font-medium text-blue-600">Step 1 of 4:</p>
      </div>

      {/* Title Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          Tell Us About the Issue
        </h2>
        <p className="text-gray-600 text-base">
          Please select the type of problem you encountered.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-3 gap-6 mb-12">

        {categories.map((item) => (
          <div
            key={item.name}
            onClick={() => setCategory(item.name)}
            className={`
              relative p-6 rounded-xl cursor-pointer text-center 
              transition-all duration-200
              border-2
              ${
                category === item.name
                  ? "border-blue-500 bg-blue-50 shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
              }
            `}
          >
            {/* Icon */}
            <div className="text-4xl mb-3">
              {item.icon}
            </div>

            {/* Category Name */}
            <p className={`text-base font-medium ${
              category === item.name ? "text-blue-700" : "text-gray-700"
            }`}>
              {item.name}
            </p>

            {/* Selected Indicator - Checkmark */}
            {category === item.name && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            )}
          </div>
        ))}

      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <button
          className="px-6 py-2.5 rounded-lg font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          Back
        </button>
        
        <button
          disabled={!category}
          onClick={nextStep}
          className={`
            px-8 py-2.5 rounded-lg font-medium text-white
            transition-all duration-200
            ${
              category
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-300 cursor-not-allowed"
            }
          `}
        >
          Next
        </button>
      </div>

    </div>
  );
}

export default CategoryStep;