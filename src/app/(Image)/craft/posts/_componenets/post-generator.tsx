"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrandKit } from "@/types/brand-kit";
import { toast } from "sonner";

// AI Elements
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageAvatar,
} from "@/components/ai-elements/message";
import {
  ChainOfThought,
  ChainOfThoughtHeader,
  ChainOfThoughtContent,
  ChainOfThoughtStep,
} from "@/components/ai-elements/chain-of-thought";
import { Image as AIImage } from "@/components/ai-elements/image";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Response } from "@/components/ai-elements/response";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader,
  Send,
  Brain,
  Image as ImageIcon,
  Sparkles,
  Calendar,
  Megaphone,
  Star,
  Gift,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

export type PostType =
  | "product-launch"
  | "feature-highlight"
  | "promotional-offer"
  | "customer-testimonial"
  | "product-comparison"
  | "use-case-showcase"
  | "pricing-announcement"
  | "partnership-news"
  | "industry-insights"
  | "brand-story";

export interface PostTypeOption {
  id: PostType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export const POST_TYPES: PostTypeOption[] = [
  {
    id: "product-launch",
    label: "Product Launch",
    description: "Announce and promote new product releases",
    icon: Zap,
    color: "bg-blue-500",
  },
  {
    id: "feature-highlight",
    label: "Feature Highlight",
    description: "Showcase key product features and benefits",
    icon: Star,
    color: "bg-purple-500",
  },
  {
    id: "promotional-offer",
    label: "Promotional Offer",
    description: "Create compelling discount and offer campaigns",
    icon: TrendingUp,
    color: "bg-green-500",
  },
  {
    id: "customer-testimonial",
    label: "Customer Testimonial",
    description: "Share authentic customer success stories",
    icon: Users,
    color: "bg-yellow-500",
  },
  {
    id: "product-comparison",
    label: "Product Comparison",
    description: "Compare your product against competitors",
    icon: ImageIcon,
    color: "bg-red-500",
  },
  {
    id: "use-case-showcase",
    label: "Use Case Showcase",
    description: "Demonstrate real-world product applications",
    icon: Calendar,
    color: "bg-orange-500",
  },
  {
    id: "pricing-announcement",
    label: "Pricing Announcement",
    description: "Communicate pricing changes and plans",
    icon: Megaphone,
    color: "bg-pink-500",
  },
  {
    id: "partnership-news",
    label: "Partnership News",
    description: "Announce strategic partnerships and collaborations",
    icon: Gift,
    color: "bg-indigo-500",
  },
  {
    id: "industry-insights",
    label: "Industry Insights",
    description: "Share market trends and industry expertise",
    icon: Brain,
    color: "bg-teal-500",
  },
  {
    id: "brand-story",
    label: "Brand Story",
    description: "Tell your company's mission and values",
    icon: Sparkles,
    color: "bg-cyan-500",
  },
];

interface GeneratedPost {
  id: string;
  content: string;
  image?: {
    base64: string;
    mediaType: string;
    uint8Array: Uint8Array;
  };
  reasoning?: string[];
  timestamp: Date;
  postType?: PostType;
}

interface PostGeneratorProps {
  selectedBrandKit: BrandKit | null;
  isGenerating: boolean;
  onGeneratePost: (message: string, postType: PostType) => Promise<void>;
  className?: string;
  hideInput?: boolean;
  hideDisplay?: boolean;
  generatedPosts?: GeneratedPost[];
  currentPrompt?: string;
}

export function PostGenerator({
  selectedBrandKit,
  isGenerating,
  onGeneratePost,
  className,
  hideInput = false,
  hideDisplay = false,
  generatedPosts = [],
  currentPrompt = "",
}: PostGeneratorProps) {
  const [selectedPostType, setSelectedPostType] = useState<PostType | null>(
    null
  );
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isCollectingData, setIsCollectingData] = useState(false);
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const message = formData.get("message") as string;

      if (!message.trim()) {
        toast.error("Please enter a description for your post");
        return;
      }

