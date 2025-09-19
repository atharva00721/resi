import { streamText } from "ai";
import "dotenv/config";
import type { VisionAnalysisResult } from "./types";
import {
  withRetry,
  parseJsonFromStream,
  logApiCall,
  streamTextWithTimeout,
  getTimeoutConfig,
} from "./utils";

/**
 * Vision Agent - Analyzes product images for brand colors and features
 *
 * This agent extracts visual elements from product images:
 * - Brand colors (hex codes)
 * - Key visual features and design elements
 * - Visual vibes and aesthetic
 */
export async function analyzeProductImages(
  productImages: string[]
): Promise<VisionAnalysisResult> {
  return withRetry(async () => {
    logApiCall("Vision Agent");

    const imagesList = productImages
      .map((url, index) => `Image ${index + 1}: ${url}`)
      .join("\n");

    const timeoutConfig = getTimeoutConfig();

    const result = await streamTextWithTimeout(async () => {
      return await streamText({
        model: "openai/gpt-5-nano",
        prompt: `Analyze these product images for brand kit creation. Extract and return ONLY a valid JSON object with the following structure:

{
  "brandColors": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"],
  "extractedFeatures": ["feature1", "feature2", "feature3", "feature4"],
  "visualVibes": "Brief description of the overall visual aesthetic and vibe"
}

Extract from ALL images:
1. Brand colors (5-7 hex color codes that represent the product's visual identity)
2. Key visual features and design elements (4-6 specific features)
3. Visual vibes (1-2 sentence description of the overall aesthetic)

Focus on:
- Colors that would work well for a brand identity
- Distinctive visual elements that define the product
- The overall aesthetic and feeling the images convey

Product Images:
${imagesList}

Return ONLY the JSON object, no other text.`,
      });
    }, timeoutConfig.vision);

    let fullText = "";
    for await (const textPart of result.textStream) {
      fullText += textPart;
    }

    // Parse the JSON response with better error handling
    const analysis = parseJsonFromStream(fullText);
    return analysis as VisionAnalysisResult;
  }, "Vision Analysis");
}
