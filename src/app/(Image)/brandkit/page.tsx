"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Stepper,
  StepLogoForm,
  StepProductImages,
  StepProcessing,
  StepReview,
  BrandKitList,
} from "./_components";
import { BrandKitData } from "@/types/brand-kit";
import { useBrandKit } from "@/hooks/use-brandkit";

const steps = [
  "Logo & Details",
  "Product Images",
  "AI Processing",
  "Review & Edit",
];

const BrandkitPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    createBrandKit,
    updateBrandKitWithAI,
    updateBrandKitImages,
    loading,
  } = useBrandKit();

  const [currentStep, setCurrentStep] = useState(1);
  const [currentBrandKitId, setCurrentBrandKitId] = useState<string | null>(
    null
  );
  const [isCreating, setIsCreating] = useState(false);
  const [brandKitData, setBrandKitData] = useState<BrandKitData>({
    productTitle: "",
    productDescription: "",
    productImages: [],
    productImagePreviews: [],
    extractedFeatures: [],
    brandColors: [],
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const updateData = (updates: Partial<BrandKitData>) => {
    setBrandKitData((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = async () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Handle completion
      console.log("Brand kit setup completed!", brandKitData);
      alert("Brand kit setup completed! Check console for data.");
      setIsCreating(false);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const startNewBrandKit = () => {
    setIsCreating(true);
    setCurrentStep(1);
    setCurrentBrandKitId(null);
    setBrandKitData({
      productTitle: "",
      productDescription: "",
      productImages: [],
      productImagePreviews: [],
      extractedFeatures: [],
      brandColors: [],
    });
  };

  const handleStep1Complete = async (data: BrandKitData) => {
    try {
      console.log("Step 1 data:", data);

      // Validate that we have the required data
      if (!data.productTitle || !data.productDescription || !data.logoPreview) {
        alert("Please fill in all required fields and upload a logo.");
        return;
      }

      // Create brand kit in database after step 1
      const brandKit = await createBrandKit({
        productTitle: data.productTitle,
        productDescription: data.productDescription,
        logoUrl: data.logoPreview,
        logoPreviewUrl: data.logoPreview,
        productImageUrls: [], // Will be added in step 2
        productImagePreviewUrls: [],
      });

      setCurrentBrandKitId(brandKit.id);
      nextStep();
    } catch (error) {
      console.error("Failed to save brand kit:", error);
      alert("Failed to save brand kit. Please try again.");
    }
  };

  const handleStep2Complete = async (data: BrandKitData) => {
    try {
      // Update brand kit with product images
      if (currentBrandKitId && data.productImagePreviews.length > 0) {
        await updateBrandKitImages(
          currentBrandKitId,
          data.productImagePreviews,
          data.productImagePreviews // Using same URLs for both image and preview
        );
      }
      nextStep();
    } catch (error) {
      console.error("Failed to update brand kit:", error);
      alert("Failed to update brand kit. Please try again.");
    }
  };

  const handleProcessingComplete = async (aiResult: any) => {
    try {
      // Update the brand kit data with AI results
      updateData({
        extractedFeatures: aiResult.extractedFeatures || [],
        brandColors: aiResult.brandColors || [],
        audience: aiResult.audience,
        productVibes: aiResult.productVibes,
        brandPersonality: aiResult.brandPersonality,
      });

      // Save AI results to database
      if (currentBrandKitId) {
        await updateBrandKitWithAI(currentBrandKitId, {
          extractedFeatures: aiResult.extractedFeatures || [],
          brandColors: aiResult.brandColors || [],
          audience: aiResult.audience,
          productVibes: aiResult.productVibes,
          brandPersonality: aiResult.brandPersonality,
        });
      }

      nextStep();
    } catch (error) {
      console.error("Failed to save AI results:", error);
      alert("Failed to save AI results. Please try again.");
    }
  };

  const renderCurrentStep = () => {
    const stepProps = {
      data: brandKitData,
      updateData,
      onNext: nextStep,
      onPrevious: previousStep,
    };

    switch (currentStep) {
      case 1:
        return <StepLogoForm {...stepProps} onComplete={handleStep1Complete} />;
      case 2:
        return (
          <StepProductImages {...stepProps} onComplete={handleStep2Complete} />
        );
      case 3:
        return (
          <StepProcessing
            {...stepProps}
            onComplete={handleProcessingComplete}
          />
        );
      case 4:
        return <StepReview {...stepProps} />;
      default:
        return <StepLogoForm {...stepProps} onComplete={handleStep1Complete} />;
    }
  };

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        {!isCreating ? (
          // Show brand kit list
          <div className="p-8">
            <div className="max-w-6xl mx-auto">
              <BrandKitList onNewBrandKit={startNewBrandKit} />
            </div>
          </div>
        ) : (
          // Show brand kit creation flow
          <>
            {/* Header */}
            <div className="border-b bg-white px-6 py-8">
              <div className="max-w-4xl">
                <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                  Brand Kit Setup
                </h1>
                <p className="text-gray-600">
                  Create your brand kit in 3 simple steps
                </p>
              </div>
            </div>

            <div className="flex">
              {/* Sidebar Stepper */}
              <div className="w-80 bg-white border-r min-h-[calc(100vh-120px)]">
                <Stepper
                  currentStep={currentStep}
                  totalSteps={steps.length}
                  steps={steps}
                />
              </div>

              {/* Main Content */}
              <div className="flex-1 p-8">
                <div className="max-w-4xl mx-auto">{renderCurrentStep()}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BrandkitPage;
