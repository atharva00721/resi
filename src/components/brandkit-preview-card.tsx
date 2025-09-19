"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Palette,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { BrandKit } from "@/types/brand-kit";

interface BrandKitPreviewCardProps {
  brandKit: BrandKit;
  className?: string;
}

export function BrandKitPreviewCard({
  brandKit,
  className = "",
}: BrandKitPreviewCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card
      className={`${className} transition-all duration-200 hover:shadow-sm`}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader
          className="pt-2 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-sm text-muted-foreground">BrandKit:</span>
              <CardTitle className="text-sm font-medium truncate">
                {brandKit.productTitle}
              </CardTitle>
            </div>

            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 flex-shrink-0 hover:bg-muted"
              >
                {isOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>

        <CollapsibleContent className="overflow-hidden">
          <CardContent className="pt-0 space-y-4 pb-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2 rounded-md bg-muted/50">
                <div className="text-sm font-semibold text-foreground">
                  {brandKit.productImages.length}
                </div>
                <div className="text-xs text-muted-foreground">Images</div>
              </div>
              <div className="p-2 rounded-md bg-muted/50">
                <div className="text-sm font-semibold text-foreground">
                  {brandKit.brandColors.length}
                </div>
                <div className="text-xs text-muted-foreground">Colors</div>
              </div>
              <div className="p-2 rounded-md bg-muted/50">
                <div className="text-sm font-semibold text-foreground">
                  {brandKit.extractedFeatures.length}
                </div>
                <div className="text-xs text-muted-foreground">Features</div>
              </div>
            </div>

            {/* Product Images */}
            {brandKit.productImages.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    Product Images
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {brandKit.productImages.slice(0, 6).map((image, index) => (
                    <div
                      key={image.id}
                      className="aspect-square rounded-lg border border-border overflow-hidden bg-muted group cursor-pointer"
                    >
                      <img
                        src={image.previewUrl || image.imageUrl}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  ))}
                  {brandKit.productImages.length > 6 && (
                    <div className="aspect-square rounded-lg border border-border bg-muted flex items-center justify-center">
                      <span className="text-xs text-muted-foreground font-medium">
                        +{brandKit.productImages.length - 6}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Brand Colors */}
            {brandKit.brandColors.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    Brand Colors
                  </span>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {brandKit.brandColors.map((color, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg border border-border cursor-pointer hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Key Features */}
            {brandKit.extractedFeatures.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    Key Features
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {brandKit.extractedFeatures
                    .slice(0, 8)
                    .map((feature, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs px-2 py-1"
                      >
                        {feature}
                      </Badge>
                    ))}
                  {brandKit.extractedFeatures.length > 8 && (
                    <Badge variant="outline" className="text-xs px-2 py-1">
                      +{brandKit.extractedFeatures.length - 8} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Additional Insights */}
            {(brandKit.audience ||
              brandKit.productVibes ||
              brandKit.brandPersonality) && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    AI Insights
                  </span>
                </div>
                <div className="space-y-2">
                  {brandKit.audience && (
                    <div className="p-2 rounded-md bg-blue-50 border border-blue-200">
                      <div className="text-xs font-medium text-blue-900 mb-1">
                        Target Audience
                      </div>
                      <div className="text-xs text-blue-800">
                        {brandKit.audience}
                      </div>
                    </div>
                  )}
                  {brandKit.productVibes && (
                    <div className="p-2 rounded-md bg-green-50 border border-green-200">
                      <div className="text-xs font-medium text-green-900 mb-1">
                        Product Vibes
                      </div>
                      <div className="text-xs text-green-800">
                        {brandKit.productVibes}
                      </div>
                    </div>
                  )}
                  {brandKit.brandPersonality && (
                    <div className="p-2 rounded-md bg-purple-50 border border-purple-200">
                      <div className="text-xs font-medium text-purple-900 mb-1">
                        Brand Personality
                      </div>
                      <div className="text-xs text-purple-800">
                        {brandKit.brandPersonality}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
