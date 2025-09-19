import { NextRequest, NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";
import { generateFalImage, type ImageGenerationOptions } from "@/lib/ai/fal";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      prompt,
      model = "imagen4-fast",
      aspectRatio = "1:1",
      guidanceScale = 7.5,
      numInferenceSteps = 20,
      safetyChecker = true,
      imageUrl,
      strength = 0.8,
    } = body;

    // Validate required fields
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required and must be a string" },
        { status: 400 }
      );
    }

    // Validate model
    const validModels = Object.keys({
      "imagen4-fast": "fal-ai/imagen4/preview/fast",
      "nano-banana": "fal-ai/nano-banana",
    });

    if (!validModels.includes(model)) {
      return NextResponse.json(
        { error: "Invalid model specified" },
        { status: 400 }
      );
    }

    // Validate aspect ratio per Fal Imagen 4
    const validAspectRatios = ["1:1", "16:9", "9:16", "3:4", "4:3"];

    if (!validAspectRatios.includes(aspectRatio)) {
      return NextResponse.json(
        { error: "Invalid aspect ratio specified" },
        { status: 400 }
      );
    }

    // Validate numeric parameters
    if (guidanceScale < 1 || guidanceScale > 20) {
      return NextResponse.json(
        { error: "Guidance scale must be between 1 and 20" },
        { status: 400 }
      );
    }

    if (numInferenceSteps < 1 || numInferenceSteps > 50) {
      return NextResponse.json(
        { error: "Number of inference steps must be between 1 and 50" },
        { status: 400 }
      );
    }

    if (strength < 0 || strength > 1) {
      return NextResponse.json(
        { error: "Strength must be between 0 and 1" },
        { status: 400 }
      );
    }

    const options: ImageGenerationOptions = {
      prompt,
      model,
      aspectRatio,
      guidanceScale,
      numInferenceSteps,
      safetyChecker,
      imageUrl, // This will be the UploadThing URL
      strength,
    };

    const result = await generateFalImage(options);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Image generation failed" },
        { status: 500 }
      );
    }

    // Convert image to base64 for response
    if (!result.image) {
      return NextResponse.json(
        { error: "No image generated" },
        { status: 500 }
      );
    }

    const imageBuffer = await result.image.uint8Array;
    const base64Image = Buffer.from(imageBuffer).toString("base64");
    const mimeType = "image/png"; // Fal AI typically returns PNG images

    // Save generated image to UploadThing automatically
    const utapi = new UTApi();
    const fileName = `fal-${Date.now()}.png`;
    // Create a Web File for UploadThing
    const uploadFile = new File([imageBuffer], fileName, { type: mimeType });
    const uploaded = await utapi.uploadFiles([uploadFile]);
    const uploadedItem = uploaded?.data?.[0] as
      | { url?: string; ufsUrl?: string }
      | undefined;
    const storageUrl = uploadedItem?.ufsUrl || uploadedItem?.url;

    // Safely access metadata
    const falMetadata = result.metadata?.fal as any;
    const imageMetadata = falMetadata?.images?.[0];

    return NextResponse.json({
      success: true,
      image: {
        base64: base64Image,
        mimeType,
        width: imageMetadata?.width,
        height: imageMetadata?.height,
        nsfw: imageMetadata?.nsfw,
        storageUrl,
      },
      metadata: result.metadata,
    });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Fal AI Image Generation API",
    availableModels: Object.keys({
      "imagen4-fast": "fal-ai/imagen4/preview/fast",
      "nano-banana": "fal-ai/nano-banana",
    }),
    aspectRatios: ["1:1", "16:9", "9:16", "3:4", "4:3"],
  });
}
