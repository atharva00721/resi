"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputButton,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { useState } from "react";
import * as React from "react";
import { useChat } from "@ai-sdk/react";
import { Response } from "@/components/ai-elements/response";
import { GlobeIcon, Brain } from "lucide-react";
import { SourcesSheet } from "@/components/ai-elements/sources-sheet";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Loader } from "@/components/ai-elements/loader";
import LaTeXReferencePanel from "@/components/latex-reference-panel";

const models = [
  {
    name: "Gemini 2.5 Pro",
    value: "gemini-2.5-pro",
  },
  {
    name: "Gemini 2.5 Flash",
    value: "gemini-2.5-flash",
  },
  {
    name: "Gemini 2.5 Flash Lite",
    value: "gemini-2.5-flash-lite",
  },
];

const ChatBotDemo = () => {
  const [input, setInput] = useState("");
  const [model, setModel] = useState<string>(models[0].value);
  const [webSearch, setWebSearch] = useState(false);
  const [showThinking, setShowThinking] = useState(true);
  const [aiGeneratedLatex, setAiGeneratedLatex] = useState<string>("");
  const { messages, sendMessage, status } = useChat();

  // Extract LaTeX code from AI responses
  const extractLatexFromMessage = (messageText: string): string | null => {
    // Look for LaTeX code blocks (```latex ... ```)
    const latexBlockMatch = messageText.match(
      /```(?:latex|tex)\n?([\s\S]*?)```/i
    );
    if (latexBlockMatch) {
      return latexBlockMatch[1].trim();
    }

    // Look for inline LaTeX commands (multiple lines with backslashes)
    const latexCommands = messageText.match(
      /\\[a-zA-Z]+(?:\{[^}]*\}|\[[^\]]*\])*(?:\s*\\[a-zA-Z]+(?:\{[^}]*\}|\[[^\]]*\])*){3,}/g
    );
    if (latexCommands && latexCommands.length > 0) {
      return latexCommands.join("\n");
    }

    return null;
  };

  // Check for LaTeX content in messages and update the panel
  React.useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === "assistant") {
      const textPart = lastMessage.parts?.find((part) => part.type === "text");
      if (textPart) {
        const latexContent = extractLatexFromMessage(textPart.text);
        if (latexContent) {
          setAiGeneratedLatex(latexContent);
        }
      }
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(
        { text: input },
        {
          body: {
            model: model,
            webSearch: webSearch,
            showThinking: showThinking,
          },
        }
      );
      setInput("");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Chat Section - Left Half */}
      <div className="w-1/2 flex flex-col border-r">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold text-foreground">
            AI Chat Assistant
          </h1>
          <p className="text-sm text-muted-foreground">
            Get help with LaTeX, resumes, and more
          </p>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center space-y-4">
                <h2 className="text-xl font-semibold">
                  Welcome to the AI Assistant
                </h2>
                <p className="text-muted-foreground">
                  Ask me to generate LaTeX code, format resumes, or help with
                  anything else!
                </p>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>
                    <strong>Try asking:</strong>
                  </p>
                  <ul className="text-left space-y-1 max-w-sm mx-auto">
                    <li>
                      • "Generate a LaTeX experience section for a software
                      engineer"
                    </li>
                    <li>
                      • "Create a skills section with programming languages"
                    </li>
                    <li>
                      • "Write LaTeX for a computer science education section"
                    </li>
                    <li>• "Format a projects section with GitHub links"</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <Conversation className="flex-1">
              <ConversationContent>
                {messages.map((message) => (
                  <div key={message.id}>
                    {message.role === "assistant" && (
                      <SourcesSheet
                        sources={message.parts.filter(
                          (part) => part.type === "source-url"
                        )}
                      />
                    )}
                    <Message from={message.role} key={message.id}>
                      <MessageContent>
                        {message.parts.map((part, i) => {
                          switch (part.type) {
                            case "text":
                              return (
                                <Response key={`${message.id}-${i}`}>
                                  {part.text}
                                </Response>
                              );
                            case "reasoning":
                              return (
                                <Reasoning
                                  key={`${message.id}-${i}`}
                                  className="w-full"
                                  isStreaming={status === "streaming"}
                                >
                                  <ReasoningTrigger />
                                  <ReasoningContent>
                                    {part.text}
                                  </ReasoningContent>
                                </Reasoning>
                              );
                            default:
                              return null;
                          }
                        })}
                      </MessageContent>
                    </Message>
                  </div>
                ))}
                {status === "submitted" && <Loader />}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>
          )}

          <div className="p-4 border-t">
            <PromptInput onSubmit={handleSubmit}>
              <PromptInputTextarea
                onChange={(e) => setInput(e.target.value)}
                value={input}
                placeholder="Ask about LaTeX, resume formatting, or anything else..."
              />
              <PromptInputToolbar>
                <PromptInputTools>
                  <PromptInputButton
                    variant={webSearch ? "default" : "ghost"}
                    onClick={() => setWebSearch(!webSearch)}
                  >
                    <GlobeIcon size={16} />
                    <span>Search</span>
                  </PromptInputButton>
                  <PromptInputButton
                    variant={showThinking ? "default" : "ghost"}
                    onClick={() => setShowThinking(!showThinking)}
                  >
                    <Brain size={16} />
                    <span>Thinking</span>
                  </PromptInputButton>
                  <PromptInputModelSelect
                    onValueChange={(value) => {
                      setModel(value);
                    }}
                    value={model}
                  >
                    <PromptInputModelSelectTrigger>
                      <PromptInputModelSelectValue />
                    </PromptInputModelSelectTrigger>
                    <PromptInputModelSelectContent>
                      {models.map((model) => (
                        <PromptInputModelSelectItem
                          key={model.value}
                          value={model.value}
                        >
                          {model.name}
                        </PromptInputModelSelectItem>
                      ))}
                    </PromptInputModelSelectContent>
                  </PromptInputModelSelect>
                </PromptInputTools>
                <PromptInputSubmit disabled={!input} status={status} />
              </PromptInputToolbar>
            </PromptInput>
          </div>
        </div>
      </div>

      {/* LaTeX Reference Section - Right Half */}
      <div className="w-1/2 flex flex-col">
        <LaTeXReferencePanel aiGeneratedContent={aiGeneratedLatex} />
      </div>
    </div>
  );
};

export default ChatBotDemo;
