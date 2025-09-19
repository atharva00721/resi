import { NextRequest, NextResponse } from "next/server";
import { generateBrandKit } from "@/lib/ai/agents";
import type { BrandKitInput } from "@/lib/ai/agents/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { logo, title, description, productImages } = body || {};

    console.log("🚀 Brand Kit API called with:", {
      hasLogo: !!logo,
      title: title?.substring(0, 50) + "...",
      description: description?.substring(0, 50) + "...",
      imageCount: Array.isArray(productImages) ? productImages.length : 0,
    });

    if (
      !title ||
      !description ||
      !Array.isArray(productImages) ||
      productImages.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: title, description, and productImages",
        },
        { status: 400 }
      );
    }

    const input: BrandKitInput = {
      logo: typeof logo === "string" ? logo : undefined,
      title,
      description,
      productImages: productImages.filter(
        (u: unknown) => typeof u === "string"
      ),
    };

    console.log("📝 Calling generateBrandKit with input:", {
      hasLogo: !!input.logo,
      title: input.title,
      description: input.description.substring(0, 100) + "...",
      imageCount: input.productImages.length,
    });

    const result = await generateBrandKit(input);

    console.log("✅ Brand kit generation successful:", {
      brandColors: result.brandColors?.length || 0,
      extractedFeatures: result.extractedFeatures?.length || 0,
      hasAudience: !!result.audience,
      hasProductVibes: !!result.productVibes,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("❌ generate-brandkit error:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack"
    );

    return NextResponse.json(
      {
        error: "Failed to generate brand kit",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
