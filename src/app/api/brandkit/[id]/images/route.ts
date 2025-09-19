import { NextRequest, NextResponse } from "next/server";
import { BrandKitService } from "@/lib/brandkit-service";
import { getAuthenticatedUser } from "@/lib/auth-helpers";

// PUT /api/brandkit/[id]/images - Update product images for a brand kit
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();
    const { id } = await params;

    const body = await request.json();
    const { productImageUrls, productImagePreviewUrls } = body;

    // Validate required fields
    if (!productImageUrls || !Array.isArray(productImageUrls)) {
      return NextResponse.json(
        { error: "productImageUrls is required and must be an array" },
        { status: 400 }
      );
    }

    // First check if brand kit exists and user owns it
    const existingBrandKit = await BrandKitService.getById(id);

    if (!existingBrandKit) {
      return NextResponse.json(
        { error: "Brand kit not found" },
        { status: 404 }
      );
    }

    if (existingBrandKit.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const brandKit = await BrandKitService.updateProductImages(
      id,
      productImageUrls,
      productImagePreviewUrls
    );

    return NextResponse.json({ brandKit });
  } catch (error) {
    console.error("Error updating product images:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Failed to update product images" },
      { status: 500 }
    );
  }
}
