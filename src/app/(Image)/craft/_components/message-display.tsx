"use client";

import { Image } from "@/components/ai-elements/image";
import { UserIcon, BotIcon, ImageIcon, Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

interface GeneratedImage {
  id: string;
  base64: string;
  mimeType: string;
  url?: string;
}

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  images?: GeneratedImage[];
  timestamp: Date;
}

interface MessageDisplayProps {
  messages: ChatMessage[];
  isGenerating: boolean;
  onEditImage?: (image: GeneratedImage) => void;
}

export function MessageDisplay({
  messages,
  isGenerating,
}: MessageDisplayProps) {
  if (messages.length === 0 && !isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
          <ImageIcon className="w-10 h-10 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Ready to create?</h3>
          <p className="text-muted-foreground max-w-md">
            Choose a preset or write your own prompt to generate amazing images
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <div key={message.id} className="space-y-4">
          {/* User Message */}
          {message.type === "user" && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                <UserIcon className="w-4 h-4" />
              </div>
              <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 max-w-md">
                {message.content}
              </div>
            </div>
          )}

          {/* Assistant Response */}
          {message.type === "assistant" && (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <BotIcon className="w-4 h-4" />
                </div>
                <div className="space-y-4">
                  <div className="bg-muted rounded-lg px-4 py-2 max-w-md">
                    {message.content}
                  </div>

                  {/* Images Grid */}
                  {message.images && message.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 max-w-2xl">
                      {message.images.map((img) => (
                        <div
                          key={img.id}
                          className="bg-muted rounded-lg overflow-hidden group hover:shadow-lg transition-shadow"
                        >
                          {img.url ? (
                            <img
                              src={img.url}
                              alt="Generated"
                              className="w-full h-full object-cover"
                            />
                          ) : img.base64 ===
                            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" ? (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-12 h-12 text-muted-foreground" />
                            </div>
                          ) : (
                            <Image
                              base64={img.base64}
                              mediaType={img.mimeType}
                              uint8Array={new Uint8Array()}
                              alt="Generated"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Loading State */}
      {isGenerating && (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
            <BotIcon className="w-4 h-4" />
          </div>
          <div className="bg-muted rounded-lg px-4 py-2">
            <div className="flex items-center gap-2">
              <Loader2Icon className="w-4 h-4 animate-spin" />
              <span className="text-sm">Generating images...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
