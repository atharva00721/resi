import { streamText } from "ai";
import "dotenv/config";
import type {
  BrandKitOutput,
  VisionAnalysisResult,
  TextAnalysisResult,
} from "./types";
import {
  withRetry,
  parseJsonFromStream,
  logApiCall,
  streamTextWithTimeout,
  getTimeoutConfig,
} from "./utils";

/**
 * Aggregator Agent - Combines vision and text analysis into focused brand kit output
 *
 * This agent creates the final brand kit with:
 * - Brand colors from visual analysis
 * - Extracted features from visual analysis
 * - Target audience from text analysis
 * - Product vibes combining both analyses
 */
export async function aggregateBrandKit(
  visionAnalysis: VisionAnalysisResult,
  textAnalysis: TextAnalysisResult
): Promise<BrandKitOutput> {
  return withRetry(async () => {
    logApiCall("Aggregator Agent");

    const timeoutConfig = getTimeoutConfig();

    const result = await streamTextWithTimeout(async () => {
      return await streamText({
        model: "openai/gpt-5-nano",
        prompt: `Combine the vision and text analysis into a focused brand kit. Return ONLY a valid JSON object with the following structure:

{
  "brandColors": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"],
  "extractedFeatures": ["feature1", "feature2", "feature3", "feature4"],
  "audience": "Detailed description of the target audience",
  "productVibes": "A small paragraph (2-3 sentences) describing the overall product vibes and brand personality"
}

Vision Analysis:
- Brand Colors: ${visionAnalysis.brandColors.join(", ")}
- Extracted Features: ${visionAnalysis.extractedFeatures.join(", ")}
- Visual Vibes: ${visionAnalysis.visualVibes}

Text Analysis:
- Audience: ${textAnalysis.audience}
- Brand Personality: ${textAnalysis.brandPersonality}
- Messaging Vibes: ${textAnalysis.messagingVibes}

Create the final brand kit by:
1. Using the brand colors from vision analysis (5-7 colors)
2. Using the extracted features from vision analysis (4-6 features)
3. Using the audience from text analysis
4. Creating product vibes that combine visual vibes and messaging vibes into a cohesive 2-3 sentence paragraph

Focus on creating a unified brand identity that works across all touchpoints.

Return ONLY the JSON object, no other text.`,
      });
    }, timeoutConfig.aggregation);

    let fullText = "";
    for await (const textPart of result.textStream) {
      fullText += textPart;
    }

    // Parse the JSON response with better error handling
    const analysis = parseJsonFromStream(fullText);
    return analysis as BrandKitOutput;
  }, "Brand Kit Aggregation");
}
