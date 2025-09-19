import { streamText } from "ai";
import "dotenv/config";
import type { TextAnalysisResult, VisionAnalysisResult } from "./types";
import {
  withRetry,
  parseJsonFromStream,
  logApiCall,
  streamTextWithTimeout,
  getTimeoutConfig,
} from "./utils";

/**
 * Text Agent - Analyzes logo, title, and description for brand insights
 *
 * This agent analyzes text and logo information to understand:
 * - Target audience
 * - Brand personality
 * - Messaging vibes
 */
export async function analyzeBrandText(
  logo: string | undefined,
  title: string,
  description: string,
  visionAnalysis?: VisionAnalysisResult
): Promise<TextAnalysisResult> {
  return withRetry(async () => {
    logApiCall("Text Agent");

    const logoContext = logo ? `\nLogo: ${logo}` : "";
    const visionContext = visionAnalysis
      ? `\n\nVisual Analysis Context:
      - Visual Vibes: ${visionAnalysis.visualVibes}
      - Brand Colors: ${visionAnalysis.brandColors.join(", ")}`
      : "";

    const timeoutConfig = getTimeoutConfig();

    const result = await streamTextWithTimeout(async () => {
      return await streamText({
        model: "openai/gpt-5-nano",
        prompt: `Analyze this brand information to understand the target audience and brand personality. Return ONLY a valid JSON object with the following structure:

{
  "audience": "Detailed description of the target audience",
  "brandPersonality": "Key personality traits and characteristics",
  "messagingVibes": "Brief description of the messaging tone and vibe"
}

Brand Information:
Title: ${title}
Description: ${description}${logoContext}${visionContext}

Analyze:
1. Target audience (who would buy/use this product based on title, description, and logo)
2. Brand personality (what traits and characteristics define this brand)
3. Messaging vibes (what tone and feeling should the messaging convey)

Focus on understanding who the product is for and what personality it should project.

Return ONLY the JSON object, no other text.`,
      });
    }, timeoutConfig.text);

    let fullText = "";
    for await (const textPart of result.textStream) {
      fullText += textPart;
    }

    // Parse the JSON response with better error handling
    const analysis = parseJsonFromStream(fullText);
    return analysis as TextAnalysisResult;
  }, "Text Analysis");
}
