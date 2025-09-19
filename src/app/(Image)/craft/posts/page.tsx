"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeftIcon } from "lucide-react";
import { BrandKitSelector } from "@/components/brandkit-selector";
import { BrandKitPreviewCard } from "@/components/brandkit-preview-card";
import { BrandKit } from "@/types/brand-kit";
import { toast } from "sonner";
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PostGenerator, POST_TYPES } from "./_componenets/post-generator";

const PostsPage = () => {
  const router = useRouter();
  const [selectedBrandKit, setSelectedBrandKit] = useState<BrandKit | null>(
    null
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPromptEnabled, setIsPromptEnabled] = useState(true);
  const [generatedPosts, setGeneratedPosts] = useState<any[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState("");

  const handleGeneratePost = useCallback(
    async (message: string, postType?: string) => {
      if (!message.trim()) {
        toast.error("Please enter a description for your post");
        return;
      }

      if (!selectedBrandKit) {
        toast.error("Please select a brand kit first");
        return;
      }

      setIsGenerating(true);
      setError(null);
      setCurrentPrompt(message);

      try {
        // TODO: Implement post generation logic
        console.log("Generating post:", message);
        console.log("Selected brand kit:", selectedBrandKit);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Simulate post generation with AI reasoning
        const newPost = {
          id: Date.now().toString(),
          content: `Generated post based on: "${message}"\n\nThis is a sample generated post that would incorporate your brand kit elements including colors, fonts, and style guidelines. The AI would analyze your brand kit and create content that matches your brand voice and aesthetic.`,
          reasoning: [
            "Analyzed brand kit colors and typography",
            "Applied brand voice and tone guidelines",
            "Incorporated product imagery context",
            "Generated engaging social media content",
            "Applied brand consistency checks",
          ],
          timestamp: new Date(),
          postType: postType || "product-launch", // Use the passed postType
          image: {
            base64: "sample-base64",
            mediaType: "image/png",
            uint8Array: new Uint8Array(),
          },
        };

        setGeneratedPosts((prev) => [newPost, ...prev]);
        setCurrentPrompt("");
        toast.success("Post generated successfully!");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to generate post";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsGenerating(false);
      }
    },
    [selectedBrandKit]
  );

  const handleBackClick = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <div className="w-full flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="w-full flex justify-between items-center border-b border-border p-4 flex-shrink-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
            aria-label="Go back"
            className="hover:bg-accent"
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Post Generator
            </h1>
            <p className="text-sm text-muted-foreground">
              Generate posts with AI
            </p>
          </div>
        </div>
        <BrandKitSelector
          selectedBrandKit={selectedBrandKit}
          onBrandKitSelect={setSelectedBrandKit}
        />
      </header>
      {/* Main Content */}
      <main className="w-full flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 min-h-0 overflow-hidden">
        {/* Controls Panel */}
        <aside className="w-full lg:col-span-1 border border-border rounded-lg p-4 overflow-y-auto bg-card">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Controls</h2>

            {/* Prompt Toggle */}
            <motion.div
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-1">
                <Label htmlFor="prompt-toggle" className="text-sm font-medium">
                  Enable Prompt Input
                </Label>
                <motion.p
                  className="text-xs text-muted-foreground"
                  key={isPromptEnabled ? "enabled-desc" : "disabled-desc"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {isPromptEnabled
                    ? "Toggle the prompt input visibility"
                    : "Prompt input is hidden - image area expanded"}
                </motion.p>
              </div>
              <motion.div
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
              >
                <Switch
                  id="prompt-toggle"
                  checked={isPromptEnabled}
                  onCheckedChange={setIsPromptEnabled}
                  aria-label="Toggle prompt input"
                />
              </motion.div>
            </motion.div>

            {selectedBrandKit ? (
              <BrandKitPreviewCard brandKit={selectedBrandKit} />
            ) : (
              <div className="p-6 rounded-lg bg-muted/50 border border-border text-center">
                <p className="text-sm text-muted-foreground">
                  Select a brand kit to see details and generate content
                </p>
              </div>
            )}

            {/* Generated Image Display */}
            {generatedPosts.length > 0 && (
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-sm font-medium text-foreground">
                  Generated Image
                </h3>
                <div className="relative rounded-lg overflow-hidden border border-border">
                  <img
                    src="https://g04vidadm3.ufs.sh/f/WIG3ufijdLFMvZoMFBWBR1P0bFoQAOsyj5nfd4JNMVLg3ta8"
                    alt="Generated post image"
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {generatedPosts[0].timestamp.toLocaleTimeString()}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Generated for:{" "}
                  {generatedPosts[0].postType
                    ? POST_TYPES.find(
                        (pt) => pt.id === generatedPosts[0].postType
                      )?.label
                    : "Post"}
                </div>
              </motion.div>
            )}
          </div>
        </aside>

        {/* Right Column - Post Generator and Prompt Input */}
        <section className="w-full lg:col-span-2 flex flex-col gap-4">
          {/* Post Generation Area */}
          {/*<motion.div
            className="rounded-lg border border-border bg-card overflow-hidden"
            animate={{
              height: isPromptEnabled ? "auto" : "100%",
              flex: isPromptEnabled ? 1 : "none",
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            layout
          >
             <PostGenerator
              selectedBrandKit={selectedBrandKit}
              isGenerating={isGenerating}
              onGeneratePost={handleGeneratePost}
              className="h-full"
              hideInput={true}
              generatedPosts={generatedPosts}
              currentPrompt={currentPrompt}
            />
          </motion.div> */}

          {/* Prompt Input */}
          <AnimatePresence mode="wait">
            {isPromptEnabled && (
              <motion.div
                className="flex-shrink-0"
                initial={{ opacity: 0, height: 0, y: 20 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
                layout
              >
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                >
                  <PostGenerator
                    selectedBrandKit={selectedBrandKit}
                    isGenerating={isGenerating}
                    onGeneratePost={handleGeneratePost}
                    className="h-auto"
                    hideDisplay={true}
                    generatedPosts={generatedPosts}
                    currentPrompt={currentPrompt}
                  />
                </motion.div>
                <AnimatePresence>
                  {error && (
                    <motion.div
                      className="mt-2 p-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
};

export default PostsPage;
