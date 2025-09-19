// Domain types for AI image generation and providers

// JSON value type compatible with provider option contracts
export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

// Fal model keys supported by the app
export type FalModelKey = "imagen4-fast" | "nano-banana";

// Aspect ratios permitted by Imagen 4 preview
export type AspectRatio = "1:1" | "16:9" | "9:16" | "3:4" | "4:3";

// Request DTO from frontend to our API
export interface ImageGenerationRequest {
  prompt: string;
  model: FalModelKey;
  aspectRatio: AspectRatio;
  guidanceScale: number;
  numInferenceSteps: number;
  safetyChecker: boolean;
  imageUrl?: string;
  strength?: number;
}

// Subset of Fal provider metadata we consume
export interface FalImageMetadataItem {
  width?: number;
  height?: number;
  nsfw?: boolean;
}

export interface FalProviderMetadata {
  fal?: {
    images?: FalImageMetadataItem[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface ImageGenerationSuccessResponse {
  success: true;
  image: {
    base64: string;
    mimeType: string;
    width?: number;
    height?: number;
    nsfw?: boolean;
  };
  metadata?: FalProviderMetadata;
}

export interface ImageGenerationErrorResponse {
  success: false;
  error: string;
}

export type ImageGenerationResponse =
  | ImageGenerationSuccessResponse
  | ImageGenerationErrorResponse;

// Provider options for Fal
export interface FalCommonOptions extends Record<string, JSONValue> {
  aspect_ratio: AspectRatio;
  guidance_scale: number;
  num_inference_steps: number;
  safety_checker: boolean;
}

export interface FalEditOptions extends FalCommonOptions {
  image_urls: string[]; // nano-banana edit
}

export interface FalImg2ImgOptions extends FalCommonOptions {
  image_url: string; // non-edit img2img
  strength: number;
}

export type FalProviderOptions =
  | FalCommonOptions
  | FalEditOptions
  | FalImg2ImgOptions;
