/**
 * Brand Kit AI Agents
 *
 * This module contains three specialized AI agents for brand kit generation:
 *
 * 1. Vision Agent (analyzeProductImage) - Analyzes product images to extract:
 *    - Brand colors and color palettes
 *    - Visual style and brand vibe
 *    - Target audience insights
 *    - Key visual features
 *
 * 2. Text Agent (analyzeProductText) - Analyzes product information to create:
 *    - Compelling product titles and descriptions
 *    - Target audience analysis
 *    - Brand personality and messaging tone
 *    - Key features and use cases
 *
 * 3. Aggregator Agent (aggregateBrandKit) - Combines vision and text analysis:
 *    - Creates cohesive brand kit JSON
 *    - Provides strategic recommendations
 *    - Suggests next steps for brand development
 *
 * Usage Example:
 * ```typescript
 * import { generateBrandKit } from '@/lib/ai/agents';
 *
 * const result = await generateBrandKit(
 *   'https://example.com/product-image.jpg',
 *   'A premium wireless headphone with noise cancellation'
 * );
 *
 * console.log(result.brandKit); // BrandKitData object
 * console.log(result.recommendations); // Strategic recommendations
 * console.log(result.nextSteps); // Next steps
 * ```
 */

// Export all types
export type {
  BrandKitInput,
  BrandKitOutput,
  VisionAnalysisResult,
  TextAnalysisResult,
} from "./types";

// Import individual agents
import { analyzeProductImages } from "./vision-agent";
import { analyzeBrandText } from "./text-agent";
// import { aggregateBrandKit } from "./aggregator-agent";
import type { BrandKitInput, BrandKitOutput } from "./types";
import { addRateLimitDelay } from "./utils";

// Export individual agents
export { analyzeProductImages } from "./vision-agent";
export { analyzeBrandText } from "./text-agent";
// export { aggregateBrandKit } from "./aggregator-agent";

// Main orchestrator function
export async function generateBrandKit(
  input: BrandKitInput
): Promise<BrandKitOutput> {
  try {
    console.log(
      "🚀 Starting brand kit generation with enhanced rate limiting...\n"
    );

    // Step 1: Vision analysis (product images)
    console.log("📸 Step 1: Analyzing product images...");
    const visionAnalysis = await analyzeProductImages(input.productImages);
    console.log("✅ Vision analysis complete\n");

    // Add extra delay between agents to avoid rate limits
    await addRateLimitDelay();

    // Step 2: Text analysis (logo, title, description with vision context)
    console.log("📝 Step 2: Analyzing brand text and logo...");
    const textAnalysis = await analyzeBrandText(
      input.logo,
      input.title,
      input.description,
      visionAnalysis
    );
    console.log("✅ Text analysis complete\n");

    // Add extra delay before final aggregation
    await addRateLimitDelay();

    // Step 3: Aggregate into final brand kit
    console.log("🔄 Step 3: Aggregating brand kit...");
    // Import aggregator function dynamically to avoid module resolution issues
    const { aggregateBrandKit } = await import("./aggregator-agent");
    const brandKit = await aggregateBrandKit(visionAnalysis, textAnalysis);
    console.log("✅ Brand kit aggregation complete\n");

    return brandKit;
  } catch (error) {
    console.error("Brand kit generation error:", error);
    throw new Error("Failed to generate brand kit");
  }
}
