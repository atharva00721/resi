"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Trash2, Calendar } from "lucide-react";
import { useBrandKit } from "@/hooks/use-brandkit";

interface BrandKitListProps {
  onNewBrandKit: () => void;
}

export function BrandKitList({ onNewBrandKit }: BrandKitListProps) {
  const { brandKits, loading, error, deleteBrandKit } = useBrandKit();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this brand kit?")) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteBrandKit(id);
    } catch (error) {
      console.error("Failed to delete brand kit:", error);
      alert("Failed to delete brand kit. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800";
      case "ARCHIVED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading brand kits...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error loading brand kits: {error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Your Brand Kits
          </h2>
          <p className="text-gray-600">
            {brandKits.length} brand kit{brandKits.length !== 1 ? "s" : ""}{" "}
            created
          </p>
        </div>
        <Button
          onClick={onNewBrandKit}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Brand Kit
        </Button>
      </div>

      {/* Brand Kits Grid */}
      {brandKits.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No brand kits yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first brand kit to get started
          </p>
          <Button
            onClick={onNewBrandKit}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Brand Kit
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brandKits.map((brandKit) => (
            <Card
              key={brandKit.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {brandKit.productTitle}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {brandKit.productDescription}
                    </p>
                  </div>
                  <Badge className={getStatusColor(brandKit.status)}>
                    {brandKit.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{brandKit.productImages.length} images</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(brandKit.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Brand Colors Preview */}
                  {brandKit.brandColors.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-700">
                        Brand Colors ({brandKit.brandColors.length})
                      </p>
                      <div className="flex gap-1">
                        {brandKit.brandColors
                          .slice(0, 5)
                          .map((color, index) => (
                            <div
                              key={index}
                              className="w-6 h-6 rounded-full border border-gray-200"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        {brandKit.brandColors.length > 5 && (
                          <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-600">
                              +{brandKit.brandColors.length - 5}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        window.location.href = `/brandkit/${brandKit.id}`;
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(brandKit.id)}
                      disabled={deletingId === brandKit.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
