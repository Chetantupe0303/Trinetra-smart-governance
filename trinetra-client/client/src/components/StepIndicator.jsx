import React from "react";
import { IconDetails, IconPin, IconCheck } from "./icons/Icons";

const stepIcons = [IconDetails, IconPin, IconCheck];

function StepIndicator({ step }) {
  const steps = ["Details", "Location", "Review"];
  const progressWidth = ((step - 1) / (steps.length - 1)) * 100;

  return (
    <div className="relative mb-16 px-2 sm:px-4">
      {/* Background Card */}
      <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-indigo-100/70 shadow-lg shadow-indigo-100/40">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">
            Step {step} of {steps.length}
          </p>
          <h3 className="font-display text-lg font-extrabold text-indigo-900">
            {steps[step - 1]}
          </h3>
        </div>

        {/* Progress Track */}
        <div className="relative mb-6">
          {/* Background Line */}
          <div className="absolute top-5 left-[12%] right-[12%] h-[3px] bg-slate-100 rounded-full"></div>

          {/* Active Progress Line */}
          <div
            className="absolute top-5 left-[12%] h-[3px] bg-indigo-brand rounded-full transition-all duration-700 ease-out shadow-sm shadow-indigo-brand/20"
            style={{ width: `${progressWidth * 0.76}%` }}
          ></div>

          {/* Animated Glow on Progress Line */}
          <div
            className="absolute top-[18px] left-[12%] h-[5px] bg-gradient-to-r from-indigo-400/0 via-indigo-400/30 to-indigo-400/0 rounded-full blur-sm transition-all duration-700 ease-out"
            style={{ width: `${progressWidth * 0.76}%` }}
          ></div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((label, index) => {
              const isActive = step === index + 1;
              const isCompleted = step > index + 1;
              const StepIcon = stepIcons[index];

              return (
                <div key={index} className="flex flex-col items-center group" style={{ width: `${100 / steps.length}%` }}>
                  {/* Circle Container */}
                  <div className="relative">
                    {isActive && (
                      <div className="absolute inset-0 -m-1.5 rounded-full bg-indigo-400/20 animate-ping"></div>
                    )}
                    {isActive && (
                      <div className="absolute inset-0 -m-2 rounded-full bg-indigo-200/40 blur-sm"></div>
                    )}

                    {/* Circle */}
                    <div
                      className={`
                        relative w-10 h-10 flex items-center justify-center rounded-full
                        text-sm font-bold transition-all duration-500 ease-out
                        ${
                          isCompleted
                            ? "bg-indigo-brand text-white shadow-lg shadow-indigo-brand/30 ring-[3px] ring-indigo-100 scale-100"
                            : isActive
                            ? "bg-white text-indigo-brand shadow-xl shadow-indigo-200/50 ring-[3px] ring-indigo-brand/60 scale-110"
                            : "bg-slate-50 text-slate-300 ring-2 ring-slate-200 scale-95"
                        }
                      `}
                    >
                      {isCompleted ? (
                        <svg className="w-5 h-5 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <StepIcon className={`${isActive ? "w-5 h-5" : "w-4 h-4"} transition-all duration-300`} />
                      )}
                    </div>
                  </div>

                  {/* Label */}
                  <div className="mt-3 text-center">
                    <p
                      className={`text-[11px] sm:text-xs font-bold tracking-wide transition-all duration-500 ${
                        isCompleted
                          ? "text-indigo-brand"
                          : isActive
                          ? "text-indigo-700"
                          : "text-slate-300"
                      }`}
                    >
                      {label}
                    </p>
                    {isCompleted && (
                      <p className="text-[9px] text-emerald-500 font-semibold mt-0.5 tracking-wider uppercase">
                        Done
                      </p>
                    )}
                    {isActive && (
                      <p className="text-[9px] text-saffron-600 font-semibold mt-0.5 tracking-wider uppercase">
                        Current
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progress</span>
            <span className="text-[11px] font-extrabold text-indigo-brand">
              {Math.round(progressWidth)}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-indigo-brand rounded-full transition-all duration-700 ease-out relative"
              style={{ width: `${progressWidth}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 animate-pulse rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StepIndicator;
