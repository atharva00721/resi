import { streamText } from "ai";
import "dotenv/config";
import {
  withRetry,
  parseJsonFromStream,
  logApiCall,
  streamTextWithTimeout,
  getTimeoutConfig,
} from "../agents/utils";
import type { BrandKit } from "../../../types/brand-kit";

// Post types
// export type PostType =
//   | "coming-soon"
//   | "event"
//   | "sale"
//   | "feature-announcement"
//   | "product-launch"
//   | "testimonial"
//   | "tutorial"
//   | "news"
//   | "general";

// Text hierarchy types
export interface TextElement {
  type:
    | "heading"
    | "subheading"
    | "body"
    | "bullet"
    | "caption"
    | "cta"
    | "tagline";
  content: string;
  position: number; // Order in the design
}

export interface TemplateTextAnalysis {
  //   postType: PostType;
  textElements: TextElement[];
}

export interface BrandTextGeneration {
  original: TemplateTextAnalysis;
  generated: TemplateTextAnalysis;
  graphicAnalysis?: GraphicAnalysis;
}

// Simple object replacement types
export interface ObjectReplacement {
  currentObject: string; // What's currently in the template
  suggestedReplacement: string; // What it should be replaced with
  reason: string; // Why this replacement makes sense for the brand
  position: "top" | "center" | "bottom" | "left" | "right" | "full";
}

export interface GraphicAnalysis {
  objectReplacements: ObjectReplacement[];
}

/**
 * Step 1: Extract all text elements with hierarchy from template
 */
export async function extractTemplateText(
  templateUrl: string
): Promise<TemplateTextAnalysis> {
  return withRetry(async () => {
    logApiCall("Template Text Extraction");

    const timeoutConfig = getTimeoutConfig();

    const result = await streamTextWithTimeout(async () => {
      return await streamText({
        model: "openai/gpt-5-nano",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this template image and extract ALL text elements with their hierarchy and order.

Return ONLY a valid JSON object with this structure:

{
  "textElements": [
    {
      "type": "heading|subheading|body|bullet|caption|cta|tagline",
      "content": "exact text content from the image",
      "position": 1
    }
  ]
}

Text hierarchy rules:
- "heading": Main title/headline (largest, most prominent)
- "subheading": Secondary title or subtitle
- "body": Main descriptive text
- "bullet": Bullet points or list items
- "caption": Small descriptive text
- "cta": Call-to-action text (buttons, links)
- "tagline": Short catchy phrase

Order the elements by their visual hierarchy (1 = most prominent, 2 = second, etc.)

Extract ALL visible text from the image. If no text is present, return empty array.

Return ONLY the JSON object, no other text.`,
              },
              {
                type: "image",
                image: templateUrl,
              },
            ],
          },
        ],
      });
    }, timeoutConfig.vision);

    let fullText = "";
    for await (const textPart of result.textStream) {
      fullText += textPart;
    }

    const analysis = parseJsonFromStream(fullText);
    return analysis as TemplateTextAnalysis;
  }, "Template Text Extraction");
}

/**
 * Step 1.5: Find simple object replacements
 */
export async function analyzeTemplateGraphics(
  templateUrl: string,
  brandKit: BrandKit
): Promise<GraphicAnalysis> {
  return withRetry(async () => {
    logApiCall("Template Object Replacement Analysis");

    const timeoutConfig = getTimeoutConfig();

    const result = await streamTextWithTimeout(async () => {
      return await streamText({
        model: "openai/gpt-5-nano",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Look at this template image and identify simple object replacements that would make it more relevant to the brand.

BRAND CONTEXT:
- Product: ${brandKit.productTitle}
- Description: ${brandKit.productDescription}
- Brand Features: ${brandKit.extractedFeatures.join(", ")}

Find objects in the template that could be replaced with something more relevant to the brand. For example:
- If there's a phone and the brand is about letters → replace phone with a letter
- If there's a car and the brand is about food → replace car with a plate/fork
- If there's a laptop and the brand is about music → replace laptop with headphones

Keep it simple - just identify 1-3 specific object swaps that make sense.

Return ONLY a valid JSON object with this structure:

{
  "objectReplacements": [
    {
      "currentObject": "phone",
      "suggestedReplacement": "letter",
      "reason": "Brand is about letters, so a letter is more relevant than a phone",
      "position": "center"
    }
  ]
}

Only suggest replacements that are:
1. Simple and specific (one object for another)
2. Clearly more relevant to the brand
3. Easy to implement

If no good replacements are found, return empty array.

Return ONLY the JSON object, no other text.`,
              },
              {
                type: "image",
                image: templateUrl,
              },
            ],
          },
        ],
      });
    }, timeoutConfig.vision);

    let fullText = "";
    for await (const textPart of result.textStream) {
      fullText += textPart;
    }

    const analysis = parseJsonFromStream(fullText);
    return analysis as GraphicAnalysis;
  }, "Template Object Replacement Analysis");
}

/**
 * Step 2: Generate brand-specific text to replace original text
 */
