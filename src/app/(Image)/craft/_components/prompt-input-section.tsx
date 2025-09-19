"use client";

import {
  PromptInput,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputSubmit,
  PromptInputTools,
  PromptInputButton,
  PromptInputModelSelect,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectValue,
} from "@/components/ai-elements/prompt-input";
import { Button } from "@/components/ui/button";
import { FalModelKey } from "@/types/ai";
import {
  UploadIcon,
  Loader2Icon,
  Send,
  ImageIcon,
  VideoIcon,
} from "lucide-react";

interface PromptInputSectionProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isGenerating: boolean;
  uploadedImage: string | null;
  onUploadClick: () => void;
  selectedModel: FalModelKey;
  onModelChange: (model: FalModelKey) => void;
  isVideoMode: boolean;
  onVideoModeToggle: (isVideo: boolean) => void;
}

export function PromptInputSection({
  prompt,
  onPromptChange,
  onSubmit,
  isGenerating,
  uploadedImage,
  onUploadClick,
  selectedModel,
  onModelChange,
  isVideoMode,
  onVideoModeToggle,
}: PromptInputSectionProps) {
  return (
    <PromptInput onSubmit={onSubmit} className="flex flex-col">
      <PromptInputTextarea
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        placeholder="Describe what you want to create..."
        className="flex-1 min-h-[120px] resize-none"
      />

      {/* Toolbar with Tools and Submit */}
      <PromptInputToolbar>
        <PromptInputTools>
          {/* Upload Button */}
          <PromptInputButton onClick={onUploadClick}>
            <UploadIcon className="w-4 h-4" />
            Upload
          </PromptInputButton>
          {/* Model Selector */}
          <PromptInputModelSelect
            value={selectedModel}
            onValueChange={onModelChange}
          >
            <PromptInputModelSelectTrigger className="min-w-32 max-w-38">
              <PromptInputModelSelectValue placeholder="Model" />
            </PromptInputModelSelectTrigger>
            <PromptInputModelSelectContent>
              <PromptInputModelSelectItem value="imagen4-fast">
                Imagen 4 Fast
              </PromptInputModelSelectItem>
              <PromptInputModelSelectItem value="nano-banana">
                Nano Banana
              </PromptInputModelSelectItem>
            </PromptInputModelSelectContent>
          </PromptInputModelSelect>
          {/* Video/Image Toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/30 p-1">
            <Button
              onClick={() => onVideoModeToggle(false)}
              size="icon"
              variant="ghost"
              className={`h-8 w-8 rounded-md transition-all ${
                !isVideoMode
                  ? "bg-pink-300 text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ImageIcon className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => onVideoModeToggle(true)}
              size="icon"
              variant="ghost"
              className={`h-8 w-8 rounded-md transition-all ${
                isVideoMode
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <VideoIcon className="w-4 h-4" />
            </Button>
          </div>
        </PromptInputTools>
        <PromptInputSubmit
          disabled={!prompt.trim() || isGenerating}
          className="bg-black flex items-center justify-center"
        >
          {isGenerating ? (
            <Loader2Icon className="w-4 h-4 animate-spin" />
          ) : (
            <Send />
          )}
        </PromptInputSubmit>
      </PromptInputToolbar>
    </PromptInput>
  );
}
