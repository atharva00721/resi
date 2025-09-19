import { NextRequest, NextResponse } from "next/server";
import { BrandKitService } from "@/lib/brandkit-service";
import { getAuthenticatedUser } from "@/lib/auth-helpers";

// GET /api/brandkit/[id] - Get a specific brand kit
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();
    const { id } = await params;
    const brandKit = await BrandKitService.getById(id);

    if (!brandKit) {
      return NextResponse.json(
        { error: "Brand kit not found" },
        { status: 404 }
      );
    }

    if (brandKit.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ brandKit });
  } catch (error) {
    console.error("Error fetching brand kit:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Failed to fetch brand kit" },
      { status: 500 }
    );
  }
}

// PUT /api/brandkit/[id] - Update a brand kit
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();
    const { id } = await params;
    const body = await request.json();
    const {
      extractedFeatures,
      brandColors,
      audience,
      productVibes,
      brandPersonality,
      status,
    } = body;

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

    const brandKit = await BrandKitService.updateWithAIResults(id, {
      extractedFeatures,
      brandColors,
      audience,
      productVibes,
      brandPersonality,
      status,
    });

    return NextResponse.json({ brandKit });
  } catch (error) {
    console.error("Error updating brand kit:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Failed to update brand kit" },
      { status: 500 }
    );
  }
}

// DELETE /api/brandkit/[id] - Delete a brand kit
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();
    const { id } = await params;
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

    await BrandKitService.delete(id);

    return NextResponse.json({ message: "Brand kit deleted successfully" });
  } catch (error) {
    console.error("Error deleting brand kit:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Failed to delete brand kit" },
      { status: 500 }
    );
  }
}
