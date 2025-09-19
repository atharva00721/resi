"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export function Stepper({ currentStep, totalSteps, steps }: StepperProps) {
  return (
    <div className="p-8">
      <div className="space-y-8">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <div key={stepNumber} className="flex items-start space-x-4">
              {/* Step Circle */}
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all duration-200 flex-shrink-0",
                  {
                    "bg-blue-600 border-blue-600 text-white":
                      isCompleted || isCurrent,
                    "bg-white border-gray-300 text-gray-400": isUpcoming,
                  }
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : stepNumber}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <p
                  className={cn("text-sm font-medium transition-colors", {
                    "text-gray-900": isCurrent,
                    "text-gray-600": isCompleted,
                    "text-gray-400": isUpcoming,
                  })}
                >
                  {step}
                </p>
                {isCurrent && (
                  <p className="text-xs text-gray-500 mt-1">
                    {stepNumber === 1 &&
                      "Upload your logo and enter product details"}
                    {stepNumber === 2 &&
                      "Add multiple product images for AI processing"}
                    {stepNumber === 3 && "Review and finalize your brand kit"}
                  </p>
                )}
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn("absolute left-4 w-0.5 h-8 transition-colors", {
                    "bg-blue-600": stepNumber < currentStep,
                    "bg-gray-200": stepNumber >= currentStep,
                  })}
                  style={{ top: "2rem" }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Summary */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium text-gray-900">
            {currentStep} of {totalSteps}
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
