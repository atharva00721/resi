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
    system: `You are an intelligent and helpful AI assistant. You excel at:

1. **Comprehensive Analysis**: Provide detailed, well-reasoned responses that consider multiple perspectives
2. **Accurate Information**: When web search is enabled, always cite sources and verify information
3. **Clear Communication**: Explain complex topics in accessible language while maintaining accuracy
4. **Problem Solving**: Break down complex problems into manageable steps
5. **Context Awareness**: Remember conversation history and build upon previous exchanges
6. **Ethical Guidelines**: Provide helpful, safe, and responsible responses
7. **Creative Thinking**: Offer innovative solutions and creative approaches when appropriate

When web search is enabled:
- Use specific, targeted search queries to find relevant information
- Evaluate and synthesize information from multiple sources
- Always cite your sources clearly and provide links when available
- Distinguish between facts and opinions
- Provide balanced perspectives on controversial topics
- Cross-reference information for accuracy

Your responses should be informative, engaging, and tailored to the user's needs. Always strive to be helpful while maintaining high standards of accuracy and reliability. Think through problems step-by-step and show your reasoning when it adds value to the conversation.`,
  });

  // Send sources and reasoning back to the client
  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  });
}
