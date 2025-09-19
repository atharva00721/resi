"use client";

import { useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Palette,
  Users,
  Zap,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BrandKitDetail {
  id: string;
  productTitle: string;
  productDescription: string;
  logoUrl?: string;
  logoPreviewUrl?: string;
  extractedFeatures: string[];
  brandColors: string[];
  audience?: string;
  productVibes?: string;
  brandPersonality?: string;
  status: "DRAFT" | "PROCESSING" | "COMPLETED" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
  productImages: Array<{
    id: string;
    imageUrl: string;
    previewUrl?: string;
    order: number;
  }>;
}

interface AIInsightsProps {
  brandKit: BrandKitDetail;
  loading?: boolean;
  error?: string | null;
}

export function AIInsights({
  brandKit,
  loading = false,
  error = null,
}: AIInsightsProps) {
  const [copiedColors, setCopiedColors] = useState<Set<number>>(new Set());

  const copyColorToClipboard = async (color: string, index: number) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedColors((prev) => new Set(prev).add(index));
      toast.success(`Color ${color} copied to clipboard`);

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedColors((prev) => {
          const newSet = new Set(prev);
          newSet.delete(index);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      toast.error("Failed to copy color");
    }
  };

  const hasInsights =
    brandKit.extractedFeatures.length > 0 ||
    brandKit.brandColors.length > 0 ||
    brandKit.audience ||
    brandKit.productVibes ||
    brandKit.brandPersonality;

  // Loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
            AI-Generated Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="flex gap-2">
              <div className="h-6 bg-muted rounded w-20"></div>
              <div className="h-6 bg-muted rounded w-24"></div>
              <div className="h-6 bg-muted rounded w-16"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <Sparkles className="w-5 h-5 mr-2" />
            AI-Generated Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-destructive mb-2">⚠️</div>
            <p className="text-destructive text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (!hasInsights) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="w-5 h-5 mr-2" />
            AI-Generated Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-muted-foreground mb-4">
              <Sparkles className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No AI insights available
            </h3>
            <p className="text-muted-foreground text-sm">
              AI insights will appear here once your brand kit has been
              processed.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="w-5 h-5 mr-2" />
          AI-Generated Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Extracted Features */}
        {brandKit.extractedFeatures.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">
                Key Features
              </h3>
              <Badge variant="secondary" className="text-xs">
                {brandKit.extractedFeatures.length}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {brandKit.extractedFeatures.map((feature, index) => (
                <Badge
                  key={index}
                  className="text-sm px-3 py-1.5"
                  variant="outline"
                >
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Brand Colors */}
        {brandKit.brandColors.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">
                Brand Colors
              </h3>
              <Badge variant="secondary" className="text-xs">
                {brandKit.brandColors.length}
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {brandKit.brandColors.map((color, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-3 p-3 rounded-lg border border-border hover:border-border/80 transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-lg border-2 border-border shadow-sm"
                    style={{ backgroundColor: color }}
                    title={`Color: ${color}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono text-foreground truncate">
                      {color}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {copiedColors.has(index) ? "Copied!" : "Click to copy"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyColorToClipboard(color, index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                  >
                    {copiedColors.has(index) ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {brandKit.audience && (
            <div className="space-y-3 p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-foreground">
                  Target Audience
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {brandKit.audience}
              </p>
            </div>
          )}

          {brandKit.productVibes && (
            <div className="space-y-3 p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-foreground">
                  Product Vibes
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {brandKit.productVibes}
              </p>
            </div>
          )}

          {brandKit.brandPersonality && (
            <div className="space-y-3 p-4 rounded-lg bg-muted/50 border border-border lg:col-span-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-foreground">
                  Brand Personality
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {brandKit.brandPersonality}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
