"use client";
import React from "react";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  steps: string[];
  currentIndex: number;
  onStepClick?: (index: number) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentIndex,
  onStepClick,
}) => {
  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-600 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Circles */}
      <div className="flex justify-between items-center gap-2">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <button
              type="button"
              onClick={() => onStepClick?.(index)}
              disabled={index > currentIndex}
              className={`w-10 h-10 rounded-full font-semibold flex items-center justify-center transition-all ${
                index < currentIndex
                  ? "bg-brand-600 text-white cursor-pointer hover:bg-brand-700"
                  : index === currentIndex
                    ? "bg-brand-600 text-white ring-2 ring-brand-300"
                    : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
              }`}
            >
              {index < currentIndex ? <Check className="w-5 h-5" /> : index + 1}
            </button>
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-2 text-center">
              {step}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
