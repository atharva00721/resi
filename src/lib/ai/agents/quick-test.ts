#!/usr/bin/env bun

/**
 * Quick test script for Brand Kit AI Agents
 * Run with: bun run quick-test.ts
 */

import { streamText } from "ai";
import "dotenv/config";
import {
  withRetry,
  parseJsonFromStream,
  logApiCall,
  streamTextWithTimeout,
  getTimeoutConfig,
} from "./utils";

async function quickTest() {
  console.log("🚀 Quick Test - Brand Kit AI Agents\n");

  try {
    console.log("Testing GPT-5-Nano connection with rate limiting...\n");

    const timeoutConfig = getTimeoutConfig();

    const result = await withRetry(async () => {
      logApiCall("Quick Test");

      const streamResult = await streamTextWithTimeout(async () => {
        return await streamText({
          model: "openai/gpt-5-nano",
          prompt:
            'Return ONLY a JSON object with this structure: {"test": "success", "model": "gpt-5-nano"}',
        });
      }, timeoutConfig.connection);

      let fullText = "";
      for await (const textPart of streamResult.textStream) {
        fullText += textPart;
        process.stdout.write(textPart);
      }

      return {
        fullText,
        usage: await streamResult.usage,
        finishReason: await streamResult.finishReason,
      };
    }, "Quick Test");

    console.log("\n\n✅ Connection successful!");
    console.log("📊 Token usage:", result.usage);
    console.log("🎯 Finish reason:", result.finishReason);

    // Try to parse JSON
    const parsed = parseJsonFromStream(result.fullText);
    console.log("📋 Parsed response:", parsed);

    console.log(
      "\n🎉 All systems ready! You can now run the full brand kit test."
    );
    console.log("Run: bun run run-test.ts");
  } catch (error) {
    console.error("❌ Test failed:", error);
    console.log("\n🔧 Make sure you have:");
    console.log("1. OPENAI_API_KEY set in your environment variables");
    console.log("2. All dependencies installed (bun install)");
    console.log("3. Internet connection for API calls");
  }
}

// Run the test
quickTest();
