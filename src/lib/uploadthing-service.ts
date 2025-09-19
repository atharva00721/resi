// UploadThing service for uploading images when user submits the form

export interface UploadResult {
  success: boolean;
  url?: string; // kept for backward compatibility
  ufsUrl?: string;
  error?: string;
}

export async function uploadImageToUploadThing(
  base64Data: string
): Promise<UploadResult> {
  try {
    // Extract the base64 data and mime type
    const [header, data] = base64Data.split(",");
    const mimeType = header.match(/data:([^;]+)/)?.[1] || "image/png";
    const extension = mimeType.split("/")[1] || "png";

    // Convert base64 to blob
    const response = await fetch(base64Data);
    const blob = await response.blob();

    // Create a File object from the blob
    const file = new File([blob], `image.${extension}`, { type: mimeType });

    // Create FormData for UploadThing
    const formData = new FormData();
    formData.append("file", file);

    // Upload to our custom upload API route
    const uploadResponse = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(
        `Failed to upload to UploadThing: ${uploadResponse.status} ${errorText}`
      );
    }

    const result = await uploadResponse.json();

    // UploadThing returns an array of uploaded files
    if (
      result &&
      Array.isArray(result) &&
      result.length > 0 &&
      (result[0].ufsUrl || result[0].url)
    ) {
      return {
        success: true,
        url: result[0].ufsUrl || result[0].url,
        ufsUrl: result[0].ufsUrl || result[0].url,
      };
    } else {
      return {
        success: false,
        error: "Upload failed - no URL returned from UploadThing",
      };
    }
  } catch (error) {
    console.error("Error uploading image to UploadThing:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error during UploadThing upload",
    };
  }
}