export async function generateBrandText(
  originalText: TemplateTextAnalysis,
  brandKit: BrandKit
): Promise<BrandTextGeneration> {
  return withRetry(async () => {
    logApiCall("Brand Text Generation");

    const timeoutConfig = getTimeoutConfig();

    const result = await streamTextWithTimeout(async () => {
      return await streamText({
        model: "openai/gpt-5-nano",
        prompt: `Rewrite the template text to match this brand's voice and style. Make it sound natural, authentic, and engaging - avoid corporate jargon or overly promotional language.

BRAND CONTEXT:
- Product: ${brandKit.productTitle}
- What it does: ${brandKit.productDescription}
- Target audience: ${brandKit.audience || "general users"}
- Brand vibe: ${brandKit.productVibes || "modern and approachable"}
- Brand personality: ${brandKit.brandPersonality || "friendly and professional"}

ORIGINAL TEXT TO REWRITE:
${originalText.textElements
  .map((el) => `- ${el.type} (position ${el.position}): "${el.content}"`)
  .join("\n")}

WRITING GUIDELINES:
- Sound human and conversational, not robotic
- Be specific and concrete, avoid vague buzzwords
- Match the brand's personality naturally
- Keep it concise and scannable
- Use active voice and strong verbs
- Make it relevant to the target audience
- Avoid clichés like "revolutionary," "game-changing," "cutting-edge"
- Don't oversell - be honest and authentic

Return ONLY a valid JSON object with this structure:

{
  "textElements": [
    {
      "type": "heading|subheading|body|bullet|caption|cta|tagline",
      "content": "rewritten text that sounds natural and authentic",
      "position": 1
    }
  ]
}

Keep the same number of elements and same types, just rewrite the content to sound more natural and brand-appropriate.

Return ONLY the JSON object, no other text.`,
      });
    }, timeoutConfig.vision);

    let fullText = "";
    for await (const textPart of result.textStream) {
      fullText += textPart;
    }

    const generatedText = parseJsonFromStream(fullText) as TemplateTextAnalysis;

    return {
      original: originalText,
      generated: generatedText,
    };
  }, "Brand Text Generation");
}

/**
 * Complete workflow: Extract template text and generate brand text
 */
export async function analyzeTemplateForBrand(
  templateUrl: string,
  brandKit: BrandKit
): Promise<BrandTextGeneration> {
  console.log("🔍 Step 1: Extracting template text...");
  const originalText = await extractTemplateText(templateUrl);

  console.log("⏳ Waiting 40 seconds before next step...");
  await new Promise((resolve) => setTimeout(resolve, 40000)); // 40 second delay

  console.log("🎨 Step 1.5: Analyzing graphics for improvements...");
  const graphicAnalysis = await analyzeTemplateGraphics(templateUrl, brandKit);

  console.log("🎨 Step 2: Generating brand-specific text...");
  const result = await generateBrandText(originalText, brandKit);

  // Add graphic analysis to the result
  result.graphicAnalysis = graphicAnalysis;

  return result;
}

/**
 * Test function
 */
async function testBrandTextGeneration() {
  console.log("🧪 Testing Brand Text Generation...\n");

  try {
    const testImageUrl =
      "https://i.pinimg.com/1200x/9f/2b/55/9f2b559dd621b7b47afed272830f4615.jpg";

    // Mock brand kit data
    const mockBrandKit: BrandKit = {
      id: "test-brand-kit",
      productTitle: "Creative Studio Pro",
      productDescription: "A modern design tool for creative professionals",
      brandColors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"],
      extractedFeatures: ["modern", "minimalist", "clean", "professional"],
      audience: "Young professionals and creative entrepreneurs",
      productVibes: "Fresh, innovative, and approachable with a modern edge",
      brandPersonality: "Friendly, professional, and inspiring",
      status: "COMPLETED",
      productImages: [],
    };

    console.log("📸 Analyzing template for brand text generation...");
    console.log("🎯 Product:", mockBrandKit.productTitle);
    console.log("⏳ This may take a few seconds...\n");

    const result = await analyzeTemplateForBrand(testImageUrl, mockBrandKit);

    console.log("✅ Brand Text Generation complete!");
    console.log("📊 Original Text Elements:");
    console.log("=".repeat(50));
    result.original.textElements.forEach((element, i) => {
      console.log(
        `${i + 1}. [${element.type.toUpperCase()}] (pos: ${element.position})`
      );
      console.log(`   "${element.content}"`);
    });

    console.log("\n🎨 Generated Brand Text:");
    console.log("=".repeat(50));
    result.generated.textElements.forEach((element, i) => {
      console.log(
        `${i + 1}. [${element.type.toUpperCase()}] (pos: ${element.position})`
      );
      console.log(`   "${element.content}"`);
    });

    if (
      result.graphicAnalysis &&
      result.graphicAnalysis.objectReplacements.length > 0
    ) {
      console.log("\n🔄 Object Replacements:");
      console.log("=".repeat(50));
      result.graphicAnalysis.objectReplacements.forEach((replacement, i) => {
        console.log(
          `${i + 1}. Replace "${replacement.currentObject}" with "${
            replacement.suggestedReplacement
          }"`
        );
        console.log(`   Position: ${replacement.position}`);
        console.log(`   Reason: ${replacement.reason}`);
      });
    } else {
      console.log("\n🔄 No object replacements suggested");
    }

    console.log("=".repeat(50));
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Run the test
testBrandTextGeneration();
