"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Sparkles, Palette, Users, Zap, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrandKit } from "@/types/brand-kit";

interface BrandKitSelectorProps {
  selectedBrandKit?: BrandKit | null;
  onBrandKitSelect: (brandKit: BrandKit | null) => void;
  className?: string;
}

export function BrandKitSelector({
  selectedBrandKit,
  onBrandKitSelect,
  className = "",
}: BrandKitSelectorProps) {
  const { data: session } = useSession();
  const [brandKits, setBrandKits] = useState<BrandKit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      fetchBrandKits();
    }
  }, [session?.user?.id]);

  const fetchBrandKits = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/brandkit");
      if (!response.ok) {
        throw new Error("Failed to fetch brand kits");
      }

      const data = await response.json();
      setBrandKits(data.brandKits || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (brandKit: BrandKit | null) => {
    onBrandKitSelect(brandKit);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={`flex items-center gap-2 min-w-0 ${className}`}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {selectedBrandKit ? (
              <>
                <div className="flex items-center gap-1">
                  {selectedBrandKit.brandColors
                    .slice(0, 3)
                    .map((color, index) => (
                      <div
                        key={index}
                        className="w-3 h-3 rounded-full border border-border"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                </div>
                <span className="truncate text-sm font-medium">
                  {selectedBrandKit.productTitle}
                </span>
                <Badge
                  variant={
                    selectedBrandKit.status === "COMPLETED"
                      ? "default"
                      : "secondary"
                  }
                  className="text-xs"
                >
                  {selectedBrandKit.status}
                </Badge>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Select Brand Kit
                </span>
              </>
            )}
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Select Brand Kit
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* No Brand Kit Option */}
          <Card
            className={`cursor-pointer transition-colors hover:bg-muted/50 ${
              !selectedBrandKit ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => handleSelect(null)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg border-2 border-border bg-muted flex items-center justify-center">
                  <X className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">No Brand Kit</h3>
                  <p className="text-sm text-muted-foreground">
                    Generate content without brand guidelines
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loading State */}
          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-12 h-12 rounded-lg" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-destructive">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchBrandKits}
                  className="mt-2"
                >
                  Retry
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Brand Kits List */}
          {!loading && !error && (
            <div className="space-y-3">
              {brandKits.length === 0 ? (
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-muted-foreground">
                      No brand kits available
                    </p>
                  </CardContent>
                </Card>
              ) : (
                brandKits.map((brandKit) => (
                  <Card
                    key={brandKit.id}
                    className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedBrandKit?.id === brandKit.id
                        ? "ring-2 ring-primary"
                        : ""
                    }`}
                    onClick={() => handleSelect(brandKit)}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Product Images Preview */}
                        <div className="flex gap-2">
                          {brandKit.productImages
                            .slice(0, 3)
                            .map((image, index) => (
                              <div
                                key={image.id}
                                className="w-12 h-12 rounded-lg border border-border overflow-hidden bg-muted"
                              >
                                <img
                                  src={image.previewUrl || image.imageUrl}
                                  alt={`Product ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          {brandKit.productImages.length > 3 && (
                            <div className="w-12 h-12 rounded-lg border border-border bg-muted flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">
                                +{brandKit.productImages.length - 3}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Brand Kit Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium truncate">
                              {brandKit.productTitle}
                            </h3>
                            <Badge
                              variant={
                                brandKit.status === "COMPLETED"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {brandKit.status}
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {brandKit.productDescription}
                          </p>

                          {/* Brand Colors */}
                          <div className="flex items-center gap-2 mb-2">
                            <Palette className="w-3 h-3 text-muted-foreground" />
                            <div className="flex gap-1">
                              {brandKit.brandColors
                                .slice(0, 6)
                                .map((color, index) => (
                                  <div
                                    key={index}
                                    className="w-4 h-4 rounded-full border border-border"
                                    style={{ backgroundColor: color }}
                                  />
                                ))}
                              {brandKit.brandColors.length > 6 && (
                                <div className="w-4 h-4 rounded-full border border-border bg-muted flex items-center justify-center">
                                  <span className="text-xs text-muted-foreground">
                                    +{brandKit.brandColors.length - 6}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Features */}
                          <div className="flex items-center gap-2">
                            <Zap className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {brandKit.extractedFeatures.length} features
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
