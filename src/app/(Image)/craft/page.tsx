"use client";

import { useState, useRef } from "react";
import { LeftPanel, RightPanel, type Preset } from "./_components";
import { type FalModelKey } from "@/types/ai";
import { uploadFiles } from "@/lib/uploadthing";

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  images?: GeneratedImage[];
  timestamp: Date;
}

interface GeneratedImage {
  id: string;
  base64: string;
  mimeType: string;
  width?: number;
  height?: number;
  nsfw?: boolean;
  url?: string;
}

export default function CraftPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] =
    useState<FalModelKey>("imagen4-fast");
  // Aspect ratio removed: Fal decides final dimensions
  const [guidanceScale, setGuidanceScale] = useState(7.5);
  const [numInferenceSteps, setNumInferenceSteps] = useState(20);
  const [safetyChecker, setSafetyChecker] = useState(true);
  const [strength, setStrength] = useState(0.8);
  const [isVideoMode, setIsVideoMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePresetSelect = (preset: Preset) => {
    setSelectedPreset(preset.id);
    setPrompt(preset.prompt);
  };

  const handleEditImage = (image: GeneratedImage) => {
    // Set the image as the reference image for editing
    setUploadedImage(`data:${image.mimeType};base64,${image.base64}`);
    // Switch to nano-banana model for editing
    setSelectedModel("nano-banana");
    // Set a default edit prompt
    setPrompt("Edit this image: ");
    // Focus on the prompt input
    setTimeout(() => {
      const textarea = document.querySelector(
        'textarea[placeholder*="Describe what you want to create"]'
      ) as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(
          textarea.value.length,
          textarea.value.length
        );
      }
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content: prompt,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setIsGenerating(true);

    try {
      let imageUrl: string | undefined;

      // If user selected a reference image, upload it to UploadThing first
      if (uploadedImage) {
        const file = await (async () => {
          // Convert data URL to File
          const res = await fetch(uploadedImage);
          const blob = await res.blob();
          const mime = blob.type || "image/png";
          return new File([blob], `reference-${Date.now()}.png`, {
            type: mime,
          });
        })();

        const uploaded = await uploadFiles("imageUploader", {
          files: [file],
        });

        if (!uploaded || uploaded.length === 0) {
          throw new Error("Upload failed");
        }

        imageUrl = uploaded[0]?.ufsUrl || uploaded[0]?.url;
      }

      // Call Fal AI API
      const response = await fetch("/api/ai/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userMessage.content,
          model: selectedModel,
          guidanceScale,
          numInferenceSteps,
          safetyChecker,
          imageUrl,
          strength,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate image");
      }

      if (result.success && result.image) {
        const generatedImage: GeneratedImage = {
          id: `img-${Date.now()}`,
          base64: result.image.base64,
          mimeType: result.image.mimeType,
          width: result.image.width,
          height: result.image.height,
          nsfw: result.image.nsfw,
          url: result.image.storageUrl,
        };

        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          type: "assistant",
          content: `Here's your generated image based on: "${userMessage.content}"`,
          images: [generatedImage],
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error("No image generated");
      }
    } catch (error) {
      console.error("Image generation error:", error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        type: "assistant",
        content: `Sorry, I couldn't generate an image. Error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <LeftPanel
        uploadedImage={uploadedImage}
        onImageUpload={handleImageUpload}
        onRemoveImage={() => setUploadedImage(null)}
        fileInputRef={fileInputRef}
        selectedPreset={selectedPreset}
        onPresetSelect={handlePresetSelect}
        prompt={prompt}
        onPromptChange={setPrompt}
        onSubmit={handleSubmit}
        isGenerating={isGenerating}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        guidanceScale={guidanceScale}
        onGuidanceScaleChange={setGuidanceScale}
        numInferenceSteps={numInferenceSteps}
        onNumInferenceStepsChange={setNumInferenceSteps}
        safetyChecker={safetyChecker}
        onSafetyCheckerChange={setSafetyChecker}
        strength={strength}
        onStrengthChange={setStrength}
        isVideoMode={isVideoMode}
        onVideoModeToggle={setIsVideoMode}
      />

      <RightPanel
        messages={messages}
        isGenerating={isGenerating}
        onEditImage={handleEditImage}
      />
    </div>
  );
}
