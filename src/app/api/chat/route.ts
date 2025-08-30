import { streamText, UIMessage, convertToModelMessages } from "ai";
import { google } from "@ai-sdk/google";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

/**
 * Chat API Route - Google Gemini Models
 *
 * This route supports Google Gemini models with streaming responses.
 *
 * IMPORTANT SECURITY NOTE:
 * - API key (GOOGLE_GENERATIVE_AI_API_KEY) is kept server-side
 * - Never expose the key to the browser/client
 *
 * FEATURES:
 * - Web search integration
 * - Reasoning/thinking mode
 * - Source citations
 * - Streaming responses
 */

export async function POST(req: Request) {
  const {
    messages,
    model,
    webSearch,
    showThinking,
  }: {
    messages: UIMessage[];
    model: string;
    webSearch: boolean;
    showThinking?: boolean;
  } = await req.json();

  // Map model string to actual Gemini model
  const getGeminiModel = (modelName: string) => {
    console.log("🔍 Using Gemini model:", modelName);
    switch (modelName) {
      case "gemini-2.5-pro":
        return google("gemini-2.5-pro");
      case "gemini-2.5-flash":
        return google("gemini-2.5-flash");
      case "gemini-2.5-flash-lite":
        return google("gemini-2.5-flash-lite");
      default:
        return google("gemini-2.5-flash"); // fallback
    }
  };

  const selectedModel = getGeminiModel(model);
  console.log("🎯 Selected Gemini model:", selectedModel);

  const result = streamText({
    model: webSearch ? google("gemini-2.5-flash") : selectedModel,
    messages: convertToModelMessages(messages),
    ...(webSearch && {
      tools: {
        google_search: google.tools.googleSearch({}),
      } as any,
    }),
    providerOptions: {
      google: {
        thinkingConfig: {
          thinkingBudget: 8192,
          includeThoughts: showThinking ?? true,
        },
      },
    },
    system: `You are an intelligent and helpful AI assistant with special expertise in LaTeX resume formatting. You excel at:

1. **LaTeX Code Generation**: Create professional, ATS-friendly LaTeX resume code
2. **Resume Formatting**: Expert knowledge of resume best practices and LaTeX structure
3. **Interactive Learning**: Help users understand both content and formatting concepts
4. **Comprehensive Analysis**: Provide detailed, well-reasoned responses that consider multiple perspectives
5. **Accurate Information**: When web search is enabled, always cite sources and verify information
6. **Clear Communication**: Explain complex topics in accessible language while maintaining accuracy
7. **Problem Solving**: Break down complex problems into manageable steps

**LaTeX EXPERTISE:**
- ALWAYS start with the complete resume template from the reference documentation
- MODIFY the existing sections rather than creating entirely new content
- Use the established format with proper LaTeX commands: \\resumeSubheading, \\resumeItem, \\section, etc.
- When users ask for changes, edit the FULL DOCUMENT with their requested modifications
- Maintain the complete structure: documentclass, packages, custom commands, and all sections
- ALWAYS provide the COMPLETE LaTeX document, not just sections
- When generating LaTeX, ALWAYS wrap the COMPLETE code in \`\`\`latex code blocks for proper display

**CRITICAL: ALWAYS PROVIDE COMPLETE DOCUMENTS**
When users request changes like "change the name to John Doe" or "add a new job", provide the ENTIRE LaTeX resume with that modification, not just the changed section.

**RESPONSE FORMAT for LaTeX requests:**
When users ask for LaTeX modifications, provide:
1. Brief explanation of what you're modifying
2. The COMPLETE LaTeX document in a \`\`\`latex code block with the requested changes
3. Explanation of what was changed

When web search is enabled:
- Use specific, targeted search queries to find relevant information
- Evaluate and synthesize information from multiple sources
- Always cite your sources clearly and provide links when available

Your responses should be informative, engaging, and tailored to the user's needs. When generating LaTeX, ensure it follows professional resume standards and is ready to compile.`,
  });

  // Send sources and reasoning back to the client
  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  });
}