      if (!selectedBrandKit) {
        toast.error("Please select a brand kit first");
        return;
      }

      if (!selectedPostType) {
        toast.error("Please select a post type first");
        return;
      }

      try {
        await onGeneratePost(message, selectedPostType);
        // Reset form only if currentTarget still exists
        if (e.currentTarget) {
          e.currentTarget.reset();
        }
      } catch (error) {
        console.error("Error generating post:", error);
      }
    },
    [selectedBrandKit, selectedPostType, onGeneratePost]
  );

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Generated Posts Display - Disabled for now */}
      {false && !hideDisplay && (
        <div className="flex-1 min-h-0">
          <Conversation className="h-full">
            <ConversationContent>
              {generatedPosts.length > 0 && (
                <div className="space-y-6">
                  {generatedPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <Message from="user">
                        <MessageContent>
                          <div className="flex items-center gap-2">
                            {post.postType &&
                              (() => {
                                const postTypeOption = POST_TYPES.find(
                                  (pt) => pt.id === post.postType
                                );
                                if (!postTypeOption)
                                  return <ImageIcon className="w-4 h-4" />;
                                const Icon = postTypeOption.icon;
                                return (
                                  <div
                                    className={`w-6 h-6 rounded-full ${postTypeOption.color} flex items-center justify-center`}
                                  >
                                    <Icon className="w-3 h-3 text-white" />
                                  </div>
                                );
                              })()}
                            <span className="font-medium">
                              {post.postType
                                ? POST_TYPES.find(
                                    (pt) => pt.id === post.postType
                                  )?.label
                                : "Post Request"}
                            </span>
                          </div>
                          <p>{currentPrompt || "Generated post request"}</p>
                        </MessageContent>
                        <MessageAvatar
                          src="/api/placeholder/32/32"
                          name="You"
                        />
                      </Message>

                      <Message from="assistant">
                        <MessageContent>
                          <div className="space-y-4">
                            <ChainOfThought defaultOpen={false}>
                              <ChainOfThoughtHeader>
                                AI Reasoning Process
                              </ChainOfThoughtHeader>
                              <ChainOfThoughtContent>
                                {post.reasoning?.map((step, index) => (
                                  <ChainOfThoughtStep
                                    key={index}
                                    label={step}
                                    status="complete"
                                    icon={Brain}
                                  />
                                ))}
                              </ChainOfThoughtContent>
                            </ChainOfThought>

                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-primary" />
                                <span className="font-medium">
                                  Generated Post
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                  {post.timestamp.toLocaleTimeString()}
                                </Badge>
                              </div>

                              <div className="prose prose-sm max-w-none">
                                {post.content.split("\n").map((line, index) => (
                                  <p key={index} className="mb-2 last:mb-0">
                                    {line}
                                  </p>
                                ))}
                              </div>

                              {post.image && (
                                <div className="mt-4">
                                  <img
                                    src="https://g04vidadm3.ufs.sh/f/WIG3ufijdLFMvZoMFBWBR1P0bFoQAOsyj5nfd4JNMVLg3ta8"
                                    alt="Generated post image"
                                    className="w-full max-w-md mx-auto rounded-lg border"
                                    loading="lazy"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </MessageContent>
                        <MessageAvatar src="/api/placeholder/32/32" name="AI" />
                      </Message>
                    </motion.div>
                  ))}
                </div>
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
        </div>
      )}

      {/* Post Type Selection */}
      {!hideInput && !selectedPostType && !isCollectingData && (
        <div className="flex-1 flex flex-col justify-center p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-3">Choose Post Type</h3>
            <p className="text-muted-foreground text-lg">
              Select the type of post you want to generate
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-6xl mx-auto w-full">
            {POST_TYPES.map((postType) => {
              const Icon = postType.icon;
              return (
                <motion.button
                  key={postType.id}
                  onClick={() => setSelectedPostType(postType.id)}
                  className="group relative p-6 rounded-xl border-2 border-border hover:border-primary/50 transition-all duration-200 bg-card hover:bg-accent/50 h-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex flex-col items-center space-y-4 h-full">
                    <div
                      className={`w-16 h-16 rounded-full ${postType.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-center flex-1 flex flex-col justify-center">
                      <h4 className="font-semibold text-base group-hover:text-primary transition-colors mb-2">
                        {postType.label}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {postType.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Dynamic Form Based on Post Type */}
      {!hideInput && selectedPostType && !isCollectingData && (
        <div className="flex-1 flex flex-col p-6">
          <div className="max-w-2xl mx-auto w-full">
            <div className="flex items-center gap-4 mb-8">
              {(() => {
                const postTypeOption = POST_TYPES.find(
                  (pt) => pt.id === selectedPostType
                );
                if (!postTypeOption) return null;
                const Icon = postTypeOption.icon;
                return (
                  <>
                    <div
                      className={`w-12 h-12 rounded-full ${postTypeOption.color} flex items-center justify-center`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">
                        {postTypeOption.label} Details
                      </h3>
                      <p className="text-muted-foreground">
                        {postTypeOption.description}
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsCollectingData(true);

                try {
                  // Create a comprehensive message from the form data
                  let message = `Generate a ${POST_TYPES.find(
                    (pt) => pt.id === selectedPostType
                  )?.label.toLowerCase()} post`;

                  if (selectedPostType === "product-launch") {
                    if (formData.launchDate) {
                      message += ` launching on ${formData.launchDate}`;
                    }
                  } else if (selectedPostType === "feature-highlight") {
                    if (formData.featureName) {
                      message += ` for "${formData.featureName}"`;
                    }
                    if (formData.benefits) {
                      message += ` with benefits: ${formData.benefits}`;
                    }
                    if (formData.useCase) {
                      message += `. Use case: ${formData.useCase}`;
                    }
                  } else if (selectedPostType === "promotional-offer") {
                    if (formData.offerTitle) {
                      message += `: "${formData.offerTitle}"`;
                    }
                    if (formData.discount) {
                      message += ` offering ${formData.discount}`;
                    }
                    if (formData.validUntil) {
                      message += ` valid until ${formData.validUntil}`;
                    }
                    if (formData.offerDetails) {
                      message += `. Details: ${formData.offerDetails}`;
                    }
                  } else {
                    // For other post types, use the description field
                    if (formData.description) {
                      message += `: ${formData.description}`;
                    }
                  }

                  // Add optional fields for all post types
                  if (formData.guidance) {
                    message += `. Additional guidance: ${formData.guidance}`;
                  }
                  if (formData.referenceLink) {
                    message += `. Reference post for editing: ${formData.referenceLink}`;
                  }

                  // Call the actual generation function
                  await onGeneratePost(message, selectedPostType!);

                  // Reset form and state
                  setFormData({});
                  setSelectedPostType(null);
                } catch (error) {
                  console.error("Error generating post:", error);
                  toast.error("Failed to generate post. Please try again.");
                } finally {
                  setIsCollectingData(false);
                }
              }}
              className="space-y-4"
            >
              {selectedPostType === "product-launch" && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Launch Date{" "}
                      <span className="text-muted-foreground text-xs">
                        (Optional)
                      </span>
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.launchDate || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, launchDate: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Additional Guidance{" "}
                      <span className="text-muted-foreground text-xs">
                        (Optional)
                      </span>
                    </label>
                    <textarea
                      placeholder="Any specific tone, style, or additional information for the post generation?"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[60px] resize-none"
                      value={formData.guidance || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, guidance: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Reference Post Link{" "}
                      <span className="text-muted-foreground text-xs">
                        (Optional)
                      </span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/post-to-edit"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.referenceLink || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          referenceLink: e.target.value,
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Provide a link to an existing post that you'd like to use
                      as a reference for editing
                    </p>
                  </div>
                </>
              )}

              {selectedPostType === "feature-highlight" && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Feature Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Advanced Analytics, AI-Powered Insights, Real-time Collaboration"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.featureName || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          featureName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Key Benefits
                    </label>
                    <textarea
                      placeholder="What problems does this feature solve? What are the main benefits for users?"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px] resize-none"
                      value={formData.benefits || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, benefits: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Use Case Example
                    </label>
                    <textarea
                      placeholder="Describe a specific scenario where this feature would be valuable"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[60px] resize-none"
                      value={formData.useCase || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, useCase: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Additional Guidance{" "}
                      <span className="text-muted-foreground text-xs">
                        (Optional)
                      </span>
                    </label>
                    <textarea
                      placeholder="Any specific tone, style, or additional information for the post generation?"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[60px] resize-none"
                      value={formData.guidance || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, guidance: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Reference Post Link{" "}
                      <span className="text-muted-foreground text-xs">
                        (Optional)
                      </span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/post-to-edit"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.referenceLink || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          referenceLink: e.target.value,
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Provide a link to an existing post that you'd like to use
                      as a reference for editing
                    </p>
                  </div>
                </>
              )}

              {selectedPostType === "promotional-offer" && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Offer Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 50% Off Premium Plan, Free Trial Extension, Limited Time Deal"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.offerTitle || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, offerTitle: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Discount/Offer
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., 50% off, Buy 2 Get 1 Free, $50 credit"
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.discount || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, discount: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Valid Until
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.validUntil || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            validUntil: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Offer Details
                    </label>
                    <textarea
                      placeholder="What's included in this offer? Any terms and conditions?"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px] resize-none"
                      value={formData.offerDetails || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          offerDetails: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Additional Guidance{" "}
                      <span className="text-muted-foreground text-xs">
                        (Optional)
                      </span>
                    </label>
                    <textarea
                      placeholder="Any specific tone, style, or additional information for the post generation?"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[60px] resize-none"
                      value={formData.guidance || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, guidance: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Reference Post Link{" "}
                      <span className="text-muted-foreground text-xs">
                        (Optional)
                      </span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/post-to-edit"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.referenceLink || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          referenceLink: e.target.value,
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Provide a link to an existing post that you'd like to use
                      as a reference for editing
                    </p>
                  </div>
                </>
              )}

              {/* Default form for other post types */}
              {![
                "product-launch",
                "feature-highlight",
                "promotional-offer",
              ].includes(selectedPostType!) && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Post Description
                    </label>
                    <textarea
                      placeholder={`Describe your ${POST_TYPES.find(
                        (pt) => pt.id === selectedPostType
                      )?.label.toLowerCase()} post...`}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] resize-none"
                      value={formData.description || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Additional Guidance{" "}
                      <span className="text-muted-foreground text-xs">
                        (Optional)
                      </span>
                    </label>
                    <textarea
                      placeholder="Any specific tone, style, or additional information for the post generation?"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[60px] resize-none"
                      value={formData.guidance || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, guidance: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Reference Post Link{" "}
                      <span className="text-muted-foreground text-xs">
                        (Optional)
                      </span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/post-to-edit"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.referenceLink || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          referenceLink: e.target.value,
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Provide a link to an existing post that you'd like to use
                      as a reference for editing
                    </p>
                  </div>
                </>
              )}

              <div className="flex items-center justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSelectedPostType(null);
                    setFormData({});
                  }}
                >
                  Back to Types
                </Button>
                <Button
                  type="submit"
                  disabled={isGenerating}
                  className="ml-auto"
                >
                  {isGenerating ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Post
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generating Screen */}
      {!hideInput && isCollectingData && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Loader className="w-8 h-8 animate-spin text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Generating Your Post</h3>
              <p className="text-sm text-muted-foreground">
                Creating your{" "}
                {POST_TYPES.find(
                  (pt) => pt.id === selectedPostType
                )?.label.toLowerCase() || "selected"}{" "}
                post using your brand kit...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
