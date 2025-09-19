import { createFal } from "@ai-sdk/fal";
import { experimental_generateImage as generateImage } from "ai";
import type { AspectRatio, FalModelKey, FalProviderOptions } from "@/types/ai";

// Create Fal provider instance
export const fal = createFal({
  apiKey: process.env.FAL_API_KEY,
});

// Available Fal AI models for image generation
export const FAL_MODELS: Record<FalModelKey, string> = {
  "imagen4-fast": "fal-ai/imagen4/preview/fast",
  "nano-banana": "fal-ai/nano-banana",
} as const;

// Aspect ratios permitted by current Fal Imagen 4 preview API
export const ASPECT_RATIOS: readonly AspectRatio[] = [
  "1:1",
  "16:9",
  "9:16",
  "3:4",
  "4:3",
] as const;

// Image generation options
export interface ImageGenerationOptions {
  prompt: string;
  model: FalModelKey;
  aspectRatio?: AspectRatio;
  guidanceScale?: number;
  numInferenceSteps?: number;
  safetyChecker?: boolean;
  imageUrl?: string; // For image-to-image generation
  strength?: number; // For image-to-image generation
}

// Generate image using Fal AI
export async function generateFalImage(options: ImageGenerationOptions) {
  const {
    prompt,
    model,
    aspectRatio = "1:1",
    guidanceScale = 7.5,
    numInferenceSteps = 20,
    safetyChecker = true,
    imageUrl,
    strength = 0.8,
  } = options;

  // If a reference image is provided, always use nano-banana edit endpoint
  const modelId = imageUrl ? "fal-ai/nano-banana/edit" : FAL_MODELS[model];

  const providerOptions: FalProviderOptions = {
    aspect_ratio: aspectRatio,
    guidance_scale: guidanceScale,
    num_inference_steps: numInferenceSteps,
    safety_checker: safetyChecker,
  };

  // Add image-to-image options if imageUrl is provided
  if (imageUrl) {
    (
      providerOptions as Extract<FalProviderOptions, { image_urls: string[] }>
    ).image_urls = [imageUrl];
  }

  try {
    const result = await generateImage({
      model: fal.image(modelId),
      prompt,
      providerOptions: { fal: providerOptions },
    });

    return {
      success: true,
      image: result.image,
      metadata: result.providerMetadata,
    };
  } catch (error) {
    console.error("Fal AI image generation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// Get model information
export function getModelInfo(modelKey: FalModelKey) {
  const modelDescriptions = {
    "imagen4-fast":
      "Google Imagen 4 fast preview model for high-quality image generation",
    "nano-banana": "Nano Banana model for fast and efficient image generation",
  };

  return {
    id: modelKey,
    name: FAL_MODELS[modelKey],
    description: modelDescriptions[modelKey],
  };
}
