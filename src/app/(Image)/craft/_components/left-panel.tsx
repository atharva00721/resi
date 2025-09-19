"use client";

import { ImageUpload } from "./image-upload";
import { PromptInputSection } from "./prompt-input-section";
import { AdvancedOptions } from "./advanced-options";
import type { Preset } from "./style-suggestions";
import { type FalModelKey } from "@/types/ai";

interface LeftPanelProps {
  uploadedImage: string | null;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  selectedPreset: string | null;
  onPresetSelect: (preset: Preset) => void;
  prompt: string;
  onPromptChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isGenerating: boolean;
  selectedModel: FalModelKey;
  onModelChange: (model: FalModelKey) => void;
  guidanceScale: number;
  onGuidanceScaleChange: (scale: number) => void;
  numInferenceSteps: number;
  onNumInferenceStepsChange: (steps: number) => void;
  safetyChecker: boolean;
  onSafetyCheckerChange: (enabled: boolean) => void;
  strength: number;
  onStrengthChange: (strength: number) => void;
  isVideoMode: boolean;
  onVideoModeToggle: (isVideo: boolean) => void;
}

export function LeftPanel({
  uploadedImage,
  onImageUpload,
  onRemoveImage,
  fileInputRef,
  selectedPreset,
  onPresetSelect,
  prompt,
  onPromptChange,
  onSubmit,
  isGenerating,
  selectedModel,
  onModelChange,
  guidanceScale,
  onGuidanceScaleChange,
  numInferenceSteps,
  onNumInferenceStepsChange,
  safetyChecker,
  onSafetyCheckerChange,
  strength,
  onStrengthChange,
  isVideoMode,
  onVideoModeToggle,
}: LeftPanelProps) {
  return (
    <div className="w-1/3 border-r bg-muted/30 flex flex-col">
      {/* Header */}
      <div className="border-b p-4">
        <h1 className="text-lg font-semibold">Image Craft</h1>
        <p className="text-sm text-muted-foreground">
          Create amazing images with AI
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Advanced Options */}
          <AdvancedOptions
            guidanceScale={guidanceScale}
            onGuidanceScaleChange={onGuidanceScaleChange}
            numInferenceSteps={numInferenceSteps}
            onNumInferenceStepsChange={onNumInferenceStepsChange}
            safetyChecker={safetyChecker}
            onSafetyCheckerChange={onSafetyCheckerChange}
            strength={strength}
            onStrengthChange={onStrengthChange}
            hasReferenceImage={!!uploadedImage}
          />

          {/* Image Upload */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">
              {uploadedImage
                ? "Reference Image (Edit Mode)"
                : "Reference Image (Optional)"}
            </h3>
            <ImageUpload
              uploadedImage={uploadedImage}
              onImageUpload={onImageUpload}
              onRemoveImage={onRemoveImage}
              fileInputRef={fileInputRef}
            />
            {uploadedImage && (
              <p className="text-xs text-muted-foreground">
                Click "Remove" to exit edit mode and create new images
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Input Area */}
      <div className="border-t p-4">
        <PromptInputSection
          selectedModel={selectedModel}
          onModelChange={onModelChange}
          isVideoMode={isVideoMode}
          onVideoModeToggle={onVideoModeToggle}
          prompt={prompt}
          onPromptChange={onPromptChange}
          onSubmit={onSubmit}
          isGenerating={isGenerating}
          uploadedImage={uploadedImage}
          onUploadClick={() => fileInputRef.current?.click()}
        />
      </div>
    </div>
  );
}
