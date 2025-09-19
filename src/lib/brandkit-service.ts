import { prisma } from "@/lib/prisma";
import { BrandKitData } from "@/types/brand-kit";

export interface CreateBrandKitData {
  userId: string;
  productTitle: string;
  productDescription: string;
  logoUrl: string;
  logoPreviewUrl?: string;
  productImageUrls?: string[];
  productImagePreviewUrls?: string[];
}

export interface UpdateBrandKitData {
  extractedFeatures?: string[];
  brandColors?: string[];
  audience?: string;
  productVibes?: string;
  brandPersonality?: string;
  status?: "DRAFT" | "PROCESSING" | "COMPLETED" | "ARCHIVED";
}

export class BrandKitService {
  // Create a new brand kit
  static async create(data: CreateBrandKitData) {
    const brandKit = await prisma.brandKit.create({
      data: {
        userId: data.userId,
        productTitle: data.productTitle,
        productDescription: data.productDescription,
        logoUrl: data.logoUrl,
        logoPreviewUrl: data.logoPreviewUrl,
        productImages: {
          create: (data.productImageUrls || []).map((url, index) => ({
            imageUrl: url,
            previewUrl: data.productImagePreviewUrls?.[index],
            order: index,
          })),
        },
      },
      include: {
        productImages: true,
      },
    });

    return brandKit;
  }

  // Update brand kit with AI results
  static async updateWithAIResults(
    brandKitId: string,
    data: UpdateBrandKitData
  ) {
    const brandKit = await prisma.brandKit.update({
      where: { id: brandKitId },
      data: {
        extractedFeatures: data.extractedFeatures,
        brandColors: data.brandColors,
        audience: data.audience,
        productVibes: data.productVibes,
        brandPersonality: data.brandPersonality,
        status: data.status,
      },
      include: {
        productImages: true,
      },
    });

    return brandKit;
  }

  // Update brand kit with product images
  static async updateProductImages(
    brandKitId: string,
    productImageUrls: string[],
    productImagePreviewUrls?: string[]
  ) {
    // First, delete existing product images
    await prisma.productImage.deleteMany({
      where: { brandKitId },
    });

    // Then create new ones
    const productImages = await prisma.productImage.createMany({
      data: productImageUrls.map((url, index) => ({
        brandKitId,
        imageUrl: url,
        previewUrl: productImagePreviewUrls?.[index],
        order: index,
      })),
    });

    // Return updated brand kit
    return this.getById(brandKitId);
  }

  // Get brand kit by ID
  static async getById(brandKitId: string) {
    const brandKit = await prisma.brandKit.findUnique({
      where: { id: brandKitId },
      include: {
        productImages: {
          orderBy: { order: "asc" },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return brandKit;
  }

  // Get all brand kits for a user
  static async getByUserId(userId: string) {
    const brandKits = await prisma.brandKit.findMany({
      where: { userId },
      include: {
        productImages: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return brandKits;
  }

  // Update brand kit status
  static async updateStatus(
    brandKitId: string,
    status: "DRAFT" | "PROCESSING" | "COMPLETED" | "ARCHIVED"
  ) {
    const brandKit = await prisma.brandKit.update({
      where: { id: brandKitId },
      data: { status },
    });

    return brandKit;
  }

  // Delete brand kit
  static async delete(brandKitId: string) {
    await prisma.brandKit.delete({
      where: { id: brandKitId },
    });
  }

  // Convert BrandKitData to database format
  static convertToCreateData(
    userId: string,
    brandKitData: BrandKitData,
    uploadedUrls: {
      logoUrl?: string;
      logoPreviewUrl?: string;
      productImageUrls: string[];
      productImagePreviewUrls?: string[];
    }
  ): CreateBrandKitData {
    if (!uploadedUrls.logoUrl) {
      throw new Error("Logo URL is required");
    }

    return {
      userId,
      productTitle: brandKitData.productTitle,
      productDescription: brandKitData.productDescription,
      logoUrl: uploadedUrls.logoUrl,
      logoPreviewUrl: uploadedUrls.logoPreviewUrl,
      productImageUrls: uploadedUrls.productImageUrls,
      productImagePreviewUrls: uploadedUrls.productImagePreviewUrls,
    };
  }

  // Convert database result to BrandKitData format
  static convertToBrandKitData(brandKit: any): BrandKitData {
    return {
      productTitle: brandKit.productTitle,
      productDescription: brandKit.productDescription,
      logoPreview: brandKit.logoPreviewUrl,
      productImages: [], // File objects are not stored in database
      productImagePreviews: brandKit.productImages.map(
        (img: any) => img.previewUrl || img.imageUrl
      ),
      extractedFeatures: brandKit.extractedFeatures || [],
      brandColors: brandKit.brandColors || [],
      audience: brandKit.audience,
      productVibes: brandKit.productVibes,
      brandPersonality: brandKit.brandPersonality,
    };
  }
}
