// Input Types
export interface BrandKitInput {
  logo?: string; // Logo image URL
  title: string;
  description: string;
  productImages: string[]; // Array of product image URLs
}

// Output Types
export interface BrandKitOutput {
  brandColors: string[]; // Hex color codes
  extractedFeatures: string[]; // Key visual/design features
  audience: string; // Target audience description
  productVibes: string; // Small paragraph about product vibes
}

// Vision Agent Types (for product images)
export interface VisionAnalysisResult {
  brandColors: string[];
  extractedFeatures: string[];
  visualVibes: string;
}

// Text Agent Types (for logo, title, description)
export interface TextAnalysisResult {
  audience: string;
  brandPersonality: string;
  messagingVibes: string;
}
