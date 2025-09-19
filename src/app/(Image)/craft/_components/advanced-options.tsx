"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { type AspectRatio } from "@/types/ai";

interface AdvancedOptionsProps {
  guidanceScale: number;
  onGuidanceScaleChange: (scale: number) => void;
  numInferenceSteps: number;
  onNumInferenceStepsChange: (steps: number) => void;
  safetyChecker: boolean;
  onSafetyCheckerChange: (enabled: boolean) => void;
  strength: number;
  onStrengthChange: (strength: number) => void;
  hasReferenceImage: boolean;
}

const aspectRatioOptions = [
  { value: "1:1", label: "1:1 (Square)", description: "1024x1024" },
  { value: "16:9", label: "16:9 (Landscape)", description: "1920x1080" },
  { value: "9:16", label: "9:16 (Portrait)", description: "1080x1920" },
  { value: "4:3", label: "4:3 (Landscape)", description: "1366x1024" },
  { value: "3:4", label: "3:4 (Portrait)", description: "1024x1366" },
  { value: "16:10", label: "16:10 (Landscape)", description: "1280x800" },
  { value: "10:16", label: "10:16 (Portrait)", description: "800x1280" },
  { value: "21:9", label: "21:9 (Ultrawide)", description: "2560x1080" },
  { value: "9:21", label: "9:21 (Tall)", description: "1080x2560" },
] as const;

export function AdvancedOptions({
  guidanceScale,
  onGuidanceScaleChange,
  numInferenceSteps,
  onNumInferenceStepsChange,
  safetyChecker,
  onSafetyCheckerChange,
  strength,
  onStrengthChange,
  hasReferenceImage,
}: AdvancedOptionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Advanced Options</CardTitle>
        <CardDescription>
          Fine-tune your image generation parameters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Aspect Ratio removed: Fal response will define final dimensions */}

        {/* Guidance Scale */}
        <div className="space-y-2">
          <Label htmlFor="guidance-scale">
            Guidance Scale: {guidanceScale}
          </Label>
          <Slider
            id="guidance-scale"
            min={1}
            max={20}
            step={0.5}
            value={[guidanceScale]}
            onValueChange={([value]) => onGuidanceScaleChange(value)}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Controls how closely the model follows your prompt. Higher values =
            more adherence to prompt.
          </p>
        </div>

        {/* Number of Inference Steps */}
        <div className="space-y-2">
          <Label htmlFor="inference-steps">
            Inference Steps: {numInferenceSteps}
          </Label>
          <Slider
            id="inference-steps"
            min={1}
            max={50}
            step={1}
            value={[numInferenceSteps]}
            onValueChange={([value]) => onNumInferenceStepsChange(value)}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            More steps = higher quality but slower generation. 20-30 is usually
            optimal.
          </p>
        </div>

        {/* Safety Checker */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="safety-checker">Safety Checker</Label>
            <p className="text-xs text-muted-foreground">
              Automatically filter inappropriate content
            </p>
          </div>
          <Switch
            id="safety-checker"
            checked={safetyChecker}
            onCheckedChange={onSafetyCheckerChange}
          />
        </div>

        {/* Strength (only show if reference image is present) */}
        {hasReferenceImage && (
          <div className="space-y-2">
            <Label htmlFor="strength">
              Image Influence: {Math.round(strength * 100)}%
            </Label>
            <Slider
              id="strength"
              min={0}
              max={1}
              step={0.1}
              value={[strength]}
              onValueChange={([value]) => onStrengthChange(value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              How much the reference image influences the output. 0 = ignore
              image, 1 = copy image.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
