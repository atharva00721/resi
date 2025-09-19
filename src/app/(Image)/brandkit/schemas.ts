import { z } from "zod";

// File validation helper - more flexible for react-hook-form
const imageFileSchema = z
  .any()
  .refine((file) => file instanceof File, {
    message: "Please select a file",
  })
  .refine(
    (file) => {
      if (!file) return false;
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/svg+xml",
      ];
      return allowedTypes.includes(file.type);
    },
    {
      message: "File must be PNG, JPG, or SVG",
    }
  );

// Step 1: Logo & Product Details Schema
export const step1Schema = z.object({
  logo: imageFileSchema,
  productTitle: z
    .string()
    .min(1, "Product title is required")
    .max(100, "Product title must be 100 characters or less"),
  productDescription: z
    .string()
    .min(1, "Product description is required")
    .max(500, "Product description must be 500 characters or less"),
});

// Step 2: Product Images Schema
export const step2Schema = z.object({
  productImages: z
    .array(imageFileSchema)
    .min(1, "At least one product image is required")
    .max(10, "Maximum 10 product images allowed"),
});

// Hex color validation helper
const hexColorSchema = z
  .string()
  .regex(
    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    "Must be a valid hex color (e.g., #FF0000)"
  );

// Step 3: Review Schema
export const step3Schema = z.object({
  extractedFeatures: z.array(z.string()),
  brandColors: z
    .array(hexColorSchema)
    .min(1, "At least one brand color is required"),
});

// Complete Brand Kit Schema (for final validation)
export const brandKitSchema = z.object({
  logo: imageFileSchema,
  logoPreview: z.string().optional(),
  productTitle: z
    .string()
    .min(1, "Product title is required")
    .max(100, "Product title must be 100 characters or less"),
  productDescription: z
    .string()
    .min(1, "Product description is required")
    .max(500, "Product description must be 500 characters or less"),
  productImages: z
    .array(imageFileSchema)
    .min(1, "At least one product image is required")
    .max(10, "Maximum 10 product images allowed"),
  productImagePreviews: z.array(z.string()).optional(),
  extractedFeatures: z.array(z.string()).optional(),
  brandColors: z
    .array(hexColorSchema)
    .min(1, "At least one brand color is required"),
});

// Type exports for TypeScript
export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type BrandKitData = z.infer<typeof brandKitSchema>;
