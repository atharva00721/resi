import { generateFalImage, type ImageGenerationOptions } from "../fal";

// Image editing types
export interface ImageEditResult {
  prompt: string;
  imageUrl: string;
  editedImage: Uint8Array;
  filename: string;
  status: "edited";
  metadata?: any;
}

/**
 * Image Gen Agent - Edits images using FAL AI nano-banana edit
 *
 * This agent:
 * - Takes a prompt and image URL from master agent
 * - Edits the image using FAL AI nano-banana edit model
 * - Returns the edited image
 */
export async function editImageWithPrompt(
  prompt: string,
  imageUrl: string,
  options?: Partial<ImageGenerationOptions>
): Promise<ImageEditResult> {
  try {
    console.log("🎨 Editing image with FAL AI (nano-banana edit)...");
    console.log("📝 Edit prompt:", prompt);
    console.log("🖼️  Source image:", imageUrl);

    const editOptions: ImageGenerationOptions = {
      prompt,
      model: "nano-banana",
      imageUrl,
      safetyChecker: true,
      ...options,
    };

    const result = await generateFalImage(editOptions);

    if (!result.success || !result.image) {
      throw new Error(result.error || "Image editing failed");
    }

    const filename = `edited-image-${Date.now()}.png`;
    const imageBuffer = await result.image.uint8Array;

    console.log(`✅ Image edited and saved as ${filename}`);

    return {
      prompt,
      imageUrl,
      editedImage: imageBuffer,
      filename,
      status: "edited",
      metadata: result.metadata,
    };
  } catch (error) {
    console.error("❌ Image editing failed:", error);
    throw error;
  }
}

/**
 * Test function
 */
async function testImageGenAgent() {
  console.log("🧪 Testing Image Edit Agent...\n");

  try {
    const testPrompt = `{
  "instructions": [
    {
      "action": "replace",
      "target": "New Season\\nStarting Soon",
      "value": "A fresh season of stories is on its way."
    },
    {
      "action": "replace",
      "target": "[ PARDON THE INTERRUPTION ]",
      "value": "[ JUST A MOMENT ]"
    },
    {
      "action": "replace",
      "target": "[ REGULAR SCHEDULED PROGRAMMING WILL RESUME SHORTLY ]",
      "value": "[ WE'LL BE BACK SHORTLY ]"
    }
  ]
}`;
    const testImageUrl =
      "https://i.pinimg.com/736x/6b/0d/01/6b0d01ac26456e0939af4d89a0240020.jpg"; // Higher resolution version

    console.log("🖼️  Editing test image...");
    console.log("⏳ This may take a few seconds...\n");

    const result = await editImageWithPrompt(testPrompt, testImageUrl);

    console.log("✅ Image Editing complete!");
    console.log("📊 Results:");
    console.log("=".repeat(50));
    console.log("Edit Prompt:", result.prompt);
    console.log("Source Image:", result.imageUrl);
    console.log("Edited Filename:", result.filename);
    console.log("Status:", result.status);
    console.log("=".repeat(50));
  } catch (error) {
    console.error("❌ Image Edit Agent test failed:", error);
  }
}

// Run the test
testImageGenAgent();
