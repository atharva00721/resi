"use client";

import { useEffect, useState, useRef } from "react";
import {
  Loader2,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Eye,
  Palette,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrandKitStepProps } from "@/types/brand-kit";

interface ProcessingStepProps extends BrandKitStepProps {
  onComplete: (result: any) => void;
}

export function StepProcessing({ data, onComplete }: ProcessingStepProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const hasStartedRef = useRef(false);

  const processingSteps = [
    {
      id: "vision",
      title: "Analyzing Product Images",
      description: "Extracting colors and visual features from your images",
      icon: Eye,
      duration: 15000, // 15 seconds
    },
    {
      id: "text",
      title: "Processing Brand Information",
      description: "Analyzing logo, title, and description for brand insights",
      icon: Palette,
      duration: 12000, // 12 seconds
    },
    {
      id: "aggregate",
      title: "Creating Brand Kit",
      description: "Combining all insights into your final brand kit",
      icon: Sparkles,
      duration: 10000, // 10 seconds
    },
  ];

  useEffect(() => {
    // Prevent multiple runs
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const processBrandKit = async () => {
      try {
        setError(null);

        // Simulate processing steps with realistic timing
        for (let i = 0; i < processingSteps.length; i++) {
          setCurrentStep(i);

          // Wait for the step duration
          await new Promise((resolve) =>
            setTimeout(resolve, processingSteps[i].duration)
          );
        }

        // Call the actual AI API
        const response = await fetch("/api/ai/generate-brandkit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            logo: data.logoPreview,
            title: data.productTitle,
            description: data.productDescription,
            productImages: data.productImagePreviews,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `Request failed: ${response.status}`
          );
        }

        const json = await response.json();
        const aiResult = json?.data;

        if (aiResult) {
          setResult(aiResult);
          setIsComplete(true);

          // Wait a moment to show completion, then proceed
          setTimeout(() => {
            onComplete(aiResult);
          }, 2000);
        } else {
          throw new Error("No data returned from AI");
        }
      } catch (err) {
        console.error("Processing error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to process brand kit"
        );
      }
    };

    processBrandKit();
  }, []); // Empty dependency array - only run once

  const currentStepData = processingSteps[currentStep];
  const CurrentIcon = currentStepData?.icon || Loader2;

  return (
    <div className="min-h-[600px] flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-semibold text-gray-900">
            Creating Your Brand Kit
          </h2>
          <p className="text-gray-600">
            Our AI is analyzing your brand elements to create a comprehensive
            brand kit
          </p>
        </div>

        {/* Processing Steps */}
        <div className="space-y-4">
          {processingSteps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const isPending = index > currentStep;

            return (
              <Card
                key={step.id}
                className={`transition-all duration-500 ${
                  isActive
                    ? "border-blue-500 bg-blue-50 shadow-lg"
                    : isCompleted
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : isCompleted
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : isActive ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <StepIcon className="w-6 h-6" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h3
                        className={`font-semibold transition-colors ${
                          isActive
                            ? "text-blue-900"
                            : isCompleted
                            ? "text-green-900"
                            : "text-gray-700"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p
                        className={`text-sm transition-colors ${
                          isActive
                            ? "text-blue-700"
                            : isCompleted
                            ? "text-green-700"
                            : "text-gray-500"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>

                    {isActive && (
                      <div className="text-right">
                        <div className="text-xs text-blue-600 font-medium">
                          Processing...
                        </div>
                        <div className="w-20 h-1 bg-blue-200 rounded-full mt-1">
                          <div className="w-full h-full bg-blue-600 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-900">
                    Processing Failed
                  </h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success State */}
        {isComplete && result && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-900">
                    Brand Kit Created!
                  </h3>
                  <p className="text-sm text-green-700 mt-1">
                    Found {result.brandColors?.length || 0} colors and{" "}
                    {result.extractedFeatures?.length || 0} features
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
