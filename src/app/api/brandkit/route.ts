import { NextRequest, NextResponse } from "next/server";
import { BrandKitService } from "@/lib/brandkit-service";
import { getAuthenticatedUser } from "@/lib/auth-helpers";

// GET /api/brandkit - Get all brand kits for the current user
export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    const brandKits = await BrandKitService.getByUserId(user.id);

    return NextResponse.json({ brandKits });
  } catch (error) {
    console.error("Error fetching brand kits:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Failed to fetch brand kits" },
      { status: 500 }
    );
  }
}

// POST /api/brandkit - Create a new brand kit
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();

    const body = await request.json();
    const {
      productTitle,
      productDescription,
      logoUrl,
      logoPreviewUrl,
      productImageUrls,
      productImagePreviewUrls,
    } = body;

    // Validate required fields
    if (!productTitle || !productDescription || !logoUrl) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: productTitle, productDescription, and logoUrl are required",
        },
        { status: 400 }
      );
    }

    const brandKit = await BrandKitService.create({
      userId: user.id,
      productTitle,
      productDescription,
      logoUrl,
      logoPreviewUrl,
      productImageUrls,
      productImagePreviewUrls,
    });

    return NextResponse.json({ brandKit }, { status: 201 });
  } catch (error) {
    console.error("Error creating brand kit:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Failed to create brand kit" },
      { status: 500 }
    );
  }
}
