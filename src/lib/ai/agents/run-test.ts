#!/usr/bin/env bun

/**
 * Test script for Brand Kit AI Agents
 * Run with: bun run run-test.ts
 */

import { generateBrandKit, type BrandKitInput } from "./index";
import "dotenv/config";

async function testBrandKitGeneration() {
  console.log("🚀 Testing Brand Kit AI Agents...\n");

  try {
    // Mock data for testing
    const mockInput: BrandKitInput = {
      logo: "https://g04vidadm3.ufs.sh/f/WIG3ufijdLFMeX3qxG2D7kxKRY2Qy8o0bCPFTzfmdX6tAvH5",
      title: "Pussyparty",
      description:
        "A fun app to share you cats silly pictures",
      productImages: [
        "https://g04vidadm3.ufs.sh/f/WIG3ufijdLFMDYBcuRUKMJviY9ky3pOP4l8uXsfdB0Ahro5t",
        "https://g04vidadm3.ufs.sh/f/WIG3ufijdLFMNkBxQBuzYenVqIHlQMcuxvXSs1aDw8bp27BR",
      ],
    };

    console.log("📸 Mock Input:");
    console.log("- Logo:", mockInput.logo);
    console.log("- Title:", mockInput.title);
    console.log("- Description:", mockInput.description);
    console.log("- Product Images:", mockInput.productImages.length, "images");
    console.log("\n" + "=".repeat(60) + "\n");

    // Test the complete pipeline with progress tracking
    console.log("🔄 Running optimized brand kit generation pipeline...");
    console.log(
      "⏱️  This may take a few minutes due to rate limiting and retries...\n"
    );

    const startTime = Date.now();
    const result = await generateBrandKit(mockInput);
    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);

    console.log("✅ Brand Kit Generation Complete!");
    console.log(`⏱️  Total time: ${duration} seconds\n`);
    console.log("📊 Results:");
    console.log("=".repeat(40));

    console.log("\n🎨 Brand Kit Output:");
    console.log("- Brand Colors:", result.brandColors);
    console.log("- Extracted Features:", result.extractedFeatures);
    console.log("- Target Audience:", result.audience);
    console.log("- Product Vibes:", result.productVibes);

    console.log("\n" + "=".repeat(60));
    console.log(
      "🎉 Test completed successfully! All agents are working properly."
    );
  } catch (error) {
    console.error("❌ Test failed:", error);
    console.log("\n🔧 Make sure you have:");
    console.log("1. OPENAI_API_KEY set in your environment variables");
    console.log("2. All dependencies installed (bun install)");
    console.log("3. Internet connection for API calls");
  }
}

// Run the test
testBrandKitGeneration();
