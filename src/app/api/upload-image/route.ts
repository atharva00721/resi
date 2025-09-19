import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to base64 for UploadThing API
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const base64DataUrl = `data:${file.type};base64,${base64}`;

    // Call UploadThing API directly
    const uploadResponse = await fetch(
      "https://api.uploadthing.com/api/uploadFiles",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.UPLOADTHING_TOKEN}`,
        },
        body: JSON.stringify({
          files: [
            {
              name: file.name,
              type: file.type,
              size: file.size,
              data: base64DataUrl,
            },
          ],
          routeSlug: "imageUploader",
        }),
      }
    );

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(
        `UploadThing API error: ${uploadResponse.status} ${errorText}`
      );
    }

    const result = await uploadResponse.json();

    if (
      result &&
      Array.isArray(result) &&
      result.length > 0 &&
      (result[0].ufsUrl || result[0].url)
    ) {
      return NextResponse.json({
        success: true,
        url: result[0].ufsUrl || result[0].url,
      });
    } else {
      return NextResponse.json(
        { error: "Upload failed - no URL returned from UploadThing" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
