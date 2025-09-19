import type { BrandKit } from "../../../types/brand-kit";
import type { BrandTextGeneration } from "./vision-agent";
import type { ImageEditInstructions } from "./prompt-agent";

// Master Agent result types
export interface MasterAgentResult {
  templateAnalysis: BrandTextGeneration;
  editInstructions: ImageEditInstructions;
  imageEditing?: {
    prompt: string;
    imageUrl: string;
    editedImage: Uint8Array;
    filename: string;
    status: "edited";
    metadata?: any;
  };
}

export interface MasterAgentOptions {
  editImage?: boolean;
  imageUrl?: string; // URL of the image to edit
}

/**
 * Master Agent - Orchestrates all craft agents for complete template processing
 *
 * This agent coordinates:
 * 1. Vision Agent - Analyzes template and generates brand text
 * 2. Prompt Agent - Creates image edit instructions
 * 3. Image Gen Agent - Edits the image using nano-banana edit (optional)
 */
export async function processTemplateWithMasterAgent(
  templateUrl: string,
  brandKit: BrandKit,
  options: MasterAgentOptions = {}
): Promise<MasterAgentResult> {
  console.log("🎯 Master Agent: Starting template processing...\n");

  try {
    // Step 1: Vision Agent - Analyze template and generate brand text
    console.log("🔍 Step 1: Vision Agent - Analyzing template...");
    const { analyzeTemplateForBrand } = await import("./vision-agent");
    const templateAnalysis = await analyzeTemplateForBrand(
      templateUrl,
      brandKit
    );
    console.log("✅ Vision Agent complete\n");

    // Step 2: Prompt Agent - Generate edit instructions
    console.log("🎨 Step 2: Prompt Agent - Creating edit instructions...");
    const { generateImageEditInstructions } = await import("./prompt-agent");
    const editInstructions = await generateImageEditInstructions(
      templateAnalysis
    );
    console.log("✅ Prompt Agent complete\n");

    // Step 3: Image Gen Agent - Edit image (optional)
    let imageEditing;
    if (options.editImage && options.imageUrl) {
      console.log("🖼️  Step 3: Image Gen Agent - Editing image...");
      const { editImageWithPrompt } = await import("./image-gen-agent");

      // Convert edit instructions to a prompt string
      const editPrompt = JSON.stringify(editInstructions);

      imageEditing = await editImageWithPrompt(editPrompt, options.imageUrl);
      console.log("✅ Image Gen Agent complete\n");
    }

    console.log("🎉 Master Agent: All processing complete!");

    return {
      templateAnalysis,
      editInstructions,
      imageEditing,
    };
  } catch (error) {
    console.error("❌ Master Agent failed:", error);
    throw new Error(
      `Master Agent processing failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Quick template processing - Just vision + prompt agents
 */
export async function quickTemplateProcess(
  templateUrl: string,
  brandKit: BrandKit
): Promise<{
  templateAnalysis: BrandTextGeneration;
  editInstructions: ImageEditInstructions;
}> {
  console.log("⚡ Quick Template Process: Vision + Prompt agents only\n");

  const { analyzeTemplateForBrand } = await import("./vision-agent");
  const { generateImageEditInstructions } = await import("./prompt-agent");

  const templateAnalysis = await analyzeTemplateForBrand(templateUrl, brandKit);
  const editInstructions = await generateImageEditInstructions(
    templateAnalysis
  );

  return {
    templateAnalysis,
    editInstructions,
  };
}

/**
 * Test function for Master Agent
 */
async function testMasterAgent() {
  console.log("🧪 Testing Master Agent...\n");

  try {
    const testImageUrl =
      "https://i.pinimg.com/1200x/9f/2b/55/9f2b559dd621b7b47afed272830f4615.jpg";

    // Real brand kit data
    const mockBrandKit: BrandKit = {
      id: "cmfogqdl20001dl78tuttudty",
      productTitle: "LostLetters",
      productDescription:
        "An archive of letters, texts, and thoughts shared online anonymously — a safe space to let things out, tell your story, and know you're not alone. Writing is super simple: just enter the person's name and the message you want to share, and it becomes part of the archive.",
      brandColors: [
        "#0B2545",
        "#1F5D8A",
        "#D6C8A3",
        "#EFD6D0",
        "#5A7D6A",
        "#f1f1f1",
      ],
      extractedFeatures: [
        "Warm, muted color palette that communicates privacy and trust",
        "Soft, tactile textures reminiscent of parchment/paper",
        "Intimate typography and generous whitespace for readability",
        "Minimal, calm layouts with quiet ergonomics",
        "Epistolary-inspired imagery and nostalgic, heartfelt copy",
      ],
      audience:
        "Young adults and adults seeking a private, low-friction outlet for confession, reflection, and storytelling. People who feel lonely, overwhelmed, or misunderstood and want to unburden themselves anonymously. Aspiring writers and lovers of epistolary expression who want a durable archive of personal thoughts. Digital natives who value privacy, simplicity, and connection without revealing their identity. The audience appreciates a trustworthy, human space that feels intimate, empathetic, and discreet.",
      productVibes:
        "Product vibes blend quiet, intimate aesthetics with warm, cathartic messaging. The brand feels empathetic, nostalgic, privacy-minded, and approachable—calm, human, and reassuring as users confide, reflect, and archive their thoughts.",
      brandPersonality:
        "Empathetic, nostalgic, privacy-minded, and approachable",
      status: "COMPLETED",
      productImages: [
        {
          id: "cmfogr4t10002dl787lqhwg58",
          imageUrl:
            "https://g04vidadm3.ufs.sh/f/WIG3ufijdLFMOUqlJO4zyLr3pHaIC0oVZkKtdM7vjsn8RGT2",
          previewUrl:
            "https://g04vidadm3.ufs.sh/f/WIG3ufijdLFMOUqlJO4zyLr3pHaIC0oVZkKtdM7vjsn8RGT2",
          order: 0,
        },
        {
          id: "cmfogr4t10003dl78uymcc5vq",
          imageUrl:
            "https://g04vidadm3.ufs.sh/f/WIG3ufijdLFMxdBOkP9lVLUptOiZqeC5Nckzy2Hbg0IDrEf1",
          previewUrl:
            "https://g04vidadm3.ufs.sh/f/WIG3ufijdLFMxdBOkP9lVLUptOiZqeC5Nckzy2Hbg0IDrEf1",
          order: 1,
        },
        {
          id: "cmfogr4t10004dl78nyfe7z3g",
          imageUrl:
            "https://g04vidadm3.ufs.sh/f/WIG3ufijdLFMWUsxSLijdLFMx3pYJgmubQcROU8I7f9PVqD5",
          previewUrl:
            "https://g04vidadm3.ufs.sh/f/WIG3ufijdLFMWUsxSLijdLFMx3pYJgmubQcROU8I7f9PVqD5",
          order: 2,
        },
        {
          id: "cmfogr4t10005dl78iinlrsjf",
          imageUrl:
            "https://g04vidadm3.ufs.sh/f/WIG3ufijdLFMPHRmIyCa7xXGzfwMiK34yrBIpSZsJDh8juQL",
          previewUrl:
            "https://g04vidadm3.ufs.sh/f/WIG3ufijdLFMPHRmIyCa7xXGzfwMiK34yrBIpSZsJDh8juQL",
          order: 3,
        },
      ],
    };

    console.log("📸 Processing template with Master Agent...");
    console.log("🎯 Product:", mockBrandKit.productTitle);
    console.log("⏳ This may take a few minutes...\n");

    // Test with image editing enabled
    const result = await processTemplateWithMasterAgent(
      testImageUrl,
      mockBrandKit,
      {
        editImage: true,
        imageUrl: testImageUrl,
      }
    );

    console.log("✅ Master Agent Processing Complete!");
    console.log("📊 Results Summary:");
    console.log("=".repeat(60));

    console.log("🔍 Template Analysis:");
    console.log(
      `- Found ${result.templateAnalysis.original.textElements.length} text elements`
    );
    console.log(
      `- Generated ${result.templateAnalysis.generated.textElements.length} brand texts`
    );

    if (result.templateAnalysis.graphicAnalysis) {
      console.log(
        `- Found ${result.templateAnalysis.graphicAnalysis.objectReplacements.length} object replacements`
      );
    }

    console.log("\n🎨 Edit Instructions:");
    console.log(
      `- Created ${result.editInstructions.textInstructions.length} text instructions`
    );
    console.log(
      `- Created ${result.editInstructions.objectInstructions.length} object instructions`
    );

    if (result.imageEditing) {
      console.log("\n🖼️  Image Editing:");
      console.log(`- Status: ${result.imageEditing.status}`);
      console.log(`- Filename: ${result.imageEditing.filename}`);
      console.log(`- Source Image: ${result.imageEditing.imageUrl}`);
      console.log(
        `- Edit Prompt: ${result.imageEditing.prompt.substring(0, 100)}...`
      );
    }

    console.log("=".repeat(60));
  } catch (error) {
    console.error("❌ Master Agent test failed:", error);
  }
}

// Run the test
testMasterAgent();
