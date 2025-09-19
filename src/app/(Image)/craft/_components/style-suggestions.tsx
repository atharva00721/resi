"use client";

import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";
import {
  UserIcon,
  CameraIcon,
  PaletteIcon,
  SparklesIcon,
  Wand2Icon,
} from "lucide-react";

interface Preset {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  prompt: string;
}

interface StyleSuggestionsProps {
  selectedPreset: string | null;
  onPresetSelect: (preset: Preset) => void;
}

const presets: Preset[] = [
  {
    id: "portrait",
    name: "Portrait",
    description: "Professional headshots",
    icon: <UserIcon className="w-4 h-4" />,
    prompt:
      "Professional portrait photography, high quality, studio lighting, detailed facial features",
  },
  {
    id: "landscape",
    name: "Landscape",
    description: "Nature scenes",
    icon: <CameraIcon className="w-4 h-4" />,
    prompt:
      "Beautiful landscape photography, golden hour lighting, cinematic composition, high detail",
  },
  {
    id: "artistic",
    name: "Artistic",
    description: "Creative styles",
    icon: <PaletteIcon className="w-4 h-4" />,
    prompt:
      "Artistic interpretation, creative style, unique composition, vibrant colors",
  },
  {
    id: "fantasy",
    name: "Fantasy",
    description: "Magical themes",
    icon: <SparklesIcon className="w-4 h-4" />,
    prompt:
      "Fantasy art style, magical elements, ethereal lighting, dreamlike atmosphere",
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Clean & simple",
    icon: <Wand2Icon className="w-4 h-4" />,
    prompt:
      "Minimalist design, clean composition, simple elements, elegant simplicity",
  },
];

export function StyleSuggestions({
  selectedPreset,
  onPresetSelect,
}: StyleSuggestionsProps) {
  return (
    <div className="mt-4">
      <div className="mb-3">
        <h3 className="text-sm font-medium text-foreground mb-2 px-2">
          Quick Styles
        </h3>
        <Suggestions className="pl-2">
          {presets.map((preset) => (
            <Suggestion
              key={preset.id}
              suggestion={preset.name}
              onClick={() => onPresetSelect(preset)}
              variant={selectedPreset === preset.id ? "default" : "outline"}
              className="text-xs font-medium"
            >
              <div className="flex items-center gap-2">
                {preset.icon}
                {preset.name}
              </div>
            </Suggestion>
          ))}
        </Suggestions>
      </div>
    </div>
  );
}

export { presets };
export type { Preset };
