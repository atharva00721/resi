// Updated interface with AI insights
export interface BrandKitData {
  // Step 1: Logo and Product Details
  logo?: File;
  logoPreview?: string;
  productTitle: string;
  productDescription: string;

  // Step 2: Product Images
  productImages: File[];
  productImagePreviews: string[];

  // Step 3: AI-Generated Data
  extractedFeatures: string[];
  brandColors: string[];

  // Additional AI-generated insights (optional)
  audience?: string;
  productVibes?: string;
  brandPersonality?: string;
}

// Database/API BrandKit interface (for fetched data)
export interface BrandKit {
  id: string;
  productTitle: string;
  productDescription: string;
  brandColors: string[];
  extractedFeatures: string[];
  audience?: string;
  productVibes?: string;
  brandPersonality?: string;
  status: "DRAFT" | "PROCESSING" | "COMPLETED" | "ARCHIVED";
  productImages: Array<{
    id: string;
    imageUrl: string;
    previewUrl?: string;
    order: number;
  }>;
}

export interface BrandKitStepProps {
  data: BrandKitData;
  updateData: (updates: Partial<BrandKitData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}
