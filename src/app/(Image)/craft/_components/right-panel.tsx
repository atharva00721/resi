"use client";

import { MessageDisplay } from "./message-display";

interface GeneratedImage {
  id: string;
  base64: string;
  mimeType: string;
  width?: number;
  height?: number;
  nsfw?: boolean;
  url?: string;
}

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  images?: GeneratedImage[];
  timestamp: Date;
}

interface RightPanelProps {
  messages: ChatMessage[];
  isGenerating: boolean;
  onEditImage?: (image: GeneratedImage) => void;
}

export function RightPanel({
  messages,
  isGenerating,
  onEditImage,
}: RightPanelProps) {
  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">Generated Images</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <MessageDisplay
          messages={messages}
          isGenerating={isGenerating}
          onEditImage={onEditImage}
        />
      </div>
    </div>
  );
}
