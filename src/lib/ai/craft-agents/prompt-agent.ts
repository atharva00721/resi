import { streamText } from "ai";
import "dotenv/config";
import {
  withRetry,
  parseJsonFromStream,
  logApiCall,
  streamTextWithTimeout,
  getTimeoutConfig,
} from "../agents/utils";
import type { BrandTextGeneration } from "./vision-agent";

// Image editing instruction types
export interface ImageEditInstruction {
  action: "replace" | "add" | "remove";
  target: string; // Original text to find
  value: string; // New text to replace with
}

export interface ObjectReplacementInstruction {
  action: "replace_object";
  target: string; // Current object to find
  value: string; // New object to replace with
  reason: string; // Why this replacement makes sense
}

export interface ImageEditInstructions {
  textInstructions: ImageEditInstruction[];
  objectInstructions: ObjectReplacementInstruction[];
}

/**
 * Prompt Agent - Generates edit instructions for image editing services
 *
 * Takes the original and generated text from vision agent and creates
 * specific instructions for image editing services (nano-banana, etc.)
 */
export async function generateImageEditInstructions(
  brandTextData: BrandTextGeneration
): Promise<ImageEditInstructions> {
  console.log("📝 Step 1: Generating text replacement instructions...");

  // Generate text replacement instructions
  const textInstructions = await withRetry(async () => {
    logApiCall("Text Edit Instructions Generation");

    const timeoutConfig = getTimeoutConfig();

    const result = await streamTextWithTimeout(async () => {
      return await streamText({
        model: "openai/gpt-5-nano",
        prompt: `Generate image editing instructions to replace the original template text with the new brand text.

ORIGINAL TEXT ELEMENTS:
${brandTextData.original.textElements
  .map((el) => `- ${el.type} (position ${el.position}): "${el.content}"`)
  .join("\n")}

NEW BRAND TEXT ELEMENTS:
${brandTextData.generated.textElements
  .map((el) => `- ${el.type} (position ${el.position}): "${el.content}"`)
  .join("\n")}

INSTRUCTIONS:
- Create "replace" actions for each text element that needs to be changed
- Use the exact original text as the "target" (what to find in the image)
- Use the new brand text as the "value" (what to replace it with)
- Only include elements where the content actually changed
- Skip elements where original and new text are the same
- Make sure the target text matches exactly what's in the original template

Return ONLY a valid JSON object with this structure:

{
  "textInstructions": [
    {
      "action": "replace",
      "target": "exact original text from template",
      "value": "new brand text to replace with"
    }
  ]
}

Example:
{
  "textInstructions": [
    {
      "action": "replace",
      "target": "New Season Starting Soon",
      "value": "LostLetters Coming Soon"
    },
    {
      "action": "replace", 
      "target": "[ PARDON THE INTERRUPTION ]",
      "value": "[ SHARE YOUR STORY ANONYMOUSLY ]"
    }
  ]
}

Return ONLY the JSON object, no other text.`,
      });
    }, timeoutConfig.vision);

    let fullText = "";
    for await (const textPart of result.textStream) {
      fullText += textPart;
    }

    const instructions = parseJsonFromStream(fullText);
    return instructions.textInstructions || [];
  }, "Text Edit Instructions Generation");

  console.log("⏳ Waiting 30 seconds before object replacement analysis...");
  await new Promise((resolve) => setTimeout(resolve, 30000)); // 30 second delay

  console.log("🔄 Step 2: Generating object replacement instructions...");

  // Generate object replacement instructions if available
  let objectInstructions: ObjectReplacementInstruction[] = [];
  if (brandTextData.graphicAnalysis?.objectReplacements) {
    objectInstructions = brandTextData.graphicAnalysis.objectReplacements.map(
      (replacement) => ({
        action: "replace_object" as const,
        target: replacement.currentObject,
        value: replacement.suggestedReplacement,
        reason: replacement.reason,
      })
    );
  }

  console.log("⏳ Waiting 20 seconds before finalizing instructions...");
  await new Promise((resolve) => setTimeout(resolve, 20000)); // 20 second delay

  return {
    textInstructions,
    objectInstructions,
  };
}

/**
 * Complete workflow: Vision agent + Image edit instructions
 */
export async function createImageEditInstructions(
  templateUrl: string,
  brandKit: any
): Promise<{
  brandTextData: BrandTextGeneration;
  imageEditInstructions: ImageEditInstructions;
}> {
  console.log("🔍 Step 1: Analyzing template and generating brand text...");

  // Import the vision agent function
  const { analyzeTemplateForBrand } = await import("./vision-agent");
  const brandTextData = await analyzeTemplateForBrand(templateUrl, brandKit);

  console.log("🎨 Step 2: Generating image edit instructions...");
  const imageEditInstructions = await generateImageEditInstructions(
    brandTextData
  );

  return {
    brandTextData,
    imageEditInstructions,
  };
}

/**
 * Test function
 */
async function testPromptAgent() {
  console.log("🧪 Testing Prompt Agent...\n");

  try {
    const testImageUrl =
      "https://i.pinimg.com/1200x/9f/2b/55/9f2b559dd621b7b47afed272830f4615.jpg";

    console.log("🔍 Test Image URL:", testImageUrl);

    // Mock brand kit data
    const mockBrandKit = {
      id: "test-brand-kit",
      productTitle: "LostLetters",
      productDescription: "Share your story anonymously",
      brandColors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"],
      extractedFeatures: ["modern", "minimalist", "clean", "professional"],
      audience: "Young professionals and creative entrepreneurs",
      productVibes: "Fresh, innovative, and approachable with a modern edge",
      brandPersonality: "Friendly, professional, and inspiring",
      status: "COMPLETED",
      productImages: [],
    };
    console.log("🔍 Mock Brand Kit:", mockBrandKit);
    console.log("📸 Creating image edit instructions...");
    console.log("🎯 Product:", mockBrandKit.productTitle);
    console.log("⏳ This may take a few seconds...\n");

    const result = await createImageEditInstructions(
      testImageUrl,
      mockBrandKit
    );

    console.log("✅ Image Edit Instructions Generated!");
    console.log("📊 Brand Text Analysis:");
    console.log("=".repeat(50));
    result.brandTextData.original.textElements.forEach((element, i) => {
      console.log(
        `${i + 1}. [${element.type.toUpperCase()}] (pos: ${element.position})`
      );
      console.log(`   Original: "${element.content}"`);
    });

    console.log("\n🎨 Generated Brand Text:");
    console.log("=".repeat(50));
    result.brandTextData.generated.textElements.forEach((element, i) => {
      console.log(
        `${i + 1}. [${element.type.toUpperCase()}] (pos: ${element.position})`
      );
      console.log(`   Generated: "${element.content}"`);
    });

    console.log("\n🔧 Image Edit Instructions:");
    console.log("=".repeat(50));

    console.log("Text Instructions:");
    result.imageEditInstructions.textInstructions.forEach((instruction, i) => {
      console.log(
        `${i + 1}. ${instruction.action.toUpperCase()}: "${
          instruction.target
        }" → "${instruction.value}"`
      );
    });

    if (result.imageEditInstructions.objectInstructions.length > 0) {
      console.log("\nObject Instructions:");
      result.imageEditInstructions.objectInstructions.forEach(
        (instruction, i) => {
          console.log(
            `${i + 1}. ${instruction.action.toUpperCase()}: "${
              instruction.target
            }" → "${instruction.value}"`
          );
          console.log(`   Reason: ${instruction.reason}`);
        }
      );
    } else {
      console.log("\nNo object replacements suggested");
    }

    console.log("=".repeat(50));
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Run the test
testPromptAgent();
